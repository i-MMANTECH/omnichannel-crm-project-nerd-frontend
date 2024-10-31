import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';

const Navbar = () => {
    return (
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <FaBell className="text-gray-600" />
            </div>
        </div>
    );
};

export default Navbar;
