'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CallCenterSidebar from '@/app/components/CallCenter/CallCenterSidebar';
import IntegrateChannels from "@/app/components/Settings/channels/IntegrateChannels";
import dynamic from 'next/dynamic';
import SlaPolicies from '@/app/components/Settings/sla-policies/SlaPolicies';
import DeveloperSettings from '@/app/components/Settings/developer-settings/DeveloperSettings';
import CallCenterDashboard from '@/app/components/CallCenter/CallCenterDashboard';
import CallDetailRecords from '@/app/components/CallCenter/CallDetailRecords';
import MissedCallReport from '@/app/components/CallCenter/MissedCallReport';
import LiveCalls from '@/app/components/CallCenter/LiveCalls';
import CallOverview from '@/app/components/CallCenter/RealTimeReports';
import IVR from '@/app/components/CallCenter/IVR';
import RealTimeReport from '@/app/components/CallCenter/RealTimeReports';
import RealTimeReports from '@/app/components/CallCenter/RealTimeReports';


const PlansAndBillings = dynamic(() => import('@/app/components/Settings/plans-and-billings/PlansAndBillings'), { 
  ssr: false 
});

export default function Settings() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window?.location.hash.substring(1);
      setCurrentSection(hash || 'default');
    }
  }, [pathname]);

  const handleSidebarClick = (section) => {
    setCurrentSection(section);
    if (typeof window !== 'undefined') {
      window.location.hash = section;
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'real-time-reports':
        return <RealTimeReports />;
      case 'missed-call-report':
        return <MissedCallReport />;
      case 'live-calls':
        return <LiveCalls />;
      case 'call-detail-records':
        return <CallDetailRecords />;
      case 'ivr':
        return <IVR />;
      default:
        return <div>Select a setting from the sidebar</div>;
    }
  };

  return (
    <div> 
    <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh] gap-5">      
      <div className='relative w-1/5 border-e border-gray-300 dark:border-gray-600'>
        <CallCenterSidebar 
          onSidebarClick={handleSidebarClick}
          currentSection={currentSection}
        />
        
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
    </div>
  );
}
