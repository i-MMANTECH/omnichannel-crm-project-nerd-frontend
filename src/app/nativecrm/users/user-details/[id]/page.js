'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserDetails from "@/app/components/Users/UserDetails";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

export default function Page() {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const { id } = useParams();

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axiosInstance.get(`/users/${id}`);
                setUser(response.data.user); 
            } catch (error) {
                handleApiError(error);
            }
        }

        if (id) fetchUser();
    }, []);

    return (
        <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
            <div className='relative body-theme flex-1 flex flex-col '>
                {user && <UserDetails user={user} />}
            </div>
        </div>
    );
}
