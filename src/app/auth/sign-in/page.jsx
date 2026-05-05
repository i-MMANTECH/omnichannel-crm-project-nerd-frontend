"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { getUserDomain } from '@/utils/getUserDomain';
import Link from 'next/link';

const SignIn = () => {
    const router = useRouter();
    const { axiosInstance, loading } = useApi();
    const { handleApiError } = useError();
    const { user, login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const subdomain = getUserDomain();
        if (!subdomain) {
            router.push('/auth/sign-up');
        }

        if (user) {
            router.push('/');
        }
    }, [user]);


    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === 'email') setEmail(value);
        if (id === 'password') setPassword(value);
    };

    const handleTogglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const handleSignIn = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/auth/signin/', {
                email,
                password,
            });

            if (response.status === 200) {
                login(response.data);
                setTimeout(() => {
                    router.push('/');
                }, 200);
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                '';

            if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('disabled')) {
                toast.error('Your Account is Disabled. Contact Admin');
                return;
            }

            handleApiError(error)
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const handleCreateAccountRedirect = () => {
        const currentUrl = window.location.href;
        const isLocalhost = currentUrl.includes("localhost");
        const hostname = window.location.hostname;

        if (isLocalhost) {
            router.push('/auth/sign-up');
        } else if (hostname.includes("staging.nativetalkcrm.com")) {
            window.location.href = "https://staging.nativetalkcrm.com/auth/sign-up";
        } else if (hostname.includes("nativetalkcrm.com")) {
            window.location.href = "https://nativetalkcrm.com/auth/sign-up";
        }
    };

    const isFormValid = email && password;

    return (
        <div className="flex min-h-screen flex-col overflow-y-auto lg:flex-row">
            <div className="hidden flex-col md:flex md:min-h-[360px] md:w-full lg:min-h-screen lg:w-1/2">
                <div className="min-h-[220px] flex-grow lg:min-h-0">
                    <img
                        src="/assets/sign-in-image.png"
                        alt="Create Password"
                        className="h-full min-h-[220px] w-full object-cover lg:min-h-0"
                    />
                </div>

                <div style={{ height: '4px', backgroundColor: '#3EBF0F' }}></div>

                <div className="flex flex-col items-start bg-black p-5 text-white sm:p-6 lg:p-8">
                    <Image src="/assets/nativetalk-logo2.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                    <h2 className="mt-4 text-2xl font-bold leading-tight text-white lg:text-3xl">
                        Let's empower your <br /> employees today.
                    </h2>
                    <p className="text-white mt-2">Transform every conversation into opportunity.</p>
                </div>
            </div>

            <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 sm:px-6 md:min-h-0 lg:min-h-screen lg:w-1/2 lg:p-8">
                <div className="w-full max-w-md lg:mt-[100px]">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-left mb-2">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-left mb-6">Enter your details to login</p>
                    <form onSubmit={handleSignIn}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-[#3EBF0F] focus:outline-none focus:ring-[#3EBF0F] dark:border-gray-600 dark:text-gray-300 sm:py-2 sm:text-sm"
                                id="email"
                                placeholder="address@email.com"
                                value={email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 pr-10 text-gray-900 shadow-sm focus:border-[#3EBF0F] focus:outline-none focus:ring-[#3EBF0F] dark:border-gray-600 dark:text-gray-300 sm:p-2 sm:pr-10 sm:text-sm"
                                id="password"
                                placeholder="*********"
                                value={password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 text-gray-600"
                                onClick={handleTogglePasswordVisibility}
                                aria-label={showPassword ? "hide password" : "show password"}
                            >
                                <Image
                                    src={showPassword ? "/assets/show-password.svg" : "/assets/hide-password.svg"}
                                    alt="Show Password"
                                    width={24}
                                    height={24}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between mb-4 mt-3">
                            <label className="flex items-center hidden">
                                <input type="checkbox" className="form-checkbox text-[#3EBF0F]" />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember Me</span>
                            </label>
                            <Link href="/auth/password-reset" className="text-sm text-[#3EBF0F] hover:underline">Forgot Password?</Link>
                        </div>
                        <button
                            type="submit"
                            className={`w-full rounded-md py-2.5 text-white focus:outline-none sm:py-2
                                ${isFormValid ? 'bg-[#3EBF0F] hover:bg-[#34a60e]' : 'bg-[#EEEFF2] cursor-not-allowed text-gray-500 disabled:text-gray-400'}`}
                            disabled={!isFormValid || loading}
                        >
                            Login
                        </button>
                        <div className="hidden flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-gray-400">OR</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <button
                            type="button"
                            className="hidden w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 focus:outline-none flex items-center justify-center"
                            onClick={handleCreateAccountRedirect}
                        >
                            <Image src="/assets/google.svg"
                                alt="Google"
                                className='mr-2'
                                width={25}
                                height={25}
                            />
                            Sign in with Google
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            You're new here? <a href="#" onClick={handleCreateAccountRedirect} className="text-[#3EBF0F] hover:underline">Create Account</a>
                        </p>
                    </div>

                </div>
                <div className="mt-auto w-full max-w-[500px] pt-6 text-xs">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
