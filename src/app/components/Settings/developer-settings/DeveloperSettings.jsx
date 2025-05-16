import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import "../../Profile/agentProfile.css";

export default function DeveloperSettings() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [selected, setSelected] = useState("webhook");
  const [webhook, setWebhook] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loadingApiKey, setLoadingApiKey] = useState(true);
  const [loadingWebhook, setLoadingWebhook] = useState(true)

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

    fetchWebhook();
    fetchApiKey();
  }, []);

  const handleSaveWebhook = async () => {
    try {
      await axiosInstance.patch("/companies/webhook-url/", { webhook_url: webhook });
    } catch (error) {
      handleApiError(error);
    }
  };

  const tabs = [
    { key: "webhook", label: "Webhook" },
    { key: "apiKey", label: "API Key" },
  ];

  return (
    <div className="ms-10">
      <div className="flex flex-col flex-1 gap-4 p-6">
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
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6">
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
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6">
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
    </div>
  );
}
