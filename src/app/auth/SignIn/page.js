"use client";

import React, { Component } from 'react';
import { AuthContext } from '../../context/AuthContext';

class SignIn extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    };

    handleSignIn = (event) => {
        event.preventDefault();
        const { login } = this.context;
        login();
    };

    render() {
        const { email, password } = this.state;
        const isFormValid = email && password;

        return (
            <div className="flex min-h-screen">
                <div className="w-1/2 bg-gray-100 relative overflow-hidden">
                    <img 
                        src={'../../assets/sign-in-home-screen-image.png'} 
                        alt="Login" 
                        className="min-h-full w-full object-cover" 
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-black p-4 text-white z-10">
                    <img src='../../assets/logo.png'/>
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            Let's empower your <br /> employees today.
                        </h2>
                        <p className="text-white mt-2">Descriptive text goes here.</p>
                    </div>
                </div>
                
                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>
                        <p className="text-gray-500 text-center mb-6">Enter your details to login</p>
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
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3EBF0F] focus:border-[#3EBF0F] sm:text-sm"
                                    id="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center">
                                    <input type="checkbox" className="form-checkbox text-[#3EBF0F]" />
                                    <span className="ml-2 text-sm text-gray-600">Remember Me</span>
                                </label>
                                <a href="#" className="text-sm text-[#3EBF0F] hover:underline">Forgot Password?</a>
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 rounded-md text-white focus:outline-none ${isFormValid ? 'bg-[#3EBF0F] hover:bg-[#34a60e]' : 'bg-[#EEEFF2] cursor-not-allowed'}`}
                                disabled={!isFormValid} 
                            >
                                Login
                            </button>
                            <div className="text-center my-4">
                                <span className="text-gray-400">OR</span>
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
                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-400">
                                © 2024 NativeTalk Technologies. All rights reserved. 
                                <a href="#" className="text-gray-400 hover:underline">Terms & Conditions</a> 
                                <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;
