'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useCall } from '@/context/CallContext';

const FloatingDialer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState('');
  const { makeCall } = useCall();

  const handleButtonClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleCall = () => {
    if (number) {
      makeCall({ phone: number });
      setIsOpen(false);
    }
  };

  const handleDigitClick = (digit) => setNumber(prev => prev + digit);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleButtonClick}
          className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
        >
          <Image
            src="/assets/dialer.png"
            alt="Dialer"
            width={60}
            height={60}
          />
        </button>
      )}

      {/* Dialer Popup */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-6 z-50 w-[350px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Dial a number</h2>
            <button onClick={handleClose} className="text-xl font-bold">×</button>
          </div>
          
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter number"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-center font-mono text-lg"
          />

          <div className="grid grid-cols-3 gap-2 mb-4">
            {'123456789*0#'.split('').map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigitClick(digit)}
                className="bg-gray-100 hover:bg-gray-200 py-3 rounded-md text-xl font-semibold"
              >
                {digit}
              </button>
            ))}
          </div>

          <button
            onClick={handleCall}
            className="bg-[#3EBF0F] hover:bg-green-600 text-white w-full py-2 rounded-md"
          >
            Call
          </button>
        </div>
      )}
    </>
  );
};

export default FloatingDialer;