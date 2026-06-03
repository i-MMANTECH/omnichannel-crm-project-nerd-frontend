import React, { useEffect, useState } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Modal from "../../Modal";

export const ConnectFacebookModal = ({ onCancel }) => {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const [step, setStep] = useState('loading'); // loading, login, success, disconnect
    const [connectedAccount, setConnectedAccount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const { data } = await axiosInstance.get('/channels/facebook/status/');
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

    const handleDisconnect = async () => {
        if (!window.confirm("Are you sure you want to disconnect Facebook?")) return;
        setLoading(true);

        try {
            await axiosInstance.post('/channels/facebook/disconnect/');
            setStep('login');
            setConnectedAccount('');
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (step === 'loading') {
            return (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
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
                        <h3 className="text-xl font-bold mb-2">Facebook Connected</h3>
                        <p className="text-gray-600 mb-2">Your Facebook messages are actively syncing.</p>
                        <p className="text-sm text-gray-500">Account ID: <strong className="text-gray-700">{connectedAccount}</strong></p>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                    >
                        {loading ? "Disconnecting..." : "Disconnect Facebook"}
                    </button>
                </div>
            );
        }

        if (step === 'login') {
            return (
                <div className="text-center py-4 space-y-5">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-2">
                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Connect via the Mobile App</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Facebook connection requires a secure in-app login that isn't supported in a browser.
                            Open the <strong>NativeTalk Business App</strong> on your phone to connect your Facebook account.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Steps</p>
                        {[
                            'Open the NativeTalk Business App',
                            'Go to Settings → Channel Integration',
                            'Tap Facebook and log in',
                            'Your messages will sync automatically here too',
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                                <p className="text-sm text-gray-600">{step}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            );
        }
    };

    return (
        <Modal isOpen={true} onClose={onCancel} title={step === 'login' ? "Connect Facebook" : "Facebook Channel"}>
            <div className="p-4">
                <div className="flex justify-center mb-6">
                    {/* Facebook logo */}
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </div>
                </div>
                {renderContent()}
            </div>
        </Modal>
    );
};
