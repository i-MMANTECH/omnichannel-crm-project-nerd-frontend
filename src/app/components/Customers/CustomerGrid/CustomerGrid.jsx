import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../../UserAvatar';
import Link from 'next/link';
import Image from 'next/image';
import { getRoleStyle } from '@/utils/getRoleStyle';


const CustomerGrid = ({ customers }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {customers.map((customer) => (
      <Link 
        key={customer.id} 
        style={{color:"inherit", textDecoration:"none"}} 
        href={`/admin/customers/${customer.id}`}
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
            <p className="mb-2 flex gap-2 items-center">
              <Image src="/assets/mail-icon.svg" alt="email" width={20} height={20} />
              {customer.email}
            </p>
            <p className="mb-2 flex gap-2 items-center">
              <Image src="/assets/call-icon.svg" alt="call" width={18} height={18} />
              {customer.phone_number}
            </p>
  
            {customer?.channels?.length > 0 && (
              <div className="mb-2 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 21" fill="none">
                  <path d="M8.33325 11.892C8.45125 12.0853..." stroke="#808897" strokeWidth="1.88" strokeLinecap="round"/>
                </svg>
                <i className="fab fa-whatsapp text-[20px]"></i>
              </div>
            )}
  
            {customer?.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {customer.tags.slice(0, 6).map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded" style={getRoleStyle(tag)}>
                    {tag}
                  </span>
                ))}
                {customer.tags.length > 6 && <span className="font-bold text-base">...</span>}
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
