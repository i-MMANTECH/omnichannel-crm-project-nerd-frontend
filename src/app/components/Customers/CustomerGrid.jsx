import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../UserAvatar';
import Link from 'next/link';
import Image from 'next/image';
import { getRoleStyle } from '@/utils/getRoleStyle';
import { useCanViewContactInfo } from '@/hooks/useCanViewContactInfo';
import { maskPhoneNumber, maskEmail } from '@/utils/maskContactInfo';
import { usePortalRouter } from '@/context/usePortalRouter';  // ✅ ADD THIS

const CustomerGrid = ({ customers }) => {
  const canViewContactInfo = useCanViewContactInfo();
  const { buildRoute } = usePortalRouter();  // ✅ ADD THIS

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          style={{ color: "inherit", textDecoration: "none" }}
          href={buildRoute(`customers/${customer.id}`)}  // ✅ USE DYNAMIC ROUTE
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

              <p className="mb-2 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" style={{ flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
                  <path d="M8.66658 2.66699H4.15629C2.52941 2.66699 1.71597 2.66699 1.42951 3.17799C1.42078 3.19355 1.41247 3.20935 1.40459 3.22535C1.14587 3.75094 1.6068 4.42119 2.52865 5.76169C3.264 6.83099 3.63167 7.36566 3.64065 7.97066C3.64095 7.99046 3.64095 8.01019 3.64065 8.02999C3.63167 8.63499 3.264 9.16966 2.52865 10.239C1.6068 11.5795 1.14587 12.2497 1.40459 12.7753C1.41247 12.7913 1.42078 12.8071 1.42951 12.8227C1.71597 13.3337 2.52941 13.3337 4.15629 13.3337H8.66658C9.97512 13.3337 10.6295 13.3337 11.1925 13.0521C11.7555 12.7706 12.1481 12.2472 12.9333 11.2003C14.0888 9.65959 14.6666 8.88919 14.6666 8.00033C14.6666 7.11146 14.0888 6.34107 12.9333 4.80033C12.1481 3.75347 11.7555 3.23005 11.1925 2.94852C10.6295 2.66699 9.97512 2.66699 8.66658 2.66699Z" stroke="#808897" />
                </svg>
                {(!customer?.tags || customer?.tags.length === 0) ? (
                  <span className="customer-left-name font-bold mr-1">--</span>
                ) : (
                  <span className="inline-block py-1 rounded-full -ml-1 text-sm font-medium">
                    {customer?.tags.slice(0, 6).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 ml-1 rounded"
                        style={getRoleStyle(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                    {customer?.tags.length > 6 && (
                      <span className="ml-1 font-bold text-base">...</span>
                    )}
                  </span>
                )}
              </p>

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