"use client";

import React, { Component } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import config from "../../config.json";

class SignIn extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
            showConfirmPassword: false,
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleTogglePasswordVisibility = () => {
        this.setState(prevState => ({
            showConfirmPassword: !prevState.showConfirmPassword,
        }));
    };

    handleSignIn = async (event) => {
        event.preventDefault();
        const { login } = this.context;

        this.setState({ loading: true, error: '' });

        try {
            const response = await axios.post(`${config.apiUrl}/login`, {
                email: this.state.email,
                password: this.state.password,
            });
            login(response.data);
        } catch (error) {
            this.setState({ error: "Login failed. Please check your credentials.", loading: false });
            console.error("Login failed:", error);
        }
    };

    render() {
        const { email, password, error, loading, showConfirmPassword } = this.state;
        const isFormValid = email && password;

        return (
            <div className="flex min-h-screen" style={{height: '100vh'}}>
                 <div className="w-1/2 flex flex-col">
                <div className="flex-grow">
                    <img
                        src="/assets/sign-in-home-screen-image.png"
                        alt="Create Password"
                        className="h-full w-full object-cover"
                        style={{ height: 360 }}
                    />
                </div>
                
                {/* Green Separator Line */}
                <div style={{ height: '4px', backgroundColor: '#3EBF0F' }}></div>
                
                <div className="bg-black p-8 text-white flex flex-col items-start">
                    <img src='/assets/logo.png' alt="Logo" />
                    <h2 className="text-3xl font-bold text-white leading-tight mt-4">
                        Let's empower your <br /> employees today.
                    </h2>
                    <p className="text-white mt-2">Transform every conversation into opportunity.</p>
                </div>
            </div>
                
                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 text-left mb-2">Welcome Back</h2>
                        <p className="text-gray-500 text-left mb-6">Enter your details to login</p>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <form onSubmit={this.handleSignIn}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3EBF0F] focus:border-[#3EBF0F] sm:text-sm"
                                    id="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3EBF0F] focus:border-[#3EBF0F] sm:text-sm"
                                    id="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={this.handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3"
                                    onClick={this.handleTogglePasswordVisibility}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <div className="flex items-center justify-between mb-4 mt-3">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-[#3EBF0F]" />
                                    <span className="ml-2 text-sm text-gray-600">Remember Me</span>
                                </label>
                                <a href="#" className="text-sm text-[#3EBF0F] hover:underline">Forgot Password?</a>
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 rounded-md text-white focus:outline-none ${isFormValid ? 'bg-[#3EBF0F] hover:bg-[#34a60e]' : 'bg-[#EEEFF2] cursor-not-allowed'}`}
                                disabled={!isFormValid || loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="mx-4 text-gray-400">OR</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                            <button
                                type="button"
                                className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 focus:outline-none flex items-center justify-center"
                            >
                                <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
                                Sign in with Google
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                You're new here? <a href="sign-up" className="text-[#3EBF0F] hover:underline">Create Account</a>
                            </p>
                        </div>
                        <div style={{width: 500}} className="text- mt-6 pt-6">
                        <p className="text-xs text-gray-400 mt-6 pt-5">
                            © 2024 NativeTalk Technologies. All rights reserved. <a href="#" className="text-[#111827] hover:underline">Terms & Conditions</a> | <a href="#" className="text-[#111827] hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;
