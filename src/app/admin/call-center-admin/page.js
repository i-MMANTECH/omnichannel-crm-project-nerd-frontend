'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CallCenterSidebar from '@/app/components/admin/CallCenter/CallCenterSidebar';
import dynamic from 'next/dynamic';
import CallDetailRecords from '@/app/components/CallCenter/CallDetailRecords';
import MissedCallReport from '@/app/components/CallCenter/MissedCallReport';
import LiveCalls from '@/app/components/CallCenter/LiveCalls';
import IVR from '@/app/components/CallCenter/IVR';
import RealTimeReports from '@/app/components/admin/CallCenter/RealTimeReports';
import Setup from '@/app/components/CallCenter/Setup';
import Loader from '@/app/components/Loader';
import { useApi } from '@/services/axiosConfig';
import CallCenterNotActivated from '@/app/components/CallCenter/CallCenterNotActivated';


export default function Settings() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(null);
  const [isConfigured, setIsConfigured] = useState(null)
  const [message, setMessage] = useState('')
  const { axiosInstance, loading: apiLoading } = useApi()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window?.location.hash.substring(1);
      setCurrentSection(hash || 'default');
    }
  }, [pathname]);

    useEffect(() => {
      let mounted = true
      axiosInstance
        .get('/call-center/config-status/')
        .then(({ data }) => {
          if (!mounted) return
          setIsConfigured(Boolean(data.is_configured))
          setMessage(data.message)
        })
        .catch(() => {
          if (!mounted) return
          setIsConfigured(false)
          setMessage('Unable to fetch configuration.')
        })
      return () => {
        mounted = false
      }
    }, [])

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
      case 'setup':
        return <Setup />;
      default:
        return <div>Select a setting from the sidebar</div>;
    }
  };

  
  if (isConfigured === null || apiLoading) {
    return <Loader />
  }

   if (!isConfigured) {
    return <CallCenterNotActivated message={message} />;
  }

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



