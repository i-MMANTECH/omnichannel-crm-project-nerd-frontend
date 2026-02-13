import React, { useEffect, useState, useRef } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Modal from "../../Modal";
import './IsLiveChat.css';

export const ConnectWhatsAppModal = ({ onCancel }) => {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  // State
  const [step, setStep] = useState('loading'); // loading, phone, pairing, success, disconnect
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [connectedNumber, setConnectedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollingInterval = useRef(null);

  // Initial Check
  useEffect(() => {
    checkStatus();
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const checkStatus = async () => {
    try {
      const { data } = await axiosInstance.get('/communication/whatsapp/pair/status/');
      if (data.connected && data.paired) {
        setConnectedNumber(data.phone_number);
        setStep('disconnect');
      } else {
        setStep('phone');
      }
    } catch (err) {
      setStep('phone');
    }
  };

  const handleGetCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.post('/communication/whatsapp/pair/', {
        phone_number: phoneNumber
      });

      if (data.success) {
        setPairingCode(data.pairing_code);
        setStep('pairing');
        startPolling();
      } else {
        // Handle unsuccessful response
        setError(data.error || "Failed to get pairing code");
      }
    } catch (err) {
      // Better error handling
      let errorMessage = "Failed to get pairing code";

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseError = err.response.data?.error;
        const errorType = err.response.data?.error_type;

        if (errorType === 'bridge_unavailable') {
          errorMessage = "WhatsApp service is temporarily unavailable. Please contact support.";
        } else if (errorType === 'timeout') {
          errorMessage = "Request timed out. Please try again.";
        } else if (responseError) {
          errorMessage = responseError;
        } else if (err.response.status === 400) {
          errorMessage = "Invalid phone number format. Please check and try again.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again or contact support.";
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || "An error occurred";
      }

      setError(errorMessage);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);

    pollingInterval.current = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get('/communication/whatsapp/pair/status/');

        if (data.paired) {
          clearInterval(pollingInterval.current);
          await completeSetup();
        }
      } catch (err) {
        // Ignore polling errors
      }
    }, 3000);
  };

  const completeSetup = async () => {
    try {
      const { data } = await axiosInstance.post('/communication/whatsapp/complete-setup/');

      if (data.success) {
        setConnectedNumber(data.phone_number);
        setStep('success');
      }
    } catch (err) {
      setError("Setup completed but failed to finalize. Please refresh.");
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect WhatsApp?")) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.post('/communication/whatsapp/unpair/');

      if (data.success) {
        // Reset state
        setStep('phone');
        setPhoneNumber('');
        setPairingCode('');
        setConnectedNumber('');
      } else {
        setError(data.error || "Failed to disconnect");
      }
    } catch (err) {
      let errorMessage = "Failed to disconnect";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.error_type === 'bridge_unavailable') {
        errorMessage = "WhatsApp service is temporarily unavailable. Your account has been disconnected locally.";
        // Still reset the UI since Django side was cleaned up
        setStep('phone');
        setPhoneNumber('');
        setPairingCode('');
        setConnectedNumber('');
      }

      setError(errorMessage);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format code (ABCD-1234)
  const formatCode = (code) => {
    if (!code) return "";
    return code.slice(0, 4) + "-" + code.slice(4);
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (step === 'loading') {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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
            <h3 className="text-xl font-bold mb-2">WhatsApp Connected</h3>
            <p className="text-gray-600 mb-2">
              Your WhatsApp is active and ready to receive messages.
            </p>
            <p className="text-sm text-gray-500">
              Connected: <strong className="text-gray-700">{connectedNumber}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Disconnecting..." : "Disconnect WhatsApp"}
          </button>
        </div>
      );
    }

    if (step === 'phone') {
      return (
        <div>
          <p className="text-center text-gray-600 mb-6">
            Enter your phone number to connect WhatsApp to your account.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-300' : 'border-gray-300'
                }`}
              placeholder="e.g. 2348012345678"
              value={phoneNumber}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '');
                setPhoneNumber(cleaned);
                // Clear error when user starts typing
                if (error) setError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && phoneNumber.length >= 10) {
                  handleGetCode();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter number with country code (e.g., 234 for Nigeria)
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGetCode}
            disabled={loading || !phoneNumber || phoneNumber.length < 10}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Generating Code..." : "Get Pairing Code"}
          </button>
        </div>
      );
    }

    if (step === 'pairing') {
      return (
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Link with WhatsApp</h3>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg mb-6 border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Your Pairing Code:</p>
            <p className="text-4xl font-mono font-bold tracking-wider select-all text-blue-700">
              {formatCode(pairingCode)}
            </p>
          </div>

          <div className="text-left bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-900 border border-blue-200">
            <p className="font-semibold mb-2">📱 Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Open <strong>WhatsApp</strong> on your phone</li>
              <li>Go to <strong>Settings</strong> → <strong>Linked Devices</strong></li>
              <li>Tap <strong>Link a Device</strong></li>
              <li>Select <strong>Link with phone number instead</strong></li>
              <li>Enter the code shown above</li>
            </ol>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-6 p-3 bg-gray-50 rounded-md">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
            <span>Waiting for you to pair...</span>
          </div>

          <button
            onClick={() => {
              clearInterval(pollingInterval.current);
              setStep('phone');
              setPairingCode('');
            }}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium underline"
          >
            Cancel and Go Back
          </button>
        </div>
      );
    }

    if (step === 'success') {
      return (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold mb-2 text-green-600">Successfully Connected!</h3>
          <p className="text-gray-600 mb-6">
            Your WhatsApp account <strong>{connectedNumber}</strong> is now linked and active.
          </p>

          <button
            onClick={() => {
              onCancel();
              window.location.reload();
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      );
    }
  };

  // Only show footer with Close button for disconnect and phone steps
  const showFooter = step === 'disconnect' || step === 'phone';

  const modalFooter = showFooter ? (
    <div className="flex gap-3 w-full justify-end pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium border border-gray-300"
      >
        Close
      </button>
    </div>
  ) : null;

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={
        step === 'pairing' ? "Enter Pairing Code" :
          step === 'success' ? "Connection Successful" :
            "WhatsApp Channel"
      }
      footer={modalFooter}
    >
      <div className="p-2">
        {/* Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 relative">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {renderContent()}
      </div>
    </Modal>
  );
};