'use client'

import React, { useEffect, useState, useCallback } from 'react';
import SettingsSidebar from "@/app/components/admin/Settings/SettingsSidebar";
import IntegrateChannels from "@/app/components/admin/Settings/channels/IntegrateChannels";
import RoleManagement from '@/app/components/admin/Settings/role-management/RoleManagement';
import SlaPolicies from '@/app/components/admin/Settings/sla-policies/SlaPolicies';
import DeveloperSettings from '@/app/components/admin/Settings/developer-settings/DeveloperSettings';
import NotificationSettings from '@/app/components/admin/Settings/notification-settings/NotificationSettings';
import AutomationsTemplates from '@/app/components/admin/Settings/automations/AutomationsTemplates';

export default function Settings() {
  const [currentSection, setCurrentSection] = useState('default');

  // 1) Single source of truth: read from window.location.hash
  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace('#', '');
    setCurrentSection(hash || 'default');
  }, []);

  // 2) Run once on mount + whenever hash changes (including browser back/forward)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    syncFromHash(); // initial load

    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);

    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [syncFromHash]);

  // 3) Sidebar click updates the hash (hashchange listener will sync state)
  const handleSidebarClick = (section) => {
    window.location.hash = section;
    // no need to setCurrentSection here; the event listener handles it
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'role-management':
        return <RoleManagement />;
      case 'channels-integration':
        return <IntegrateChannels />;
      case 'notification-settings':
        return <NotificationSettings />;
      case 'sla-policies':
        return <SlaPolicies />;
      case 'developer-settings':
        return <DeveloperSettings />;
      case 'automations':
        return <AutomationsTemplates />;
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
