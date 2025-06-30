"use client"

import localFont from "next/font/local";
import "../globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/admin/Sidebar/Sidebar";
import Navbar from "../components/admin/Navbar/Navbar";
import NotificationModalContainer from "../components/Notification/NotificationModalContainer";
import NetworkStatus from "../components/NetworkStatus";
import CallModalContainer from "../components/CallCenter/CallModalContainer";


export default function RootLayout({ children }) {
  return (
    <div>
        <div className="flex min-h-screen w-full bg-gray-100 body-theme">
          <Sidebar />          
          

          <div className="flex-1 flex relative flex-col ml-10 mt-20">
            <Navbar />
            <div className="overflow-x-hidden mt-5 ml-40 pl-10 pr-8 body-theme ">
              <NetworkStatus />

              {children}
            </div>
          </div>
          <NotificationModalContainer />
          <CallModalContainer />
        </div>
    </div>
  );
}