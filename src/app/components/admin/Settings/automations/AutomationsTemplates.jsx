import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import {
    Bell,
    ChevronDown,
    ChevronUp,
    Eye,
    Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Map your CRM channel names to the backend "channel_type" slug
 * used in: /communication/templates/by-channel/<channel_type>/
 *
 * IMPORTANT:
 * Adjust any value here if your backend expects something different.
 */
const CHANNEL_TYPE_MAP = {
    Facebook: "facebook",
    WhatsApp: "whatsapp",
    Instagram: "instagram",
    SMS: "sms",
    Telegram: "telegram",
    Email: "email",
    "Nativetalk Livechat": "livechat",
    "Call Center": "call_center",
};

function slugFromChannel(channel) {
    // If it exists in the map, use it
    if (CHANNEL_TYPE_MAP[channel?.name]) return CHANNEL_TYPE_MAP[channel.name];

    // Fallback: convert name -> slug (best effort)
    return String(channel?.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function classNames(...xs) {
    return xs.filter(Boolean).join(" ");
}

function truncate(text, max = 64) {
    if (!text) return "";
    const t = String(text);
    return t.length > max ? `${t.slice(0, max)}…` : t;
}

function Toggle({ checked, disabled, onChange }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className={classNames(
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                checked ? "bg-[#3EBF0F]" : "bg-gray-200"
            )}
            aria-pressed={checked}
            aria-label="toggle"
        >
            <span
                className={classNames(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition",
                    checked ? "translate-x-5" : "translate-x-1"
                )}
            />
        </button>
    );
}

export default function AutomationsTemplates() {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const [channels, setChannels] = useState([]);
    const [loadingChannels, setLoadingChannels] = useState(true);

    // templatesByChannelType: { email: [...], whatsapp: [...], ... }
    const [templatesByChannelType, setTemplatesByChannelType] = useState({});
    const [loadingTemplates, setLoadingTemplates] = useState({}); // { email: true/false, ... }

    // Which channel cards are expanded
    const [expanded, setExpanded] = useState({}); // { email: true, whatsapp: false, ... }

    // Master toggle (UI only for now — you didn’t share the endpoint yet)
    const [autoResponderEnabled, setAutoResponderEnabled] = useState(true);
    const router = useRouter();

    const fetchChannels = async () => {
        try {
            setLoadingChannels(true);
            const res = await axiosInstance.get("/channels/all/");
            if (res.data?.success) {
                setChannels(res.data.channels || []);
            } else {
                setChannels([]);
            }
        } catch (err) {
            handleApiError(err);
            setChannels([]);
        } finally {
            setLoadingChannels(false);
        }
    };

    const fetchTemplatesForChannelType = async (channelType) => {
        try {
            setLoadingTemplates((prev) => ({ ...prev, [channelType]: true }));
            const res = await axiosInstance.get(
                `/communication/templates/by-channel/${channelType}/`
            );

            if (res.data?.success) {
                const list = res.data?.data || [];
                setTemplatesByChannelType((prev) => ({ ...prev, [channelType]: list }));
            } else {
                setTemplatesByChannelType((prev) => ({ ...prev, [channelType]: [] }));
            }
        } catch (err) {
            handleApiError(err);
            setTemplatesByChannelType((prev) => ({ ...prev, [channelType]: [] }));
        } finally {
            setLoadingTemplates((prev) => ({ ...prev, [channelType]: false }));
        }
    };

    const toggleTemplateActive = async (channelType, templateId, nextActive) => {
        // optimistic UI update
        setTemplatesByChannelType((prev) => {
            const list = prev[channelType] || [];
            return {
                ...prev,
                [channelType]: list.map((t) =>
                    t.id === templateId ? { ...t, is_active: nextActive } : t
                ),
            };
        });

        try {
            await axiosInstance.post(
                `/communication/templates/${templateId}/toggle/`,
                { is_active: nextActive }
            );
        } catch (err) {
            // rollback if API fails
            setTemplatesByChannelType((prev) => {
                const list = prev[channelType] || [];
                return {
                    ...prev,
                    [channelType]: list.map((t) =>
                        t.id === templateId ? { ...t, is_active: !nextActive } : t
                    ),
                };
            });
            handleApiError(err);
        }
    };

    useEffect(() => {
        fetchChannels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // After channels load, fetch templates for ALL connected channels
    useEffect(() => {
        if (!channels?.length) return;

        const connected = channels.filter((c) => c.connected);
        connected.forEach((c) => {
            const channelType = slugFromChannel(c);
            fetchTemplatesForChannelType(channelType);
        });

        // Expand the first connected channel by default (like your screenshot)
        const firstConnected = connected[0];
        if (firstConnected) {
            const firstType = slugFromChannel(firstConnected);
            setExpanded((prev) => ({ ...prev, [firstType]: true }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels]);

    const channelCards = useMemo(() => {
        return (channels || []).map((channel) => {
            const channelType = slugFromChannel(channel);
            const templates = templatesByChannelType[channelType] || [];
            const activeCount = templates.filter((t) => t.is_active).length;

            return {
                channel,
                channelType,
                templates,
                activeCount,
                templatesCount: templates.length,
                isExpanded: Boolean(expanded[channelType]),
                isLoadingTemplates: Boolean(loadingTemplates[channelType]),
            };
        });
    }, [channels, templatesByChannelType, expanded, loadingTemplates]);

    const onAddTemplate = (channel) => {
        // Hook this into your modal / create-template screen
        console.log("Add template for:", channel.name);
    };

    const onManageTemplate = () => {
        console.log("Manage template clicked");
    };

    const onCreateTemplateTop = () => {
        console.log("Create template clicked");
    };

    const onConnectChannel = (channel) => {
        window.location.hash = "channels-integration";
    };

    return (
        <div className="overflow-x-hidden flex flex-col px-10 h-full pb-20 justify-between">
            {/* Top header row */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold">Automations</h2>
                </div>
            </div>

            {/* Page title */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Auto Responder</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Automatically send instant replies when customers message you
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onManageTemplate}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                    >
                        Manage Template
                    </button>
                    <button
                        onClick={onCreateTemplateTop}
                        className="px-4 py-2 rounded-lg bg-[#3EBF0F] text-white text-sm hover:bg-[#34ab0d]"
                    >
                        Create Template
                    </button>
                </div>
            </div>

            {/* Auto responder status card */}
            <div className="hidden mt-6 border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Auto Responder Status</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            Active
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Master control for all auto-responder functionality
                    </p>
                </div>

                <Toggle
                    checked={autoResponderEnabled}
                    onChange={setAutoResponderEnabled}
                />
            </div>

            {/* Channels */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold">Channels</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Configure auto-responder for each channel independently
                </p>

                <div className="mt-5 space-y-4">
                    {loadingChannels ? (
                        <div className="border border-gray-200 rounded-xl p-6">
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-60 bg-gray-100 rounded mt-3 animate-pulse" />
                        </div>
                    ) : (
                        channelCards.map(
                            ({
                                channel,
                                channelType,
                                templates,
                                activeCount,
                                templatesCount,
                                isExpanded,
                                isLoadingTemplates,
                            }) => {
                                const isConnected = Boolean(channel.connected);

                                return (
                                    <div
                                        key={channel.id}
                                        className="border border-gray-200 rounded-xl overflow-hidden"
                                    >
                                        {/* Channel header */}
                                        <div className="px-5 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                                                    {channel.image ? (
                                                        <Image
                                                            src={channel.image}
                                                            alt={channel.name}
                                                            width={24}
                                                            height={24}
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 bg-gray-200 rounded" />
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{channel.name}</p>

                                                        {isConnected ? (
                                                            <>
                                                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                                    Enabled
                                                                </span>
                                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                                    {activeCount} of {templatesCount} active
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                                                Not connected
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {channel.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right actions */}
                                            <div className="flex items-center gap-3">
                                                {isConnected ? (
                                                    <>
                                                        <button
                                                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                                                            onClick={() =>
                                                                setExpanded((prev) => ({
                                                                    ...prev,
                                                                    [channelType]: !prev[channelType],
                                                                }))
                                                            }
                                                        >
                                                            {isLoadingTemplates
                                                                ? "Loading…"
                                                                : `${templatesCount} Templates`}
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={() => onAddTemplate(channel)}
                                                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                                                        >
                                                            Add Template
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => onConnectChannel(channel)}
                                                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                                                    >
                                                        Connect Channel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded templates */}
                                        {isConnected && isExpanded && (
                                            <div className="px-5 pb-5">
                                                {isLoadingTemplates ? (
                                                    <div className="py-6 text-sm text-gray-500">
                                                        Loading templates…
                                                    </div>
                                                ) : templates.length === 0 ? (
                                                    <div className="py-6 text-sm text-gray-500">
                                                        No templates yet for this channel.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {templates.map((t) => (
                                                            <div
                                                                key={t.id}
                                                                className="bg-gray-50 rounded-xl px-4 py-4 flex items-center justify-between"
                                                            >
                                                                <div className="min-w-0 pr-4">
                                                                    <p className="font-medium text-sm">
                                                                        {t.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {truncate(t.body, 72)}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <button
                                                                        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                                                                        onClick={() =>
                                                                            console.log("Preview template", t.id)
                                                                        }
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                        Preview
                                                                    </button>

                                                                    <button
                                                                        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                                                                        onClick={() =>
                                                                            console.log("Edit template", t.id)
                                                                        }
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                        Edit
                                                                    </button>

                                                                    <Toggle
                                                                        checked={Boolean(t.is_active)}
                                                                        onChange={(next) =>
                                                                            toggleTemplateActive(
                                                                                channelType,
                                                                                t.id,
                                                                                next
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
