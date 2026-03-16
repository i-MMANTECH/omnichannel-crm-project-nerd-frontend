'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function SuperAdminLogin() {
  const router = useRouter();
  const { login } = useSuperAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = email && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/signin/`,
        { email, password }
      );
      login(response.data);
      router.push('/superadmin/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Invalid credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3EBF0F] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg">NativeTalk CRM</span>
        </div>

        <div>
          <div className="w-16 h-1 bg-[#3EBF0F] mb-6 rounded-full" />
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Super Admin <br /> Control Panel
          </h1>
          <p className="text-gray-400 text-lg">
            Manage organizations, users, plans, and monitor platform analytics from one place.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#3EBF0F]">—</p>
            <p className="text-gray-500 text-xs mt-1">Companies</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#3EBF0F]">—</p>
            <p className="text-gray-500 text-xs mt-1">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#3EBF0F]">—</p>
            <p className="text-gray-500 text-xs mt-1">Uptime</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#3EBF0F] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">NativeTalk CRM</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Sign In</h2>
          <p className="text-gray-500 text-sm mb-8">Enter your super admin credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
                isFormValid && !loading
                  ? 'bg-[#3EBF0F] hover:bg-[#35a50d]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
