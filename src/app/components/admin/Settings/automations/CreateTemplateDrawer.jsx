import React, { useEffect, useMemo, useState } from "react";
import Drawer from "@/app/components/Drawer";
import { toast } from "react-toastify";

const ACTION_TYPE_OPTIONS = [
    { value: "welcome", label: "Welcome" },
    { value: "auto_reply", label: "Auto Reply" },
];

export default function CreateTemplateDrawer({
    open,
    onClose,
    axiosInstance,
    connectedChannels = [], // [{ label: "Email", value: "email" }, ...]
    defaultChannelType = "",
    onCreated, // (channelType) => void
}) {
    // Form state
    const [name, setName] = useState("");
    const [channelType, setChannelType] = useState(defaultChannelType || "");
    const [actionType, setActionType] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [body, setBody] = useState("Hi {{customer_name}}, thanks for reaching out");
    const [isActive, setIsActive] = useState(true);

    // Footer image (optional)
    const [footerFile, setFooterFile] = useState(null);
    const [footerPreview, setFooterPreview] = useState("");

    // UI state
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Keep channelType in sync when user opens drawer from “Add Template” on a channel
    useEffect(() => {
        if (!open) return;
        setChannelType(defaultChannelType || "");
    }, [open, defaultChannelType]);

    // Reset form when drawer closes (so next open is clean)
    useEffect(() => {
        if (open) return;

        setName("");
        setChannelType("");
        setActionType("");
        setEmailSubject("");
        setBody("Hi {{customer_name}}, thanks for reaching out");
        setIsActive(true);

        setFooterFile(null);
        setFooterPreview("");
        setSaving(false);
        setShowPreview(false);
    }, [open]);

    // Revoke object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (footerPreview) URL.revokeObjectURL(footerPreview);
        };
    }, [footerPreview]);

    const isEmail = channelType === "email";
    const canUploadFooter = channelType === "email" || channelType === "livechat";

    // Validation (matches your backend requirements)
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

        // If channel isn't email/livechat, ignore (optional guard)
        if (!canUploadFooter) {
            toast.error("Footer image is only supported for Email / Livechat.");
            return;
        }

        // Clean up previous preview URL
        if (footerPreview) URL.revokeObjectURL(footerPreview);

        setFooterFile(file);
        setFooterPreview(URL.createObjectURL(file));
    };

    const buildFormData = () => {
        const fd = new FormData();

        // These keys match your Postman form-data keys exactly
        fd.append("name", name.trim());
        fd.append("action_type", actionType);
        fd.append("channel_type", channelType);

        // Email-only field
        if (isEmail) {
            fd.append("email_subject", emailSubject.trim());
        }

        fd.append("body", body);
        fd.append("is_active", isActive ? "true" : "false");

        // Optional file field
        if (footerFile && canUploadFooter) {
            fd.append("footer_image", footerFile);
        }

        return fd;
    };

    const onSave = async () => {
        const err = validate();
        if (err) {
            toast.error(err);
            return;
        }

        setSaving(true);
        try {
            const fd = buildFormData();

            const res = await axiosInstance.post("/communication/templates/", fd);
            if (res.data?.success) {
                toast.success("Template created successfully.");
                onCreated?.(channelType);
                onClose?.();
            } else {
                toast.error(res.data?.message || "Failed to create template.");
            }
        } catch (e) {
            toast.error("Failed to create template. Please try again.");
            // If you want, you can also forward to your global error handler here
            // handleApiError(e);
        } finally {
            setSaving(false);
        }
    };

    const onSaveAndPreview = () => {
        const err = validate();
        if (err) {
            toast.error(err);
            return;
        }
        setShowPreview(true);
    };

    const footer = (
        <div className="flex items-center justify-between gap-3">
            <button
                type="button"
                onClick={onSaveAndPreview}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                disabled={saving}
            >
                Save and Preview
            </button>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-[#3EBF0F] text-white text-sm hover:bg-[#34ab0d] disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Template"}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                    disabled={saving}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    return (
        <Drawer
            show={open}
            onClose={onClose}
            title="Create Template"
            subtitle="Design a new auto-response template"
            width="40%"
            footer={footer}
        >
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

                {/* Service Type (maps to action_type) */}
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
                    <p className="text-xs text-gray-500 mt-2">
                        This maps to <span className="font-mono">action_type</span> (welcome / auto_reply).
                    </p>
                </div>

                {/* Email Subject (Email only) */}
                {isEmail ? (
                    <div>
                        <label className="text-sm font-medium">
                            Email Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="Email Subject"
                            className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#3EBF0F]/20"
                        />
                    </div>
                ) : null}

                {/* Message Body */}
                <div>
                    <label className="text-sm font-medium">Message Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={5}
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Use <span className="font-mono">{'{{customer_name}}'}</span> to personalize with the customer’s name.
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

                {/* Footer Image */}
                {canUploadFooter ? (
                    <div>
                        <label className="text-sm font-medium">Footer Image (Optional)</label>

                        <div className="mt-2 border border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50">
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(e) => onPickFooter(e.target.files?.[0])}
                                disabled={!canUploadFooter}
                                className="block w-full text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {canUploadFooter
                                    ? "PNG, JPG up to 5MB"
                                    : "Footer image only applies to Email / Livechat"}
                            </p>

                            {footerPreview ? (
                                <div className="mt-4">
                                    <img
                                        src={footerPreview}
                                        alt="Footer preview"
                                        className="max-h-40 mx-auto rounded-lg border"
                                    />
                                </div>
                            ) : null}
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Add optional image to appear at the bottom of your message.
                        </p>
                    </div>
                ) : null}

                {/* Local Preview */}
                {showPreview ? (
                    <div className="border border-gray-200 rounded-xl p-4 bg-white">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Preview</p>
                            <button
                                type="button"
                                onClick={() => setShowPreview(false)}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Close
                            </button>
                        </div>

                        {isEmail ? (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500">Subject</p>
                                <p className="text-sm font-medium">{emailSubject}</p>
                            </div>
                        ) : null}

                        <div className="mt-3">
                            <p className="text-xs text-gray-500">Body</p>
                            <div className="text-sm whitespace-pre-wrap mt-1">{body}</div>
                        </div>

                        {footerPreview ? (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500">Footer image</p>
                                <img
                                    src={footerPreview}
                                    alt="Footer"
                                    className="max-h-32 mt-2 rounded-lg border"
                                />
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </Drawer>
    );
}
