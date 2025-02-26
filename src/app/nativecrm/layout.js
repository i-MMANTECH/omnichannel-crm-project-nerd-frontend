"use client"

import localFont from "next/font/local";
import "../globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import NotificationModalContainer from "../components/Notification/NotificationModalContainer";


export default function RootLayout({ children }) {
  return (
    <div>
        <div className="flex min-h-screen w-full bg-gray-100 body-theme">
          <Sidebar />
          <div className="flex-1 flex relative flex-col ml-10 mt-20">
            <Navbar />
            <div className="overflow-x-hidden mt-5 ml-40 pl-10 body-theme ">
              {children}
            </div>
          </div>
          <NotificationModalContainer />
        </div>
    </div>
  );
}