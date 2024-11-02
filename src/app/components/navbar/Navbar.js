// Navbar.js
import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';

const Navbar = ({ title, searchPlaceholder, onSearch }) => {
    return (
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none w-64"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <FaBell className="text-gray-600" />
            </div>
        </div>
    );
};

export default Navbar;
