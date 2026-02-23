import React, { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Modal from "../../Modal";

export const ConnectInstagramModal = ({ onCancel }) => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const [step, setStep] = useState('loading'); // loading, login, success, disconnect
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [connectedAccount, setConnectedAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const { data } = await axiosInstance.get('/communication/instagram/status/');
            if (data.connected && data.is_active) {
                setConnectedAccount(data.account_id);
                setStep('disconnect');
            } else {
                setStep('login');
            }
        } catch (err) {
            setStep('login');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { data } = await axiosInstance.post('/communication/instagram/connect/', {
                username: username,
                password: password
            });

            if (data.success) {
                setConnectedAccount(data.account_id);
                setStep('success');
            } else {
                setError(data.error || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to connect to Instagram servers. Please try again.");
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm("Are you sure you want to disconnect Instagram?")) return;
        setLoading(true);

        try {
            await axiosInstance.post('/communication/instagram/disconnect/');
            setStep('login');
            setUsername('');
            setPassword('');
            setConnectedAccount('');
        } catch (err) {
            setError("Failed to disconnect");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (step === 'loading') {
            return (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
            );
        }

        if (step === 'disconnect') {
            return (
                <div className="text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Instagram Connected</h3>
                        <p className="text-gray-600 mb-2">Your Instagram DMs are actively syncing.</p>
                        <p className="text-sm text-gray-500">Account ID: <strong className="text-gray-700">{connectedAccount}</strong></p>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                    >
                        {loading ? "Disconnecting..." : "Disconnect Instagram"}
                    </button>
                </div>
            );
        }

        if (step === 'login') {
            return (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 text-sm">
                            Log in to sync your Instagram Direct Messages. Your credentials are used securely to establish a connection.
                        </p>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Phone number, username, or email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                            <p className="text-red-600 text-xs text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !username || !password}
                        className="w-full bg-[#0095f6] text-white py-2.5 rounded-lg hover:bg-[#1877f2] transition-colors disabled:opacity-50 font-semibold text-sm mt-2"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>
            );
        }

        if (step === 'success') {
            return (
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-green-600">Connected!</h3>
                    <p className="text-gray-600 mb-6">Your Instagram account is now successfully linked.</p>
                    <button
                        onClick={() => { onCancel(); window.location.reload(); }}
                        className="w-full bg-[#0095f6] text-white py-3 rounded-md hover:bg-[#1877f2] transition-colors font-medium"
                    >
                        Done
                    </button>
                </div>
            );
        }
    };

    return (
        <Modal isOpen={true} onClose={onCancel} title={step === 'login' ? "Connect Instagram" : "Instagram Channel"}>
            <div className="p-4">
                <div className="flex justify-center mb-6">
                    {/* Instagram gradient logo */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                {renderContent()}
            </div>
        </Modal>
    );
};