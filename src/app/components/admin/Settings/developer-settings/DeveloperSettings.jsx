import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "../../Profile/agentProfile.css";
import Link from "next/link";

export default function DeveloperSettings() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [selected, setSelected] = useState("webhook");
  const [webhook, setWebhook] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loadingApiKey, setLoadingApiKey] = useState(true);
  const [loadingWebhook, setLoadingWebhook] = useState(true)
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loadingPaymentKeys, setLoadingPaymentKeys] = useState(true);

  // AI Settings State
  const [loadingAiSettings, setLoadingAiSettings] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiOffDuringBusinessHours, setAiOffDuringBusinessHours] = useState(false);
  const [aiDisableStart, setAiDisableStart] = useState("");
  const [aiDisableEnd, setAiDisableEnd] = useState("");

  useEffect(() => {
    const fetchWebhook = async () => {
      try {
        const response = await axiosInstance.get("/companies/webhook-url/");
        const url = response.data?.data?.webhook_url || "";
        setWebhook(url);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingWebhook(false)
      }
    };

    const fetchApiKey = async () => {
      try {
        const response = await axiosInstance.get("/companies/api-key/");
        const key = response.data?.api_key || "";
        setApiKey(key);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingApiKey(false);
      }
    };

    const fetchPaymentKeys = async () => {
      try {
        const { data } = await axiosInstance.get("/companies/payment-config/");
        const paystackConfig = data?.data?.config?.paystack || {};

        setPublicKey(paystackConfig.public_key || "");
        setSecretKey(paystackConfig.secret_key || "");
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingPaymentKeys(false);
      }
    };

    const fetchAiSettings = async () => {
      try {
        const response = await axiosInstance.get("/companies/ai/settings/");
        if (response.data?.success) {
          const aiData = response.data.data;
          setAiEnabled(aiData.ai_enabled || false);
          setAiOffDuringBusinessHours(aiData.ai_off_during_business_hours || false);
          setAiDisableStart(aiData.ai_disable_start || "");
          setAiDisableEnd(aiData.ai_disable_end || "");
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingAiSettings(false);
      }
    };

    fetchWebhook();
    fetchApiKey();
    fetchPaymentKeys();
    fetchAiSettings();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const res = await axiosInstance.get("/documents/");
      const docs = res?.data?.results?.data || [];
      setDocuments(docs);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axiosInstance.post("/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchDocuments();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await axiosInstance.delete(`/documents/${docId}/`);
      await fetchDocuments();
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSaveWebhook = async () => {
    try {
      await axiosInstance.patch("/companies/webhook-url/", { webhook_url: webhook });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSavePaymentKeys = async () => {
    try {
      await axiosInstance.patch("/companies/payment-config/", {
        gateway: "paystack",
        is_active: true,
        config: {
          public_key: publicKey,
          secret_key: secretKey,
        },
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSaveAiEnabled = async (newValue) => {
    setAiEnabled(newValue);
    try {
      await axiosInstance.patch("/companies/ai/settings/", {
        ai_enabled: newValue,
      });
      toast.success("AI Responses setting updated successfully.");
    } catch (error) {
      setAiEnabled(!newValue); // Revert on failure
      handleApiError(error);
    }
  };

  const handleSaveBusinessHoursToggle = async (newValue) => {
    setAiOffDuringBusinessHours(newValue);
    try {
      await axiosInstance.patch("/companies/ai/business-hours/toggle/");
      toast.success("Business hours AI setting updated successfully.");
    } catch (error) {
      setAiOffDuringBusinessHours(!newValue); // Revert on failure
      handleApiError(error);
    }
  };

  const handleSaveBusinessHoursWindow = async (start, end) => {
    try {
      await axiosInstance.patch("/companies/ai/business-hours/window/", {
        ai_disable_start: start,
        ai_disable_end: end,
        ai_off_during_business_hours: aiOffDuringBusinessHours
      });
      toast.success("Business hours window updated successfully.");
    } catch (error) {
      handleApiError(error);
    }
  };

  const tabs = [
    { key: "webhook", label: "Webhook" },
    { key: "apiKey", label: "API Key" },
    { key: "aiSettings", label: "AI Settings" },
    { key: "aiKnowledge", label: "AI Knowledge Base" },
    { key: "paymentKeys", label: "Payment Keys" },
  ];



  return (
    <div className="ms-10">
      <h2 className="text-lg font-semibold mb-2">Developer Settings</h2>

      <div className="flex flex-col flex-1 gap-4 py-6 pr-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <p
              key={tab.key}
              className={`h-[30px] cursor-pointer ${selected === tab.key ? "selected" : "not-selected"}`}
              onClick={() => setSelected(tab.key)}
              aria-selected={selected === tab.key}
            >
              {tab.label}
            </p>
          ))}
        </div>
      </div>

      {selected === "webhook" && (
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6 max-w-2xl">
          <label htmlFor="webhook" className="block mb-2 font-medium">Webhook URL</label>
          {loadingWebhook ? (
            <p>Loading Webhook URL...</p>
          ) : (
            <>
              <input
                id="webhook"
                type="text"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                className="w-full max-w-md border border-gray-300 p-2 rounded"
                placeholder="Enter your webhook URL"
              />
              <br />
              <button
                onClick={handleSaveWebhook}
                className="mt-5 t-4 px-4 py-2 bg-[#3EBF0F] text-white rounded"
              >
                Save
              </button>
            </>
          )}
        </div>
      )}

      {selected === "apiKey" && (
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6 max-w-2xl">
          <label htmlFor="apiKey" className="block mb-2 font-medium">API Key</label>
          {loadingApiKey ? (
            <p>Loading API Key...</p>
          ) : (
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              readOnly
              className="w-full max-w-md border border-gray-300 p-2 rounded"
              placeholder="Enter your API key"
            />
          )}
        </div>
      )}

      {selected === "aiSettings" && (
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">AI Settings</h2>

          {loadingAiSettings ? (
            <p>Loading AI Settings...</p>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Enable AI Toggle */}
              <div className="flex items-center justify-between max-w-md">
                <span className="font-medium">Enable AI Responses Globally</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiEnabled}
                    onChange={(e) => handleSaveAiEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${aiEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${aiEnabled ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </label>
              </div>

              {/* Turn off during business hours Toggle */}
              <div className="flex items-center justify-between max-w-md">
                <span className="font-medium">Turn off during business hours</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiOffDuringBusinessHours}
                    onChange={(e) => handleSaveBusinessHoursToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${aiOffDuringBusinessHours ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${aiOffDuringBusinessHours ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </label>
              </div>

              {/* Time inputs when business hours is turned off */}
              {aiOffDuringBusinessHours && (
                <div className="flex gap-4 max-w-md">
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">Disable Start</label>
                    <input
                      type="time"
                      value={aiDisableStart}
                      onChange={(e) => setAiDisableStart(e.target.value)}
                      onBlur={() => handleSaveBusinessHoursWindow(aiDisableStart, aiDisableEnd)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">Disable End</label>
                    <input
                      type="time"
                      value={aiDisableEnd}
                      onChange={(e) => setAiDisableEnd(e.target.value)}
                      onBlur={() => handleSaveBusinessHoursWindow(aiDisableStart, aiDisableEnd)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selected === "aiKnowledge" && (
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Your AI Knowledge Base</h2>

          {loadingDocuments ? (
            <p>Loading documents...</p>
          ) : (
            <ul className="mb-4 space-y-2">
              {documents.length === 0 ? (
                <p>No documents found.</p>
              ) : (
                documents.map((doc) => (
                  <li key={doc.id} className="flex justify-between items-center border border-gray-200 rounded p-2">
                    <Link href={doc.file} target="_blank" rel="noopener noreferrer" className="truncate max-w-[75%] text-blue-600 underline">
                      {doc.title || `Document #${doc.id}`}
                    </Link>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}

          <div>
            <label className="block font-medium mb-2">Upload Document</label>
            <input
              type="file"
              onChange={handleUploadDocument}
              className="block w-full text-sm text-gray-500 mb-2"
            />
            {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
          </div>
        </div>
      )}


      {selected === "paymentKeys" && (
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6 max-w-2xl">
          <h2 className="text-small  mb-4">Please enter your Paystack payment keys to enable direct payments from customers to your Paystack Account.</h2>

          {loadingPaymentKeys ? (
            <p>Loading Payment Keys...</p>
          ) : (
            <>
              {/* Public Key */}
              <label htmlFor="publicKey" className="block mb-2 font-medium">Public Key</label>
              <div className="relative mb-4">
                <input
                  id="publicKey"
                  type="text"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded pr-10 font-mono"
                  style={{
                    WebkitTextSecurity: showPublicKey ? "none" : "disc",
                    MozTextSecurity: showPublicKey ? "none" : "disc",
                    textSecurity: showPublicKey ? "none" : "disc",
                  }}
                  placeholder="Enter public key"
                  autoComplete="off"
                />
                <span
                  onClick={() => setShowPublicKey(!showPublicKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPublicKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {/* Secret Key */}
              <label htmlFor="secretKey" className="block mb-2 font-medium">Secret Key</label>
              <div className="relative mb-4">
                <input
                  id="secretKey"
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded pr-10 font-mono"
                  style={{
                    WebkitTextSecurity: showSecretKey ? "none" : "disc",
                    MozTextSecurity: showSecretKey ? "none" : "disc",
                    textSecurity: showSecretKey ? "none" : "disc",
                  }}
                  placeholder="Enter secret key"
                  autoComplete="off"
                />
                <span
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showSecretKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <button
                onClick={handleSavePaymentKeys}
                className="mt-4 px-4 py-2 bg-[#3EBF0F] text-white rounded"
              >
                Save
              </button>
            </>
          )}
        </div>
      )}


    </div>
  );
}
