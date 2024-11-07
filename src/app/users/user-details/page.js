'use client';

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import UserDetails from '../../pages/UserDetails/UserDetails';

const Page = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  const userInfo = {
    name: "Ogechi Arinze",
    role: "Manager",
    email: "oge@gmail.com",
    phoneNumber: "(203) 555-0905",
    gender: "Female",
    dob: "February 28, 2003",
    country: "Nigeria",
    state: "Lagos",
    workSchedules: [
      {
        title: "Mon-Fri, Duration 40 hours/week",
        default: true,
        active: true,
        standardHours: "8h 0m",
        totalHours: "40h 0m",
        dailyHours: {
          Monday: "8h 0m",
          Tuesday: "8h 0m",
          Wednesday: "8h 0m",
          Thursday: "8h 0m",
          Friday: "8h 0m",
        },
      },
      {
        title: "Mon-Fri, Duration 35 hours/week",
        default: false,
        active: false,
      },
    ],
  };

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
          title="User Details"
          searchPlaceholder="Search"
          onSearch={setSearchQuery}
        />
        
        <UserDetails searchQuery={searchQuery} userInfo={userInfo} />
      </div>
    </div>
  );
};

export default Page;
