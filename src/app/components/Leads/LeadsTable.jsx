"use client";

import React, { useState, useMemo } from "react";
import NoDataFound from "@/app/components/NoDataFound";
import empty from "@/public/assets/empty.svg";
import { useCanViewContactInfo } from "@/hooks/useCanViewContactInfo";
import { maskPhoneNumber, maskEmail } from "@/utils/maskContactInfo";
import UserAvatar from "@/app/components/UserAvatar";  // ✅ ADD THIS
import Image from "next/image";  // ✅ ADD THIS

const LeadsTable = ({
    leads = [],
    loading = false,
    currentPage = 1,
    pageSize = 10,
    serverCount = null,
    onConvertLead
}) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const canViewContactInfo = useCanViewContactInfo();

    const toggleMenu = (leadId) => {
        setOpenMenuId((prev) => (prev === leadId ? null : leadId));
    };

    const formatName = (lead) => {
        const quotedMatch = String(lead?.name || "").match(/"([^"]+)"/);
        if (quotedMatch?.[1]) return quotedMatch[1].trim();
        if (lead?.name) return lead.name;
        const first = lead?.first_name || "";
        const last = lead?.last_name || "";
        const full = `${first} ${last}`.trim();
        return full || "--";
    };

    const formatContact = (lead) => {
        const contactCandidates = [
            lead?.email,
            lead?.phone_number,
            lead?.unique_identifier,
            lead?.whatsapp,
            lead?.instagram,
            lead?.facebook,
            lead?.tiktok,
        ].filter(Boolean);

        for (const value of contactCandidates) {
            const bracketMatch = String(value).match(/<([^<>]+)>/);
            if (bracketMatch?.[1]) {
                const contact = bracketMatch[1].trim();
                // Apply masking if it's an email or phone
                if (contact.includes('@')) {
                    return maskEmail(contact, canViewContactInfo);
                }
                if (contact.match(/^\+?\d/)) {
                    return maskPhoneNumber(contact, canViewContactInfo);
                }
                return contact;
            }
        }

        const firstContact = contactCandidates[0];
        if (!firstContact) return "--";

        // Apply masking to first contact
        if (firstContact.includes('@')) {
            return maskEmail(firstContact, canViewContactInfo);
        }
        if (String(firstContact).match(/^\+?\d/)) {
            return maskPhoneNumber(firstContact, canViewContactInfo);
        }

        return firstContact;
    };

    const formatChannel = (lead) => {
        return lead?.channel?.name || lead?.channel?.label || lead?.channel || "--";
    };

    const rows = useMemo(() => {
        const safeLeads = leads || [];
        if (serverCount === null && safeLeads.length > pageSize) {
            const start = (currentPage - 1) * pageSize;
            return safeLeads.slice(start, start + pageSize);
        }
        return safeLeads;
    }, [leads, serverCount, currentPage, pageSize]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Channel
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-6 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10">
                                    <div className="flex items-center justify-center">
                                        <NoDataFound message="You do not have any leads" icon={empty} />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((lead) => (
                                <tr key={lead?.id || lead?.unique_identifier} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    {/* ✅ NAME CELL WITH AVATAR */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            {lead?.image ? (
                                                <Image
                                                    alt="profile pic"
                                                    className="w-8 h-8 rounded-full"
                                                    src={lead.image}
                                                    width={32}
                                                    height={32}
                                                />
                                            ) : (
                                                <UserAvatar
                                                    name={formatName(lead)}
                                                    width="w-8"
                                                    height="h-8"
                                                />
                                            )}
                                            <span>{formatName(lead)}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatContact(lead)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatChannel(lead)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                        <div className="relative inline-block text-left">
                                            <button
                                                type="button"
                                                onClick={() => toggleMenu(lead?.id || lead?.unique_identifier)}
                                                className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                aria-label="Row actions"
                                            >
                                                <span className="flex flex-col items-center justify-center gap-0.5">
                                                    <span className="w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-300"></span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-300"></span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-300"></span>
                                                </span>
                                            </button>
                                            <div
                                                className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 ${openMenuId === (lead?.id || lead?.unique_identifier) ? "block" : "hidden"
                                                    }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onConvertLead(lead?.id);
                                                        setOpenMenuId(null);
                                                    }}
                                                    disabled={!lead?.id}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Convert Lead
                                                </button>
                                            </div>
                                        </div>
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