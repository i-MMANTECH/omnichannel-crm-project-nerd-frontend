"use client"
import localFont from "next/font/local";
import "../globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import NotificationModalContainer from "../components/Notification/NotificationModalContainer";
import NetworkStatus from "../components/NetworkStatus";
import CallModalContainer from "../components/CallCenter/CallModalContainer";

export default function RootLayout({ children }) {
  return (
    <div>
      <div className="flex min-h-screen w-full bg-gray-100 body-theme">
        <Sidebar />

        <div className="flex-1 flex relative flex-col ml-0 mt-16 sm:mt-20">
          <Navbar />
          <div className="overflow-x-hidden mt-5 ml-0 sm:ml-20 lg:ml-40 px-4 sm:px-6 lg:px-10 body-theme">
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