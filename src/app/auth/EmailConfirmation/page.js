"use client";

import React, { useState } from 'react';

const EmailConfirmation = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [activeInput, setActiveInput] = useState(0);

    const handleChange = (value, index) => {
        if (/^\d$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (index < code.length - 1 && value) {
                setActiveInput(index + 1);
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            setActiveInput(index - 1);
        }
    };

    const handleSubmit = () => {
        console.log("Entered Code: ", code.join(''));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
            <div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Confirm email address
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Please enter the 6 digit code we sent to <br /> denise*****@fueledramenco.com
                </p>
                
                <div className="flex justify-center mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className={`w-10 h-10 border-2 rounded-md text-center text-lg mx-1 ${
                                activeInput === index ? 'border-green-500' : 'border-gray-300'
                            } focus:outline-none`}
                            onFocus={() => setActiveInput(index)}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-[#3EBF0F] text-white py-2 rounded-md hover:bg-[#34a60e] focus:outline-none"
                >
                    Continue
                </button>

                <p className="text-center text-gray-500 mt-4">
                    Resend code in 59:00
                </p>
            </div>
            <div className="text-center mt-8">
                <p className="text-xs text-gray-400">
                    © 2024 NativeTalk Technologies. All rights reserved. 
                    <a href="#" className="text-gray-400 hover:underline ml-2">Terms & Conditions</a> 
                    <a href="#" className="text-gray-400 hover:underline ml-2">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default EmailConfirmation;
