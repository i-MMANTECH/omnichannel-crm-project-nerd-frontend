import React, { useEffect, useMemo, useRef, useState } from "react";
import Drawer from "@/app/components/Drawer";
import { toast } from "react-toastify";

const ACTION_TYPE_OPTIONS = [
    { value: "welcome", label: "Welcome" },
    { value: "auto_reply", label: "Auto Reply" },
];

function stripWrappingQuotes(v = "") {
    const s = String(v ?? "");
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
    return s;
}

export default function EditTemplateDrawer({
    open,
    onClose,
    axiosInstance,
    templateId,
    connectedChannels = [], // [{ label, value }]
    onUpdated, // ({ oldChannelType, newChannelType }) => void
}) {
    // request guard (prevents stuck loading in strict mode)
    const reqIdRef = useRef(0);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // keep original so we can detect changes
    const [original, setOriginal] = useState(null);

    // form fields
    const [name, setName] = useState("");
    const [channelType, setChannelType] = useState("");
    const [actionType, setActionType] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [body, setBody] = useState("");
    const [isActive, setIsActive] = useState(false);

    // footer image (existing + new)
    const [existingFooterUrl, setExistingFooterUrl] = useState("");
    const [footerFile, setFooterFile] = useState(null);
    const [footerPreview, setFooterPreview] = useState("");

    const isEmail = channelType === "email";
    const canUploadFooter = channelType === "email" || channelType === "livechat";

    // cleanup object url
    useEffect(() => {
        return () => {
            if (footerPreview) URL.revokeObjectURL(footerPreview);
        };
    }, [footerPreview]);

    // fetch & prefill when opening
    useEffect(() => {
        if (!open || !templateId) return;

        reqIdRef.current += 1;
        const reqId = reqIdRef.current;

        setLoading(true);
        setSaving(false);
        setOriginal(null);

        (async () => {
            try {
                const res = await axiosInstance.get(`/communication/templates/${templateId}/`);
                if (reqIdRef.current !== reqId) return;

                if (!res.data?.success) {
                    toast.error(res.data?.message || "Failed to load template.");
                    setLoading(false);
                    return;
                }

                const tpl = res.data.data;
                setOriginal(tpl);

                setName(tpl.name || "");
                setChannelType(tpl.channel_type || "");
                setActionType(tpl.action_type || "");
                setEmailSubject(stripWrappingQuotes(tpl.email_subject || ""));
                setBody(tpl.body || "");
                setIsActive(Boolean(tpl.is_active));

                setExistingFooterUrl(tpl.footer_image || "");
                setFooterFile(null);

                if (footerPreview) URL.revokeObjectURL(footerPreview);
                setFooterPreview("");
            } catch (e) {
                if (reqIdRef.current !== reqId) return;
                toast.error("Failed to load template.");
            } finally {
                if (reqIdRef.current === reqId) setLoading(false);
            }
        })();
        // intentionally not depending on axiosInstance to avoid effect re-run loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, templateId]);

    // if user changes channel away from email, clear subject and footer pick (optional)
    useEffect(() => {
        if (!open) return;

        if (channelType !== "email") {
            setEmailSubject("");
        }

        if (!(channelType === "email" || channelType === "livechat")) {
            // keep existingFooterUrl (it may still exist on backend), but prevent new upload
            setFooterFile(null);
            if (footerPreview) URL.revokeObjectURL(footerPreview);
            setFooterPreview("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelType]);

    const validate = () => {
        if (!name.trim()) return "Template name is required.";
        if (!channelType) return "Channel type is required.";
        if (!actionType) return "Service type is required.";
        if (isEmail && !emailSubject.trim()) return "Email subject is required for Email.";
        if (!body.trim()) return "Message body is required.";

        if (footerFile) {
            const okType =
                footerFile.type === "image/png" ||
                footerFile.type === "image/jpeg" ||
                footerFile.type === "image/jpg";
            if (!okType) return "Footer image must be PNG or JPG.";

            const maxBytes = 5 * 1024 * 1024;
            if (footerFile.size > maxBytes) return "Footer image must be 5MB or less.";
        }

        return null;
    };

    const onPickFooter = (file) => {
        if (!file) return;

        if (!canUploadFooter) {
            toast.error("Footer image is only supported for Email / Livechat.");
            return;
        }

        if (footerPreview) URL.revokeObjectURL(footerPreview);
        setFooterFile(file);
        setFooterPreview(URL.createObjectURL(file));
    };

    const buildPatchFormData = () => {
        const fd = new FormData();

        // helper: append only if value changed vs original (so PATCH stays “patchy”)
        const appendIfChanged = (key, nextVal, transform = (x) => x) => {
            const prevVal = original?.[key];
            const a = transform(prevVal ?? "");
            const b = transform(nextVal ?? "");
            if (a !== b) fd.append(key, String(nextVal ?? ""));
        };

        appendIfChanged("name", name.trim());
        appendIfChanged("action_type", actionType);
        appendIfChanged("channel_type", channelType);

        // email-only
        if (channelType === "email") {
            appendIfChanged("email_subject", emailSubject.trim(), (x) => stripWrappingQuotes(x));
        }

        appendIfChanged("body", body);

        // booleans
        const prevActive = Boolean(original?.is_active);
        if (prevActive !== Boolean(isActive)) {
            fd.append("is_active", isActive ? "true" : "false");
        }

        // new file only if user picked one
        if (footerFile && canUploadFooter) {
            fd.append("footer_image", footerFile);
        }

        return fd;
    };

    const onSave = async () => {
        if (!original) return;

        const err = validate();
        if (err) return toast.error(err);

        const oldChannelType = original.channel_type;

        setSaving(true);
        try {
            const fd = buildPatchFormData();

            // if user didn't change anything, don't call API
            const hasAnyField = Array.from(fd.keys()).length > 0;
            if (!hasAnyField) {
                toast.info("No changes to save.");
                setSaving(false);
                onClose?.();
                return;
            }

            const res = await axiosInstance.patch(
                `/communication/templates/${templateId}/`,
                fd
            );

            if (res.data?.success) {
                toast.success("Template updated successfully.");

                const newChannelType = channelType;
                onUpdated?.({ oldChannelType, newChannelType });

                onClose?.();
            } else {
                toast.error(res.data?.message || "Failed to update template.");
            }
        } catch (e) {
            toast.error("Failed to update template. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const footer = (
        <div className="flex items-center justify-end gap-3">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                disabled={saving}
            >
                Cancel
            </button>

            <button
                type="button"
                onClick={onSave}
                disabled={saving || loading}
                className="px-5 py-2 rounded-lg bg-[#3EBF0F] text-white text-sm hover:bg-[#34ab0d] disabled:opacity-60"
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );

    return (
        <Drawer
            show={open}
            onClose={onClose}
            title="Edit Template"
            subtitle="Update your auto-response template"
            width="40%"
            footer={footer}
        >
            {loading ? (
                <div className="text-sm text-gray-600">Loading template…</div>
            ) : !original ? (
                <div className="text-sm text-gray-600">No template data.</div>
            ) : (
                <div className="space-y-6">
                    {/* Template Name */}
                    <div>
                        <label className="text-sm font-medium">
                            Template Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Template Name"
                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#3EBF0F]/20"
                        />
                    </div>

                    {/* Channel Type */}
                    <div>
                        <label className="text-sm font-medium">
                            Channel Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={channelType}
                            onChange={(e) => setChannelType(e.target.value)}
                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none bg-white"
                        >
                            <option value="">Select channel type</option>
                            {connectedChannels.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service Type (action_type) */}
                    <div>
                        <label className="text-sm font-medium">
                            Service Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={actionType}
                            onChange={(e) => setActionType(e.target.value)}
                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none bg-white"
                        >
                            <option value="">Select service type</option>
                            {ACTION_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Email Subject (ONLY show if email) */}
                    {isEmail ? (
                        <div>
                            <label className="text-sm font-medium">
                                Email Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder='Welcome to {{company_name}}'
                                className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
                            />
                        </div>
                    ) : null}

                    {/* Message Body */}
                    <div>
                        <label className="text-sm font-medium">
                            Message Body <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={5}
                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Use <span className="font-mono">{'{{customer_name}}'}</span> to personalize.
                        </p>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Set as active template
                        </label>
                    </div>

                    {/* Footer Image (ONLY show if email/livechat) */}
                    {(channelType === "email" || channelType === "livechat") ? (
                        <div>
                            <label className="text-sm font-medium">Footer Image (Optional)</label>

                            <div className="mt-2 border border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    onChange={(e) => onPickFooter(e.target.files?.[0])}
                                    className="block w-full text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>

                                {/* Preview: new picked file OR existing url */}
                                {footerPreview ? (
                                    <div className="mt-4">
                                        <img
                                            src={footerPreview}
                                            alt="New footer preview"
                                            className="max-h-40 mx-auto rounded-lg border"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">New image (not saved yet)</p>
                                    </div>
                                ) : existingFooterUrl ? (
                                    <div className="mt-4">
                                        <img
                                            src={existingFooterUrl}
                                            alt="Current footer"
                                            className="max-h-40 mx-auto rounded-lg border"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Current image</p>
                                    </div>
                                ) : null}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Add optional image to appear at the bottom of your message.
                            </p>
                        </div>
                    ) : null}
                </div>
            )}
        </Drawer>
    );
}
