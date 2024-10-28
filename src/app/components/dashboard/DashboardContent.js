import React from 'react';

const DashboardContent = () => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-md shadow-md">
                    <p className="text-gray-500">Messages</p>
                    <h2 className="text-2xl font-bold">10</h2>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                    <p className="text-gray-500">Customers</p>
                    <h2 className="text-2xl font-bold">400</h2>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                    <p className="text-gray-500">Tasks</p>
                    <h2 className="text-2xl font-bold">18</h2>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                    <p className="text-gray-500">SLAs</p>
                    <h2 className="text-2xl font-bold">2</h2>
                </div>
            </div>

           
        </div>
    );
};

export default DashboardContent;
