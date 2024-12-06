'use client';

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar/Navbar";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { useParams } from "next/navigation";
import CustomerDetails from "@/app/components/CustomerDetails/page";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

export default function Page() {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const { id } = useParams();
    const [customer, setCustomer] = useState({ 
        name: 'Ogachi Arina', 
        role: 'Manager', 
        email: 'ogachiarina@gmail.com', 
        phone: '+234 678 876 8767', 
        lastActive: '23m ago', 
        image: 'https://via.placeholder.com/50/FFB6C1/000000?text=OA'
     });

    useEffect(() => {
        async function fetchCustomer() {
            try {
                const response = await axiosInstance.get(`/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                handleApiError(error);
            }
        }

        if (id) fetchCustomer();
    }, [id]);

    if (!customer) {
        return (
            <div className="flex min-h-screen bg-white">
                <Sidebar />
                <div style={{ marginLeft: '50px', zIndex: 100 }} className="flex-1 flex flex-col border-l">
                    <Navbar
                        title="Customer Details"
                        searchPlaceholder="Search"
                    />
                    <div className="flex items-center justify-center h-full">
                        <p>Loading customer details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div style={{ marginLeft: '50px' }} className="flex-1 flex flex-col border-l">
                <Navbar
                    title="Customer Details"
                    searchPlaceholder="Search"
                />
                <CustomerDetails user={customer} />
            </div>
        </div>
    );
}
