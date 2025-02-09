'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SettingsSidebar from "@/app/components/Settings/SettingsSidebar";
import IntegrateChannels from "@/app/components/Settings/channels/IntegrateChannels";
import PlansAndBillings from '@/app/components/Settings/plans-and-billings/PlansAndBillings';
import RoleManagement from '@/app/components/Settings/role-management/RoleManagement';
import { useRouter } from 'next/navigation';


export default function Settings() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState('');
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    setCurrentSection(hash);
  }, [pathname]);

  const handleSidebarClick = (section) => {
    setCurrentSection(section);
    window.location.href = `${pathname}#${section}`;
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'role-management':
        return <RoleManagement />;
      case 'channels-integration':
        return <IntegrateChannels />;
      case 'report-settings':
        return <div>Report Settings Component</div>;
      case 'data-backup':
        return <div>Data Backup Component</div>;
      case 'notification-settings':
        return <div>Notification Settings Component</div>;
      case 'task-management':
        return <div>Task Management Component</div>;
      case 'security-settings':
        return <div>Security Settings Component</div>;
      case 'plans-and-billings':
        return <PlansAndBillings/>;
      default:
        return <div>Select a setting from the sidebar</div>;
    }
  };

  return (
    <div> 
    <div className="overflow-x-hidden flex flex-row body-theme px-10 min-h-[83vh]">      
      <div className='relative w-1/5 border-e border-gray-300 dark:border-gray-600'>
        <SettingsSidebar onSidebarClick={handleSidebarClick} />
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
    </div>
  );
}
