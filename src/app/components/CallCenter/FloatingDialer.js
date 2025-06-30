'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useCall } from '@/context/CallContext';
import { useApi } from '@/services/axiosConfig';

const FloatingDialer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState('');
  const { makeCall } = useCall();
  const { axiosInstance } = useApi();

  const handleOpenButtonClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleCall = async() => {
    if (number) {
    const phoneToSearch = number;
    
    try {
      const { data } = await axiosInstance.get('/customers/', {
      params: { search: phoneToSearch }
      });

   if (data.count > 0) {
      const cust = data.results[0];
       const name = `${cust.first_name} ${cust.last_name}`.trim();
      makeCall({ phone: number, name, id: cust.id });
    } else {
      makeCall({ phone: number });
   }
    } catch (err) {
      console.error('Customer lookup failed', err);
      makeCall({ phone: number });
    }

      setIsOpen(false);
    }
  };

  const handleDigitClick = (digit) => setNumber(prev => prev + digit);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpenButtonClick}
          className="fixed bottom-12 right-6 z-50 rounded-full "
        >
          <Image
            src="/assets/dialer.png"
            alt="Dialer"
            width={80}
            height={80}
          />
        </button>
      )}
      {isOpen && (
        <button
          onClick={handleClose}
          className="fixed bottom-12 right-6 z-50 rounded-full "
        >
          <Image
            src="/assets/close.png"
            alt="Close"
            width={80}
            height={80}
          />
        </button>
      )}

      {/* Dialer Popup */}
      {isOpen && (
        <div className="fixed bottom-[103px] right-[95px] bg-white rounded-xl shadow-lg  z-50 w-[350px]">
          <div className="flex justify-between items-center mb-4  bg-[#3EBF0F] rounded-t-lg p-4">
            <Image
              src="/assets/nt.svg"
              alt="Dialer"
              width={80}
              height={80}
            />
          </div>
          
          <div className="relative px-7">
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter number"
              className="w-full p-2 pr-10 border border-gray-300 rounded-md mb-9 mt-2 text-center font-mono text-lg"
            />

            <button
              onClick={() => {
                console.log('Image icon clicked');
                setNumber(prev => prev.slice(0, -1));
              }}
              className="absolute right-9 top-4 transform "
            >
              <Image
                src="/assets/backspace.svg" 
                alt="View"
                width={35}
                height={35}
                className="cursor-pointer"
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-5 pl-7 mb-5">
            {'123456789*0#'.split('').map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigitClick(digit)}
                className="bg-gray-100 hover:bg-gray-200 w-16 h-16 rounded-full text-xl font-semibold"
              >
                {digit}
              </button>
            ))}
          </div>

          <div className='w-full flex items-center justify-center p-5 cursor-pointer'>
            <Image
              onClick={handleCall}
              src="/assets/dial.svg"
              alt="Dialer"
              width={58}
              height={58}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingDialer;