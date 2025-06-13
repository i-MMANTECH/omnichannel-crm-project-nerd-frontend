'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SettingsSidebar from "@/app/components/Settings/SettingsSidebar";
import IntegrateChannels from "@/app/components/Settings/channels/IntegrateChannels";
import RoleManagement from '@/app/components/Settings/role-management/RoleManagement';
import dynamic from 'next/dynamic';
import SlaPolicies from '@/app/components/Settings/sla-policies/SlaPolicies';
import DeveloperSettings from '@/app/components/Settings/developer-settings/DeveloperSettings';


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
      case 'role-management':
        return <RoleManagement />;
      case 'channels-integration':
        return <IntegrateChannels />;
      // case 'report-settings':
      //   return <div>Report Settings Component</div>;
      // case 'data-backup':
      //   return <div>Data Backup Component</div>;
      // case 'notification-settings':
      //   return <div>Notification Settings Component</div>;
      // case 'task-management':
      //   return <div>Task Management Component</div>;
      // case 'security-settings':
      //   return <div>Security Settings Component</div>;
      case 'plans-and-billings':
        return <PlansAndBillings/>;
      case 'sla-policies':
        return <SlaPolicies/>;
      case 'developer-settings':
        return <DeveloperSettings/>;
      default:
        return <div>Select a setting from the sidebar</div>;
    }
  };

  return (
    <div> 
    <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
      <div className='relative w-1/5 border-e border-gray-300 dark:border-gray-600'>
        <SettingsSidebar 
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
