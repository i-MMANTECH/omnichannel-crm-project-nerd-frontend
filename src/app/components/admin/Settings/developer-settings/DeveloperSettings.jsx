import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import { Eye, EyeOff, Copy, RefreshCw, Trash2 } from "lucide-react";
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
  const [showApiKey, setShowApiKey] = useState(false);
  const [generatingApiKey, setGeneratingApiKey] = useState(false);
  const [revokingApiKey, setRevokingApiKey] = useState(false);
  const [loadingWebhook, setLoadingWebhook] = useState(true)
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
  const [aiEscalationAssignAgent, setAiEscalationAssignAgent] = useState(true);
  const [aiEscalationCreateTicket, setAiEscalationCreateTicket] = useState(false);

  // Proactive AI Settings State
  const [loadingProactiveSettings, setLoadingProactiveSettings] = useState(true);
  const [proactiveEnabled, setProactiveEnabled] = useState(false);
  const [customerIdleThreshold, setCustomerIdleThreshold] = useState(10);
  const [agentIdleThreshold, setAgentIdleThreshold] = useState(10);
  const [reengagementEnabled, setReengagementEnabled] = useState(false);
  const [reengagementMaxAttempts, setReengagementMaxAttempts] = useState(5);
  const [savingProactive, setSavingProactive] = useState(false);

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
          setAiEscalationAssignAgent(aiData.ai_escalation_assign_agent ?? true);
          setAiEscalationCreateTicket(aiData.ai_escalation_create_ticket ?? false);
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingAiSettings(false);
      }
    };

    const fetchProactiveSettings = async () => {
      try {
        const response = await axiosInstance.get("/companies/ai/proactive-settings/");
        if (response.data?.success) {
          const d = response.data.data;
          setProactiveEnabled(d.proactive_ai_enabled || false);
          setCustomerIdleThreshold(d.customer_idle_threshold_minutes ?? 10);
          setAgentIdleThreshold(d.agent_idle_threshold_minutes ?? 10);
          setReengagementEnabled(d.reengagement_enabled || false);
          setReengagementMaxAttempts(d.reengagement_max_attempts ?? 5);
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingProactiveSettings(false);
      }
    };

    fetchWebhook();
    fetchApiKey();
    fetchPaymentKeys();
    fetchAiSettings();
    fetchProactiveSettings();
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

  const handleUploadDocument = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (documentTitle.trim()) formData.append("title", documentTitle.trim());

    try {
      setUploading(true);
      await axiosInstance.post("/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocumentTitle("");
      setSelectedFile(null);
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

  const handleCopyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard.");
  };

  const handleGenerateApiKey = async () => {
    setGeneratingApiKey(true);
    try {
      const response = await axiosInstance.post("/companies/api-key/");
      setApiKey(response.data?.api_key || "");
      setShowApiKey(true);
      toast.success(response.data?.message || "API key generated.");
    } catch (error) {
      handleApiError(error);
    } finally {
      setGeneratingApiKey(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!confirm("Revoke your API key? Any integrations using it will stop working immediately.")) return;
    setRevokingApiKey(true);
    try {
      await axiosInstance.delete("/companies/api-key/");
      setApiKey("");
      toast.success("API key revoked.");
    } catch (error) {
      handleApiError(error);
    } finally {
      setRevokingApiKey(false);
    }
  };

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

  const handleSaveEscalationSettings = async (field, newValue) => {
    const prev = field === "ai_escalation_assign_agent" ? aiEscalationAssignAgent : aiEscalationCreateTicket;
    if (field === "ai_escalation_assign_agent") setAiEscalationAssignAgent(newValue);
    else setAiEscalationCreateTicket(newValue);
    try {
      await axiosInstance.patch("/companies/ai/escalation-settings/", { [field]: newValue });
      toast.success("Escalation setting updated.");
    } catch (error) {
      if (field === "ai_escalation_assign_agent") setAiEscalationAssignAgent(prev);
      else setAiEscalationCreateTicket(prev);
      handleApiError(error);
    }
  };

  const handleToggleProactiveEnabled = async (newValue) => {
    setProactiveEnabled(newValue);
    try {
      await axiosInstance.patch("/companies/ai/proactive-settings/", { proactive_ai_enabled: newValue });
      toast.success(`Proactive AI follow-ups ${newValue ? "enabled" : "disabled"}.`);
    } catch (error) {
      setProactiveEnabled(!newValue);
      handleApiError(error);
    }
  };

  const handleToggleReengagement = async (newValue) => {
    setReengagementEnabled(newValue);
    try {
      await axiosInstance.patch("/companies/ai/proactive-settings/", { reengagement_enabled: newValue });
      toast.success(`Re-engagement ${newValue ? "enabled" : "disabled"}.`);
    } catch (error) {
      setReengagementEnabled(!newValue);
      handleApiError(error);
    }
  };

  const handleSaveProactiveThresholds = async () => {
    setSavingProactive(true);
    try {
      await axiosInstance.patch("/companies/ai/proactive-settings/", {
        customer_idle_threshold_minutes: Number(customerIdleThreshold),
        agent_idle_threshold_minutes: Number(agentIdleThreshold),
        reengagement_max_attempts: Number(reengagementMaxAttempts),
      });
      toast.success("Proactive AI thresholds saved.");
    } catch (error) {
      handleApiError(error);
    } finally {
      setSavingProactive(false);
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
          <h2 className="text-lg font-semibold mb-1">Your NativeTalk CRM API Key</h2>
          <p className="text-sm text-gray-500 mb-5">
            Use this key to authenticate external services and integrations that need
            programmatic access to your CRM account. Treat it like a password — do not
            share it publicly.
          </p>

          {loadingApiKey ? (
            <p>Loading…</p>
          ) : apiKey ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="flex-1 border border-gray-300 p-2 rounded font-mono text-sm bg-gray-50"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title={showApiKey ? "Hide" : "Reveal"}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={handleCopyApiKey}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGenerateApiKey}
                  disabled={generatingApiKey}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3EBF0F] text-white rounded disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  {generatingApiKey ? "Regenerating…" : "Regenerate"}
                </button>
                <button
                  onClick={handleRevokeApiKey}
                  disabled={revokingApiKey}
                  className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-500 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  {revokingApiKey ? "Revoking…" : "Revoke"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">No API key has been generated yet.</p>
              <button
                onClick={handleGenerateApiKey}
                disabled={generatingApiKey}
                className="flex items-center gap-2 px-4 py-2 bg-[#3EBF0F] text-white rounded disabled:opacity-50"
              >
                <RefreshCw size={15} />
                {generatingApiKey ? "Generating…" : "Generate API Key"}
              </button>
            </>
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
              <div className={`flex items-center justify-between max-w-md ${!aiEnabled ? "opacity-40" : ""}`}>
                <span className="font-medium">Turn off during business hours</span>
                <label className={`relative inline-flex items-center ${!aiEnabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <input
                    type="checkbox"
                    checked={aiOffDuringBusinessHours}
                    onChange={(e) => handleSaveBusinessHoursToggle(e.target.checked)}
                    disabled={!aiEnabled}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${aiOffDuringBusinessHours && aiEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${aiOffDuringBusinessHours && aiEnabled ? "translate-x-5" : "translate-x-0"}`} />
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

              {/* Escalation Settings */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">When AI Escalates a Conversation</h3>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between max-w-md gap-4">
                    <div>
                      <span className="font-medium text-sm">Auto-assign human agent</span>
                      <p className="text-xs text-gray-500 mt-0.5">Find an available agent and send them the handoff message automatically</p>
                    </div>
                    <label className="relative inline-flex items-center shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiEscalationAssignAgent}
                        onChange={(e) => handleSaveEscalationSettings("ai_escalation_assign_agent", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${aiEscalationAssignAgent ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${aiEscalationAssignAgent ? "translate-x-5" : "translate-x-0"}`} />
                      </div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between max-w-md gap-4">
                    <div>
                      <span className="font-medium text-sm">Auto-create support ticket</span>
                      <p className="text-xs text-gray-500 mt-0.5">Automatically log a ticket so the issue is tracked even if no agent is immediately available</p>
                    </div>
                    <label className="relative inline-flex items-center shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiEscalationCreateTicket}
                        onChange={(e) => handleSaveEscalationSettings("ai_escalation_create_ticket", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${aiEscalationCreateTicket ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${aiEscalationCreateTicket ? "translate-x-5" : "translate-x-0"}`} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Proactive AI Settings */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Proactive Follow-ups</h3>
                <p className="text-xs text-gray-500 mb-3">AI-initiated messages when conversations go quiet or leads need re-engaging.</p>

                {loadingProactiveSettings ? (
                  <p className="text-sm text-gray-400">Loading...</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Master toggle */}
                    <div className="flex items-center justify-between max-w-md">
                      <span className="font-medium text-sm">Enable proactive follow-ups</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={proactiveEnabled}
                          onChange={(e) => handleToggleProactiveEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${proactiveEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${proactiveEnabled ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                      </label>
                    </div>

                    {proactiveEnabled && (
                      <>
                        {/* Idle thresholds */}
                        <div className="flex gap-4 max-w-md">
                          <div className="flex-1">
                            <label className="block mb-1 text-xs font-medium text-gray-600">Customer idle (mins)</label>
                            <input
                              type="number"
                              min={1}
                              max={1440}
                              value={customerIdleThreshold}
                              onChange={(e) => setCustomerIdleThreshold(e.target.value)}
                              className="w-full border border-gray-300 p-2 rounded text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-0.5">Follow up when customer goes quiet</p>
                          </div>
                          <div className="flex-1">
                            <label className="block mb-1 text-xs font-medium text-gray-600">Agent idle (mins)</label>
                            <input
                              type="number"
                              min={1}
                              max={1440}
                              value={agentIdleThreshold}
                              onChange={(e) => setAgentIdleThreshold(e.target.value)}
                              className="w-full border border-gray-300 p-2 rounded text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-0.5">Step in when agent hasn't replied</p>
                          </div>
                        </div>

                        {/* Re-engagement toggle */}
                        <div className="flex items-start justify-between max-w-md gap-4">
                          <div>
                            <span className="font-medium text-sm">Re-engage cold leads</span>
                            <p className="text-xs text-gray-500 mt-0.5">Send progressive follow-ups to leads who stopped responding</p>
                          </div>
                          <label className="relative inline-flex items-center shrink-0 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={reengagementEnabled}
                              onChange={(e) => handleToggleReengagement(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className={`w-11 h-6 rounded-full transition-colors ${reengagementEnabled ? "bg-[#3EBF0F]" : "bg-gray-300"}`}>
                              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${reengagementEnabled ? "translate-x-5" : "translate-x-0"}`} />
                            </div>
                          </label>
                        </div>

                        {reengagementEnabled && (
                          <div className="max-w-[160px]">
                            <label className="block mb-1 text-xs font-medium text-gray-600">Max re-engagement attempts</label>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={reengagementMaxAttempts}
                              onChange={(e) => setReengagementMaxAttempts(e.target.value)}
                              className="w-full border border-gray-300 p-2 rounded text-sm"
                            />
                          </div>
                        )}

                        <button
                          onClick={handleSaveProactiveThresholds}
                          disabled={savingProactive}
                          className="mt-1 px-4 py-2 bg-[#3EBF0F] text-white rounded text-sm disabled:opacity-50 w-fit"
                        >
                          {savingProactive ? "Saving..." : "Save thresholds"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {selected === "aiKnowledge" && (
        <div className="mt-6 ms-6 max-w-2xl space-y-6">

          {/* Upload card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Upload Document</h2>
            <p className="text-sm text-gray-500 mb-4">PDF files only. Uploaded documents are indexed and used by the AI agent to answer customer questions.</p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Document title (e.g. Refund Policy, Product Catalogue)"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  {selectedFile ? selectedFile.name : "Choose PDF"}
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                  />
                </label>

                <button
                  onClick={handleUploadDocument}
                  disabled={!selectedFile || uploading}
                  className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>

          {/* Document list card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Uploaded Documents</h2>

            {loadingDocuments ? (
              <p className="text-sm text-gray-400">Loading documents...</p>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-sm">No documents uploaded yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      <Link href={doc.file} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 hover:text-blue-600 truncate">
                        {doc.title || `Document #${doc.id}`}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        title={doc.is_indexed ? "Indexed — AI can search this document" : "Not indexed — AI cannot use this document yet"}
                        className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${doc.is_indexed ? "bg-green-500" : "bg-yellow-400"}`}
                      />
                      <button
                        className="text-xs text-red-500 hover:text-red-700 transition"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
