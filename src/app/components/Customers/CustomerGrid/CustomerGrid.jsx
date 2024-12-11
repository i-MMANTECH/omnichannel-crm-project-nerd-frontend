import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../../UserAvatar';
import Link from 'next/link';
import Image from 'next/image';


const CustomerGrid = ({ searchQuery, customers }) => {
  return (

        <div className="grid gap-6 grid-cols-3">
          {customers.map((customer) => (
          <Link key={customer.id} style={{color:"inherit", textDecoration:"none"}} href={`/nativecrm/customers/${customer.id}`}>
            <div className="bg-theme border rounded-lg">
            <div className='flex justify-between items-center p-2 border-b'>
              <div className='flex items-center space-x-2'>
                <div className="flex items-center space-x-2">
                  <UserAvatar
                      name={`${customer.first_name} ${customer.last_name}` || "--"}
                    />
                  <h3 className="text-lg font-semibold">{`${customer.first_name} ${customer.last_name}` || "--"}</h3>
                </div>             
              </div>

              <FontAwesomeIcon icon={faEllipsis} className="ml-auto cursor-pointer" />
            </div>
            
            <div className='p-3 text-sm'>
              <p className="mb-2 flex gap-2">
                <Image
                    src="/assets/mail-icon.svg"
                    alt="email"
                    width={20}
                    height={20}
                  />
                {customer.email}
              </p>
              
              <p className="mb-2 flex gap-2">
                <Image
                    src="/assets/call-icon.svg"
                    alt="call"
                    width={18}
                    height={18}
                  />
                {customer.phone_number}
              </p>

              <div className="mb-2 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 21" fill="none">
                  <path d="M8.33325 11.892C8.45125 12.0853 8.59134 12.2682 8.75342 12.4368C9.75967 13.4841 11.2934 13.6478 12.4646 12.928C12.6816 12.7946 12.8861 12.6309 13.0726 12.4368L15.7721 9.62734C16.9648 8.38604 16.9648 6.37347 15.7721 5.13216C14.5793 3.89084 12.6456 3.89085 11.4528 5.13216L10.8583 5.75099" stroke="#808897" strokeWidth="1.88" strokeLinecap="round"/>
                  <path d="M9.14184 15.9848L8.547 16.6038C7.3543 17.8452 5.42051 17.8452 4.2278 16.6038C3.03507 15.3625 3.03507 13.35 4.2278 12.1087L6.92731 9.29916C8.12003 8.05784 10.0538 8.05783 11.2465 9.29916C11.4086 9.46774 11.5486 9.65066 11.6666 9.84383" stroke="#808897" strokeWidth="1.88" strokeLinecap="round"/>
                </svg>

                <p className="flex hidden justify-center items-center w-[28px] h-[28px] p-[5.086px] rounded-[11.868px] border-[1.06px] border-[#FFF] bg-[#F7F7F7] flex-shrink-0">
                  <i className="fab fa-whatsapp text-[20px]"></i>
                </p>
              </div>

              <div className="mb-2 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
                  <path
                    d="M10.8334 3.79688H5.19555C3.16195 3.79688 2.14514 3.79688 1.78706 4.43562C1.77616 4.45508 1.76577 4.47482 1.75592 4.49483C1.43252 5.15181 2.00868 5.98962 3.161 7.66524C4.08018 9.00188 4.53977 9.67021 4.551 10.4265C4.55136 10.4512 4.55136 10.4759 4.551 10.5006C4.53977 11.2569 4.08018 11.9252 3.161 13.2619C2.00868 14.9375 1.43252 15.7753 1.75592 16.4323C1.76577 16.4523 1.77616 16.472 1.78706 16.4915C2.14514 17.1302 3.16195 17.1302 5.19555 17.1302H10.8334C12.4691 17.1302 13.287 17.1302 13.9908 16.7783C14.6946 16.4264 15.1853 15.7721 16.1667 14.4635C17.6112 12.5376 18.3334 11.5746 18.3334 10.4635C18.3334 9.35246 17.6112 8.38947 16.1667 6.46354C15.1853 5.15498 14.6946 4.50069 13.9908 4.14878C13.287 3.79687 12.4691 3.79688 10.8334 3.79688Z"
                    stroke="#808897"
                    strokeWidth="1.88"
                  />
                </svg>
                {customer.tags?.length > 0 &&
                  <p className="ms-1 text-right font-encode-sans text-xs font-medium leading-[18px] tracking-[0.4px] flex px-[6.913px] py-[1.728px] justify-center items-center gap-[3.456px] rounded-[3.456px] text-[#936DFF] bg-[#F4F0FF]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3.456" height="3.456" viewBox="0 0 5 5" fill="none">
                      <circle cx="2.64075" cy="2.65589" r="1.72816" fill="var(--Violet-100, #936DFF)" />
                    </svg>
                    {customer.tags?.map((tag) => (
                      tag
                    ))}
                    
                  </p>     
                }             
              </div>

            </div>
          </div>
        </Link>
          ))}
    </div>
  );
};

export default CustomerGrid;
