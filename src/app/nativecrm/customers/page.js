"use client";

import React, { useState} from 'react';
import CustomerTable from '../../components/CustomerTable/CustomerTable';

const CustomersPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const customers = [
        { name: 'Ogachi Arina', role: 'Manager', email: 'ogachiarina@gmail.com', phone: '+234 678 876 8767', lastActive: '23m ago', image: 'https://via.placeholder.com/50/FFB6C1/000000?text=OA' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Johnson Adeyemi', role: 'Agent', email: 'johnsonadeyemi@gmail.com', phone: '+234 789 123 1234', lastActive: '1h ago', image: 'https://via.placeholder.com/50/87CEEB/000000?text=JA' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Linda Chika', role: 'Team Member', email: 'lindachika@gmail.com', phone: '+234 765 432 1234', lastActive: '5h ago', image: 'https://via.placeholder.com/50/F4F0FF/000000?text=LC' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Ahmed Bello', role: 'Admin', email: 'ahmedbello@gmail.com', phone: '+234 234 567 8901', lastActive: '1d ago', image: 'https://via.placeholder.com/50/FEF1ED/000000?text=AB' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Grace Obi', role: 'Manager', email: 'graceobi@gmail.com', phone: '+234 321 456 7890', lastActive: '2d ago', image: 'https://via.placeholder.com/50/FFB6C1/000000?text=GO' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Samuel Ifeanyi', role: 'Agent', email: 'samuelifeanyi@gmail.com', phone: '+234 456 789 1234', lastActive: '3d ago', image: 'https://via.placeholder.com/50/87CEEB/000000?text=SI' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Mariam Sule', role: 'Team Member', email: 'mariamsule@gmail.com', phone: '+234 654 321 7890', lastActive: '4d ago', image: 'https://via.placeholder.com/50/F4F0FF/000000?text=MS' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
        { name: 'Emeka Nwosu', role: 'Admin', email: 'emekanwosu@gmail.com', phone: '+234 123 456 7890', lastActive: '1w ago', image: 'https://via.placeholder.com/50/FEF1ED/000000?text=EN' , tag:"Task", channels: ["WhatsApp", "Facebook"]},
      ];

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">
            <div className='relative body-theme flex-1 flex flex-col '>  
                <CustomerTable searchQuery={searchQuery} customers={customers} />
            </div>
        </div>
    );
};

export default CustomersPage;
