import React, { useState, useMemo } from 'react';
import { BiSort, BiFilter, BiGridAlt } from 'react-icons/bi';


const UserTable = ({ searchQuery, users = [] }) => {

  return (
    <div className="p-6 min-h-screen bg-white border-l">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                aria-label="Toggle Table View"
                className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                <BiGridAlt size={18} className="text-orange-500" />
                <span className="text-sm font-medium text-gray-600">Table View</span>
                <span className="text-gray-500">&#x25BC;</span>
              </button>
              <span className="h-6 border-l border-gray-300 mx-2"></span>
              <button 
                aria-label="Sort by"
                className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                <BiSort size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Sort by</span>
              </button>
              <button 
                aria-label="Filter"
                className="flex items-center space-x-1 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                <BiFilter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Filter</span>
              </button>
            </div>
          </div>
          <button 
            className="text-white px-4 py-2 rounded-md shadow-sm" 
            style={{ backgroundColor: '#3EBF0F' }}>
            + New User
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default UserTable;
