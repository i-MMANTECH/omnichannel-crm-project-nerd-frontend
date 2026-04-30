"use client";

import React, { useMemo } from "react";
import NoDataFound from "@/app/components/NoDataFound";
import empty from "@/public/assets/empty.svg";
import { useCanViewContactInfo } from "@/hooks/useCanViewContactInfo";
import { maskPhoneNumber, maskEmail } from "@/utils/maskContactInfo";
import UserAvatar from "@/app/components/UserAvatar";
import Image from "next/image";
import { getRoleStyle } from "@/utils/getRoleStyle";
import truncateText from "@/utils/truncateText";
import "./style.css";

const LeadsTable = ({
    leads = [],
    loading = false,
    currentPage = 1,
    pageSize = 10,
    serverCount = null
}) => {
    const canViewContactInfo = useCanViewContactInfo();

    const getFullName = (lead) => {
        const quotedMatch = String(lead?.name || "").match(/"([^"]+)"/);
        if (quotedMatch?.[1]) return quotedMatch[1].trim();
        if (lead?.name) return lead.name;
        const first = lead?.first_name || "";
        const last = lead?.last_name || "";
        const full = `${first} ${last}`.trim();
        return full || "--";
    };

    const getContactCandidates = (lead) => {
        return [
            lead?.email,
            lead?.phone_number,
            lead?.unique_identifier,
            lead?.whatsapp,
            lead?.instagram,
            lead?.facebook,
            lead?.tiktok
        ].filter(Boolean);
    };

    const getBracketValue = (value) => {
        const bracketMatch = String(value || "").match(/<([^<>]+)>/);
        return bracketMatch?.[1]?.trim() || null;
    };

    const getEmailValue = (lead) => {
        if (lead?.email && String(lead.email).includes("@")) {
            return String(lead.email);
        }

        const contactCandidates = getContactCandidates(lead);
        for (const value of contactCandidates) {
            const contact = getBracketValue(value) || String(value);
            if (contact.includes("@")) return contact;
        }

        return null;
    };

    const getPhoneValue = (lead) => {
        if (lead?.phone_number) return String(lead.phone_number);

        const contactCandidates = getContactCandidates(lead);
        for (const value of contactCandidates) {
            const contact = getBracketValue(value) || String(value);
            if (/^\+?\d/.test(contact)) return contact;
        }

        return null;
    };

    const getUsername = (lead) => {
        if (lead?.username) return lead.username;
        if (lead?.unique_identifier) {
            return getBracketValue(lead.unique_identifier) || String(lead.unique_identifier);
        }
        return getFullName(lead);
    };

    const getChannels = (lead) => {
        if (Array.isArray(lead?.channels)) return lead.channels;
        if (lead?.channel?.name) return [lead.channel.name];
        if (lead?.channel?.label) return [lead.channel.label];
        if (typeof lead?.channel === "string") return [lead.channel];
        return [];
    };

    const getChannelIcon = (channel) => {
        const normalized = String(channel || "").toLowerCase();
        if (normalized.includes("whatsapp")) {
            return "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
        }
        if (normalized.includes("facebook")) {
            return "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg";
        }
        if (normalized.includes("instagram")) {
            return "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";
        }
        return "https://via.placeholder.com/24/000000/FFFFFF?text=?";
    };

    const mapLeadToCustomerLikeRow = (lead, index) => {
        return {
            id: lead?.id || lead?.unique_identifier || `lead-${index}`,
            image: lead?.image || null,
            username: getUsername(lead) || "--",
            fullName: getFullName(lead),
            email: getEmailValue(lead),
            phoneNumber: getPhoneValue(lead),
            channels: getChannels(lead),
            categories: Array.isArray(lead?.categories) ? lead.categories : [],
            tags: Array.isArray(lead?.tags) ? lead.tags : []
        };
    };

    const rows = useMemo(() => {
        const safeLeads = leads || [];
        if (serverCount === null && safeLeads.length > pageSize) {
            const start = (currentPage - 1) * pageSize;
            return safeLeads.slice(start, start + pageSize).map(mapLeadToCustomerLikeRow);
        }
        return safeLeads.map(mapLeadToCustomerLikeRow);
    }, [leads, serverCount, currentPage, pageSize]);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full body-theme text-left text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-900">
                        <tr>
                            <th className="styled-th whitespace-nowrap">Leads Name</th>
                            <th className="styled-th whitespace-nowrap">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M4 5.3335L6.80743 6.73721C7.55817 7.11258 8.44183 7.11258 9.19257 6.73721L12 5.3335M4 12.6668H12C13.1046 12.6668 14 11.7714 14 10.6668V5.3335C14 4.22893 13.1046 3.3335 12 3.3335H4C2.89543 3.3335 2 4.22893 2 5.3335V10.6668C2 11.7714 2.89543 12.6668 4 12.6668Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="ml-1">Email</span>
                                </div>
                            </th>
                            <th className="styled-th whitespace-nowrap">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M7.86164 9.82798L6.16797 8.13712C5.62282 7.59287 5.62282 6.71048 6.16797 6.16623C6.65516 5.67985 6.71403 4.91134 6.30658 4.35665L4.9159 2.46343C4.50421 1.90296 3.68898 1.84072 3.19671 2.33217C2.44724 3.08039 1.94543 4.07059 2.00475 5.12706C2.29456 10.2884 6.33224 13.7386 10.8984 13.9953C11.9455 14.0542 12.9207 13.5486 13.6623 12.8082C14.1619 12.3094 14.0986 11.4834 13.5289 11.0663L11.6484 9.68959C11.0928 9.28282 10.323 9.34159 9.83581 9.82798C9.29066 10.3722 8.4068 10.3722 7.86164 9.82798Z" stroke="#808897" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="ml-1">Phone</span>
                                </div>
                            </th>
                            <th className="styled-th whitespace-nowrap">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                                        <path d="M6.66675 8.81966C6.76115 8.97426 6.87321 9.12059 7.00288 9.25553C7.80788 10.0933 9.03488 10.2243 9.97181 9.64846C10.1454 9.54173 10.309 9.41079 10.4582 9.25553L12.6178 7.00793C13.5719 6.01489 13.5719 4.40483 12.6178 3.41178C11.6636 2.41873 10.1166 2.41873 9.16241 3.41178L8.68675 3.90685" stroke="#808897" strokeLinecap="round" />
                                        <path d="M7.31362 12.0933L6.83775 12.5885C5.88359 13.5816 4.33656 13.5816 3.38238 12.5885C2.4282 11.5955 2.4282 9.98546 3.38238 8.9924L5.542 6.7448C6.49617 5.75174 8.04322 5.75173 8.99735 6.7448C9.12702 6.87966 9.23902 7.026 9.33342 7.18053" stroke="#808897" strokeLinecap="round" />
                                    </svg>
                                    <span className="ml-1">Channel</span>
                                </div>
                            </th>
                            <th className="styled-th whitespace-nowrap">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-group-icon lucide-group"><path d="M3 7V5c0-1.1.9-2 2-2h2" /><path d="M17 3h2c1.1 0 2 .9 2 2v2" /><path d="M21 17v2c0 1.1-.9 2-2 2h-2" /><path d="M7 21H5c-1.1 0-2-.9-2-2v-2" /><rect width="7" height="5" x="7" y="7" rx="1" /><rect width="7" height="5" x="10" y="12" rx="1" /></svg>
                                    <span className="ml-1">Categories</span>
                                </div>
                            </th>
                            <th className="styled-th whitespace-nowrap">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                                        <path d="M8.66658 2.66699H4.15629C2.52941 2.66699 1.71597 2.66699 1.42951 3.17799C1.42078 3.19355 1.41247 3.20935 1.40459 3.22535C1.14587 3.75094 1.6068 4.42119 2.52865 5.76169C3.264 6.83099 3.63167 7.36566 3.64065 7.97066C3.64095 7.99046 3.64095 8.01019 3.64065 8.02999C3.63167 8.63499 3.264 9.16966 2.52865 10.239C1.6068 11.5795 1.14587 12.2497 1.40459 12.7753C1.41247 12.7913 1.42078 12.8071 1.42951 12.8227C1.71597 13.3337 2.52941 13.3337 4.15629 13.3337H8.66658C9.97512 13.3337 10.6295 13.3337 11.1925 13.0521C11.7555 12.7706 12.1481 12.2472 12.9333 11.2003C14.0888 9.65959 14.6666 8.88919 14.6666 8.00033C14.6666 7.11146 14.0888 6.34107 12.9333 4.80033C12.1481 3.75347 11.7555 3.23005 11.1925 2.94852C10.6295 2.66699 9.97512 2.66699 8.66658 2.66699Z" stroke="#808897" />
                                    </svg>
                                    <span className="ml-1">Tags</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-6 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10">
                                    <div className="flex items-center justify-center">
                                        <NoDataFound message="You do not have any leads" icon={empty} />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((lead) => (
                                <tr
                                    style={{
                                        width: "100px",
                                        flexShrink: 0,
                                        fontFamily: '"Encode Sans"',
                                        fontSize: "14px",
                                        fontStyle: "normal",
                                        fontWeight: 500,
                                        lineHeight: "150%",
                                        letterSpacing: "0.2px"
                                    }}
                                    key={lead.id}
                                    className="hover:dark:bg-neutral-900 hover:bg-gray-100"
                                >
                                    <td className="whitespace-nowrap py-3 px-4 border-b flex items-center">
                                        <div className="pr-2">
                                            {lead?.image ? (
                                                <Image
                                                    alt="profile pic"
                                                    width={10}
                                                    height={10}
                                                    className="mt-2 w-8 h-8 rounded-full"
                                                    src={lead.image}
                                                />
                                            ) : (
                                                <UserAvatar name={lead.fullName} width="w-8" height="h-8" />
                                            )}
                                        </div>
                                        {lead.fullName || "--"}
                                    </td>
                                    <td className="whitespace-nowrap py-3 px-4 border-b">
                                        {lead.email ? maskEmail(truncateText(lead.email), canViewContactInfo) : "--"}
                                    </td>
                                    <td className="whitespace-nowrap py-3 px-4 border-b">
                                        {lead.phoneNumber ? maskPhoneNumber(lead.phoneNumber, canViewContactInfo) : "--"}
                                    </td>
                                    <td className="whitespace-nowrap py-3 px-4 border-b">
                                        {(lead?.channels?.length <= 0 || !lead?.channels) && (
                                            <span className="customer-left-name font-bold mr-1">--</span>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            {lead.channels?.map((channel, idx) => (
                                                <div
                                                    key={`${lead.id}-channel-${idx}`}
                                                    className="channel-icon-container"
                                                    title={channel}
                                                >
                                                    <img
                                                        src={getChannelIcon(channel)}
                                                        alt={channel}
                                                        className="channel-icon"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-3 px-4 border-b">
                                        {(!lead?.categories || lead?.categories.length === 0) ? (
                                            <span className="customer-left-name font-bold mr-1">--</span>
                                        ) : (
                                            <span className="inline-block py-1 rounded-full -ml-1 text-sm font-medium">
                                                {lead.categories.slice(0, 6).map((category, index) => (
                                                    <span
                                                        key={`${lead.id}-category-${index}`}
                                                        className="px-2 py-1 ml-1 rounded"
                                                        style={getRoleStyle(category)}
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                                {lead.categories.length > 6 && (
                                                    <span className="ml-1 font-bold text-base">...</span>
                                                )}
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap py-3 px-4 border-b">
                                        {(!lead?.tags || lead?.tags.length === 0) ? (
                                            <span className="customer-left-name font-bold mr-1">--</span>
                                        ) : (
                                            <span className="inline-block py-1 rounded-full -ml-1 text-sm font-medium">
                                                {lead.tags.slice(0, 6).map((tag, index) => (
                                                    <span
                                                        key={`${lead.id}-tag-${index}`}
                                                        className="px-2 py-1 ml-1 rounded"
                                                        style={getRoleStyle(tag)}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {lead.tags.length > 6 && (
                                                    <span className="ml-1 font-bold text-base">...</span>
                                                )}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default LeadsTable;
