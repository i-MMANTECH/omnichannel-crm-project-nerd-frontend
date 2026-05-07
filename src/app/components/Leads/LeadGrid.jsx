"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import LeadAvatar from './LeadAvatar';
import { useCanViewContactInfo } from '@/hooks/useCanViewContactInfo';
import { maskPhoneNumber, maskEmail } from '@/utils/maskContactInfo';
import { getChannelIcon } from '@/utils/getChannelIcon';

const LeadGrid = ({ leads, onConvertLead }) => {
  const canViewContactInfo = useCanViewContactInfo();
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (e, leadId) => {
    e.preventDefault();
    e.stopPropagation();
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
    ].filter(Boolean);

    for (const value of contactCandidates) {
      const bracketMatch = String(value).match(/<([^<>]+)>/);
      if (bracketMatch?.[1]) {
        const contact = bracketMatch[1].trim();
        if (contact.includes('@')) return maskEmail(contact, canViewContactInfo);
        if (contact.match(/^\+?\d/)) return maskPhoneNumber(contact, canViewContactInfo);
        return contact;
      }
    }

    const firstContact = contactCandidates[0];
    if (!firstContact) return "--";

    if (firstContact.includes('@')) return maskEmail(firstContact, canViewContactInfo);
    if (String(firstContact).match(/^\+?\d/)) return maskPhoneNumber(firstContact, canViewContactInfo);

    return firstContact;
  };

  const formatChannel = (lead) => {
    return lead?.channel?.name || lead?.channel?.label || lead?.channel || "--";
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => {
        const leadId = lead?.id || lead?.unique_identifier;
        return (
          <div key={leadId} className="bg-theme border rounded-lg relative overflow-visible">
            <div className='flex justify-between items-center p-3 border-b'>
              <div className='flex items-center space-x-3'>
                <LeadAvatar
                  image={lead?.image}
                  name={formatName(lead)}
                  widthClass="w-10"
                  heightClass="h-10"
                />
                <h3 className="text-lg font-semibold truncate max-w-[150px]">{formatName(lead)}</h3>
              </div>
              
              <div className="relative">
                <button
                  onClick={(e) => toggleMenu(e, leadId)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500" />
                </button>
                
                {openMenuId === leadId && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 overflow-hidden">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConvertLead(lead?.id);
                        setOpenMenuId(null);
                      }}
                      disabled={!lead?.id}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Convert Lead
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className='p-4 text-sm'>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Image src="/assets/mail-icon.svg" alt="contact" width={18} height={18} />
                  <span className="truncate">{formatContact(lead)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Image
                    src={getChannelIcon(lead?.channel)}
                    alt=""
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                  <span>{formatChannel(lead)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadGrid;
