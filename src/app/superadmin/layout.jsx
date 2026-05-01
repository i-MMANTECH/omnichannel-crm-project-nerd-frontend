'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SuperAdminAuthProvider, useSuperAdminAuth } from './context/SuperAdminAuthContext';
import Sidebar from './components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SuperAdminLayoutInner({ children }) {
  const { superAdmin, loading } = useSuperAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/superadmin/login';

  useEffect(() => {
    if (!loading && !superAdmin && !isLoginPage) {
      router.push('/superadmin/login');
    }
  }, [superAdmin, loading, isLoginPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-[#3EBF0F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!superAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-56 min-h-screen overflow-x-hidden">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function SuperAdminLayout({ children }) {
  return (
    <SuperAdminAuthProvider>
      <SuperAdminLayoutInner>{children}</SuperAdminLayoutInner>
      <ToastContainer position="bottom-left" autoClose={4000} />
    </SuperAdminAuthProvider>
  );
}
