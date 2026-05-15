import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../UserAvatar';
import Link from 'next/link';
import Image from 'next/image';
import { getRoleStyle } from '@/utils/getRoleStyle';
import { useCanViewContactInfo } from '@/hooks/useCanViewContactInfo';
import { maskPhoneNumber, maskEmail } from '@/utils/maskContactInfo';
import { usePortalRouter } from '@/context/usePortalRouter';

const CustomerGrid = ({ customers }) => {
  const canViewContactInfo = useCanViewContactInfo();
  const { buildRoute } = usePortalRouter();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          style={{ color: "inherit", textDecoration: "none" }}
          href={buildRoute(`customers/${customer.id}`)}
        >
          <div className="bg-theme border rounded-lg">
            <div className='flex justify-between items-center p-2 border-b'>
              <div className='flex items-center space-x-2'>
                <div className="flex items-center space-x-2">
                  {customer?.image ? (
                    <Image
                      alt="profile pic"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                      src={customer.image}
                    />
                  ) : (
                    <UserAvatar
                      name={`${customer.first_name} ${customer.last_name}`}
                      width="w-10"
                      height="h-10"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{`${customer.first_name} ${customer.last_name}` || "--"}</h3>
                </div>
              </div>
            </div>

            <div className='p-3 text-sm'>
              {customer?.username && (
                <p className="mb-2 flex gap-2 items-center">
                  <span>@{customer.username}</span>
                </p>
              )}

              {/* ✅ APPLY MASKING TO EMAIL */}
              <p className="mb-2 flex gap-2 items-center">
                <Image src="/assets/mail-icon.svg" alt="email" width={20} height={20} />
                {maskEmail(customer.email, canViewContactInfo)}
              </p>

              {/* ✅ APPLY MASKING TO PHONE */}
              <p className="mb-2 flex gap-2 items-center">
                <Image src="/assets/call-icon.svg" alt="call" width={18} height={18} />
                {maskPhoneNumber(customer.phone_number, canViewContactInfo)}
              </p>

              <p className="mb-2 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-group-icon lucide-group"><path d="M3 7V5c0-1.1.9-2 2-2h2" /><path d="M17 3h2c1.1 0 2 .9 2 2v2" /><path d="M21 17v2c0 1.1-.9 2-2 2h-2" /><path d="M7 21H5c-1.1 0-2-.9-2-2v-2" /><rect width="7" height="5" x="7" y="7" rx="1" /><rect width="7" height="5" x="10" y="12" rx="1" /></svg>
                {(!customer?.categories || customer?.categories.length === 0) ? (
                  <span className="customer-left-name font-bold mr-1">--</span>
                ) : (
                  <span className="inline-block py-1 rounded-full -ml-1 text-sm font-medium">
                    {customer?.categories.slice(0, 6).map((cat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 ml-1 rounded"
                        style={getRoleStyle(cat)}
                      >
                        {cat}
                      </span>
                    ))}
                    {customer?.categories.length > 6 && (
                      <span className="ml-1 font-bold text-base">...</span>
                    )}
                  </span>
                )}
              </p>

              {customer?.account_manager && (
                <p className="mb-2 flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808897" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="truncate">
                    {`${customer.account_manager.first_name || ""} ${customer.account_manager.last_name || ""}`.trim() || customer.account_manager.email || "--"}
                  </span>
                </p>
              )}

              {customer?.channels?.length > 0 && (
                <div className="mb-2 flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 21" fill="none">
                    <path d="M8.33325 11.892C8.45125 12.0853..." stroke="#808897" strokeWidth="1.88" strokeLinecap="round" />
                  </svg>
                  <i className="fab fa-whatsapp text-[20px]"></i>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CustomerGrid;