"use client"
import localFont from "next/font/local";
import "../globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import NotificationModalContainer from "../components/Notification/NotificationModalContainer";
import NetworkStatus from "../components/NetworkStatus";
import CallModalContainer from "../components/CallCenter/CallModalContainer";
import OnboardingTour from "../components/Onboarding/OnboardingTour";

export default function RootLayout({ children }) {
  return (
    <div>
      <div className="flex min-h-screen w-full bg-gray-100 body-theme">
        <Sidebar />

        <div className="flex-1 flex relative flex-col ml-0 lg:ml-60 pt-16 md:pt-20">
          <Navbar />
          <div className="overflow-x-hidden mt-5 px-4 sm:px-6 lg:px-8 body-theme">
            <NetworkStatus />
            {children}
          </div>
        </div>
        <NotificationModalContainer />
        <CallModalContainer />
        <OnboardingTour />
      </div>
    </div>
  );
}