'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CustomerDetails from "@/app/components/Customers/CustomerDetails";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

export default function Page() {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        async function fetchCustomer() {
            try {
                const response = await axiosInstance.get(`/customers/${id}/`);
                setCustomer(response.data.customer);
            } catch (error) {
                handleApiError(error);
            }
        }

        if (id) fetchCustomer();
    }, [id]);

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>
                {customer && <CustomerDetails  customer={customer} />}
            </div>
        </div>
    );
}
