import React from 'react';

const Navbar = () => {
    return (
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <input 
                type="text" 
                placeholder="Search..." 
                className="border rounded-lg px-4 py-2 focus:outline-none" 
            />
            <div className="flex items-center">
                <button className="ml-4 text-gray-600">Profile</button>
            </div>
        </div>
    );
};

export default Navbar;
