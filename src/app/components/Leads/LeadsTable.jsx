"use client";

import React, { useMemo } from "react";
import NoDataFound from "@/app/components/NoDataFound";
import empty from "@/public/assets/empty.svg";
import { useCanViewContactInfo } from "@/hooks/useCanViewContactInfo";
import { maskPhoneNumber, maskEmail } from "@/utils/maskContactInfo";
import { getRoleStyle } from "@/utils/getRoleStyle";
import { getChannelIcon } from "@/utils/getChannelIcon";
import truncateText from "@/utils/truncateText";
import LeadAvatar from "@/app/components/Leads/LeadAvatar";
import "./style.css";

const COLUMN_COUNT = 5;

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

    const mapLeadToRow = (lead, index) => ({
        id: lead?.id || lead?.unique_identifier || `lead-${index}`,
        image: lead?.image || null,
        username: getUsername(lead) || "--",
        fullName: getFullName(lead),
        email: getEmailValue(lead),
        phoneNumber: getPhoneValue(lead),
        channels: getChannels(lead),
        categories: Array.isArray(lead?.categories) ? lead.categories : [],
    });

    const rows = useMemo(() => {
        const safeLeads = leads || [];
        if (serverCount === null && safeLeads.length > pageSize) {
            const start = (currentPage - 1) * pageSize;
            return safeLeads.slice(start, start + pageSize).map(mapLeadToRow);
        }
        return safeLeads.map(mapLeadToRow);
    }, [leads, serverCount, currentPage, pageSize]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Leads Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Channel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Categories
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={COLUMN_COUNT} className="px-6 py-6 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMN_COUNT} className="px-6 py-10">
                                    <div className="flex items-center justify-center">
                                        <NoDataFound message="You do not have any leads" icon={empty} />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <LeadAvatar image={lead.image} name={lead.fullName} />
                                            <span>{lead.fullName || "--"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {lead.email
                                            ? maskEmail(truncateText(lead.email), canViewContactInfo)
                                            : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {lead.phoneNumber
                                            ? maskPhoneNumber(lead.phoneNumber, canViewContactInfo)
                                            : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {(!lead?.channels || lead.channels.length === 0) ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                {lead.channels.map((channel, idx) => (
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
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {(!lead?.categories || lead.categories.length === 0) ? (
                                            <span className="text-gray-400">—</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {lead.categories.slice(0, 6).map((category, idx) => (
                                                    <span
                                                        key={`${lead.id}-category-${idx}`}
                                                        className="px-2 py-0.5 text-xs rounded"
                                                        style={getRoleStyle(category)}
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                                {lead.categories.length > 6 && (
                                                    <span className="text-xs font-bold">+{lead.categories.length - 6}</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadsTable;
