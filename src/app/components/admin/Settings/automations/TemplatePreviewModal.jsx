import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/app/components/Modal";
import { toast } from "react-toastify";
import { Image as ImageIcon, Loader2 } from "lucide-react";

function initialsFromName(name = "Your Business") {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] || "Y";
    const b = parts[1]?.[0] || "B";
    return (a + b).toUpperCase();
}

function renderForPreview(text = "", companyName = "Your Business") {
    return String(text)
        .replaceAll("{{customer_name}}", "there")
        .replaceAll("{{company_name}}", companyName);
}

export default function TemplatePreviewModal({
    isOpen,
    onClose,
    axiosInstance,
    templateId,
    businessName = "Your Business",
}) {
    const [loading, setLoading] = useState(false);
    const [tpl, setTpl] = useState(null);

    const avatar = useMemo(() => initialsFromName(businessName), [businessName]);

    // Latest-request-wins guard (prevents infinite loading on effect cleanup)
    const reqIdRef = useRef(0);

    useEffect(() => {
        // When closing, reset state
        if (!isOpen) {
            setLoading(false);
            setTpl(null);
            return;
        }

        if (!templateId) return;

        reqIdRef.current += 1;
        const reqId = reqIdRef.current;

        setLoading(true);
        setTpl(null);

        (async () => {
            try {
                const res = await axiosInstance.get(
                    `/communication/templates/${templateId}/`
                );

                // Ignore stale response
                if (reqIdRef.current !== reqId) return;

                if (res.data?.success) {
                    setTpl(res.data.data);
                } else {
                    toast.error(res.data?.message || "Failed to load template preview.");
                }
            } catch (e) {
                if (reqIdRef.current !== reqId) return;
                toast.error("Failed to load template preview.");
            } finally {
                // Only stop loading for the latest request
                if (reqIdRef.current === reqId) setLoading(false);
            }
        })();
    }, [isOpen, templateId]); // 👈 intentionally NOT depending on axiosInstance

    const bodyPreview = tpl ? renderForPreview(tpl.body, businessName) : "";
    const subjectPreview = tpl?.email_subject
        ? renderForPreview(tpl.email_subject, businessName)
        : "";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Preview"
            showFooter={false}
            showBorder={true}
            width="720px"
        >
            {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading preview…</span>
                </div>
            ) : !tpl ? (
                <div className="text-sm text-gray-600">No preview data.</div>
            ) : (
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                        {avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold leading-tight">{businessName}</p>
                        <p className="text-sm text-gray-500 mt-1">Auto-response</p>

                        {tpl.channel_type === "email" && subjectPreview ? (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500">Subject</p>
                                <p className="text-sm font-medium mt-1">{subjectPreview}</p>
                            </div>
                        ) : null}

                        <div className="mt-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {bodyPreview}
                        </div>

                        <div className="mt-6">
                            <div className="h-44 w-full bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                                {tpl.footer_image ? (
                                    <img
                                        src={tpl.footer_image}
                                        alt="Footer"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="w-10 h-10" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
