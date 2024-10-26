"use client";

import React, { useState } from 'react';

const CustomUrlForm = () => {
    const [url, setUrl] = useState('Fueledbyramenco');
    const [isUrlAvailable, setIsUrlAvailable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setUrl(e.target.value);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        console.log("URL Submitted: ", url);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
           <div className="w-1/2 bg-gray-100 relative overflow-hidden">
                <img 
                    src={'../../assets/sign-up-home-screen-image.png'} 
                    alt="Sign Up" 
                    className="min-h-full w-full object-cover" 
                />
                <div className="absolute bottom-0 left-0 w-full bg-black p-4 text-white z-10">
                    <img src='../../assets/logo.png'/>
                    <h2 className="text-3xl font-bold text-white leading-tight">
                        Let's empower your <br />employees today.
                    </h2>
                    <p className="text-white mt-2">Descriptive text goes here.</p>
                </div>
            </div>

            <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4">You're almost there! Let's create a custom URL for you</h2>
                <p className="text-gray-600 mb-8">This would serve as your unique username</p>

                <div className="flex items-center border rounded-lg mb-4 overflow-hidden">
                    <input
                        type="text"
                        value={url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-none focus:outline-none"
                        placeholder="Your URL"
                    />
                    <span className="px-4 bg-gray-200 text-gray-600">.nativetalkcrm.com</span>
                    <span className="px-2 text-green-500">{isUrlAvailable ? '✔' : '✖'}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">This is just a suggestion, you can change to what you want</p>

                <button
                    onClick={handleSubmit}
                    className={`w-full py-2 text-white rounded-md ${isUrlAvailable ? 'bg-[#3EBF0F] hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    disabled={!isUrlAvailable || isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Create account'}
                </button>

                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400">
                        © 2024 NativeTalk Technologies. All rights reserved. 
                        <a href="#" className="text-gray-400 hover:underline ml-2">Terms & Conditions</a> 
                        <a href="#" className="text-gray-400 hover:underline ml-2">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomUrlForm;
