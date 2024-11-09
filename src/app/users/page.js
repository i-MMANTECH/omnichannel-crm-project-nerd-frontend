"use client";

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import UserTable from '../components/userTable/UserTable';

const UsersPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const users = [
        { name: 'Ogachi Arina', role: 'Manager', email: 'ogachiarina@gmail.com', phone: '+234 678 876 8767', lastActive: '23m ago', image: 'https://via.placeholder.com/50/FFB6C1/000000?text=OA' },
        { name: 'Johnson Adeyemi', role: 'Agent', email: 'johnsonadeyemi@gmail.com', phone: '+234 789 123 1234', lastActive: '1h ago', image: 'https://via.placeholder.com/50/87CEEB/000000?text=JA' },
        { name: 'Linda Chika', role: 'Team Member', email: 'lindachika@gmail.com', phone: '+234 765 432 1234', lastActive: '5h ago', image: 'https://via.placeholder.com/50/F4F0FF/000000?text=LC' },
        { name: 'Ahmed Bello', role: 'Admin', email: 'ahmedbello@gmail.com', phone: '+234 234 567 8901', lastActive: '1d ago', image: 'https://via.placeholder.com/50/FEF1ED/000000?text=AB' },
        { name: 'Grace Obi', role: 'Manager', email: 'graceobi@gmail.com', phone: '+234 321 456 7890', lastActive: '2d ago', image: 'https://via.placeholder.com/50/FFB6C1/000000?text=GO' },
        { name: 'Samuel Ifeanyi', role: 'Agent', email: 'samuelifeanyi@gmail.com', phone: '+234 456 789 1234', lastActive: '3d ago', image: 'https://via.placeholder.com/50/87CEEB/000000?text=SI' },
        { name: 'Mariam Sule', role: 'Team Member', email: 'mariamsule@gmail.com', phone: '+234 654 321 7890', lastActive: '4d ago', image: 'https://via.placeholder.com/50/F4F0FF/000000?text=MS' },
        { name: 'Emeka Nwosu', role: 'Admin', email: 'emekanwosu@gmail.com', phone: '+234 123 456 7890', lastActive: '1w ago', image: 'https://via.placeholder.com/50/FEF1ED/000000?text=EN' },
      ];

    useEffect(() => {
        if (!user) {
            router.push('/auth/sign-in');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div style={{ marginLeft: '240px', zIndex: 100 }} className="flex-1 flex flex-col">
                <Navbar
                    title="Users"
                    searchPlaceholder="Search"
                    onSearch={setSearchQuery}
                />
                  <UserTable searchQuery={searchQuery} users={users} />
            </div>
        </div>
    );
};

export default UsersPage;
