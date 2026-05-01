import React, { useState } from 'react';
import Drawer from '@/app/components/Drawer';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';

const CreateIVRDrawer = ({ show, onClose, onIVRCreated }) => {
  const [name, setName] = useState("");
  const [welcomePrompt, setWelcomePrompt] = useState("");
  const [invalidRetries, setInvalidRetries] = useState("");
  const [status, setStatus] = useState(false);
  const [timeout, setTimeout] = useState("");
  const [invalidPrompt, setInvalidPrompt] = useState("");
  const [exitPrompt, setExitPrompt] = useState("");
  const [digitRoutes, setDigitRoutes] = useState([{ digit: "", routingType: "", routingOption: "" }]);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/ivrs/', {
        name,
        welcome_prompt: welcomePrompt,
        invalid_retries: invalidRetries,
        status,
        timeout,
        invalid_prompt: invalidPrompt,
        exit_prompt: exitPrompt,
        digit_routes: digitRoutes.filter(route => route.digit && route.routingType)
      });
      
      onIVRCreated();
      onClose();
      resetForm();
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetForm = () => {
    setName("");
    setWelcomePrompt("");
    setInvalidRetries("");
    setStatus(false);
    setTimeout("");
    setInvalidPrompt("");
    setExitPrompt("");
    setDigitRoutes([{ digit: "", routingType: "", routingOption: "" }]);
  };

  const addDigitRoute = () => {
    setDigitRoutes([...digitRoutes, { digit: "", routingType: "", routingOption: "" }]);
  };

  const updateDigitRoute = (index, field, value) => {
    const updatedRoutes = [...digitRoutes];
    updatedRoutes[index][field] = value;
    setDigitRoutes(updatedRoutes);
  };

  const removeDigitRoute = (index) => {
    if (digitRoutes.length > 1) {
      setDigitRoutes(digitRoutes.filter((_, i) => i !== index));
    }
  };

  const footerContent = (
    <div className="flex justify-start gap-3">
      <button
        type="button"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        form="ivrForm"
        className="px-4 py-2 bg-[#3EBF0F] text-white rounded-lg hover:bg-green-600"
      >
        Create
      </button>
    </div>
  );

  return (
    <Drawer
      show={show}
      onClose={onClose}
      title="Create IVR"
      width="50%"
      footer={footerContent}
    >
      <form id="ivrForm" onSubmit={handleSubmit} className="py-2">
        <div className="space-y-4">
          <div>
            <div className='grid grid-cols-2 gap-8'>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="Input name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Timeout</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={timeout}
                        onChange={(e) => setTimeout(e.target.value)}
                    >
                        <option value="">-Select Timeout-</option>
                        {[15, 20, 25, 30, 35, 40, 45, 50].map(sec => (
                        <option key={sec} value={sec}>{sec} sec</option>
                        ))}
                    </select>
                </div>

            </div>

            <div className='grid grid-cols-2 gap-8 mt-3'>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Welcome Prompt</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={welcomePrompt}
                        onChange={(e) => setWelcomePrompt(e.target.value)}
                    >
                        <option value="">-Select Welcome Prompt-</option>
                        <option value="welcome1">Welcome Message 1</option>
                        <option value="welcome2">Welcome Message 2</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Invalid Prompt</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="Input name"
                        value={invalidPrompt}
                        onChange={(e) => setInvalidPrompt(e.target.value)}
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-8 mt-3'>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Invalid Retries</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={invalidRetries}
                        onChange={(e) => setInvalidRetries(e.target.value)}
                    >
                        <option value="">-Select Invalid Retries-</option>
                        {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Exit Prompt</label>
                    <select
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={exitPrompt}
                        onChange={(e) => setExitPrompt(e.target.value)}
                    >
                        <option value="">-Select Exit Prompt-</option>
                        <option value="exit1">Exit Message 1</option>
                        <option value="exit2">Exit Message 2</option>
                    </select>
                </div>
            </div>
            
            <div className='grid grid-cols-2 gap-8 mt-4 '>
                <label className="block text-sm font-medium">Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    checked={status}
                    onChange={() => setStatus(!status)}
                    className="sr-only peer"
                    />
                    <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                        status ? "bg-[#3EBF0F]" : "bg-gray-300"
                    }`}
                    >
                    <div
                        className={`w-6 h-6 body-theme rounded-full transition-transform ${
                        status ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                    </div>
                </label>
            </div>
          </div>

          {/* Advanced Section */}
          <div className="mb-6 pt-5">
            <h3 className="font-semibold text-lg mb-4 ">Advanced</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Digit</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Routing type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Routing options</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {digitRoutes.map((route, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <select
                          className="w-full border border-gray-300 rounded p-1"
                          value={route.digit}
                          onChange={(e) => updateDigitRoute(index, 'digit', e.target.value)}
                        >
                          <option value="">-Select-</option>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="w-full border border-gray-300 rounded p-1"
                          value={route.routingType}
                          onChange={(e) => updateDigitRoute(index, 'routingType', e.target.value)}
                        >
                          <option value="">-Select-</option>
                          <option value="extension">Extension</option>
                          <option value="voicemail">Voicemail</option>
                          <option value="queue">Queue</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="w-full border border-gray-300 rounded p-1"
                          value={route.routingOption}
                          onChange={(e) => updateDigitRoute(index, 'routingOption', e.target.value)}
                        >
                          <option value="">-Select-</option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeDigitRoute(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addDigitRoute}
              className="mt-2 flex items-center text-[#3EBF0F] hover:text-green-600 bg-[#EFFFE6] p-2 rounded-md"
            >
              <span className="mr-1">+</span> Add more
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default CreateIVRDrawer;