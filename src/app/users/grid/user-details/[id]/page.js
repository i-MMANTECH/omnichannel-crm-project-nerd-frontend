'use client';

import Navbar from "@/app/components/navbar/Navbar";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { useParams } from "next/navigation"
import UserDatils from "../../../../components/UserDatails/page"

export default function Page(){
    const params = useParams()

    const user =  { 
        name: 'Ogachi Arina', 
        role: 'Manager', 
        email: 'ogachiarina@gmail.com', 
        phone: '+234 678 876 8767', 
        lastActive: '23m ago', 
        image: 'https://via.placeholder.com/50/FFB6C1/000000?text=OA'
     }

    return(
        <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div style={{ marginLeft: '240px', zIndex: 100 }} className="flex-1 flex flex-col">
            <Navbar
                title="Customer Details"
                searchPlaceholder="Search"
            />
            
                <UserDatils user={user} />
        </div>
    </div>
    )
}