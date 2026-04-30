import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useApi } from "@/services/axiosConfig";
import "../Profile/agentProfile.css";
import Image from 'next/image';
import { toast } from 'react-toastify';


export default function DeveloperSettings() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();

  const [selected, setSelected] = useState("ccdetails");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get("/users/call-center-credentials/");
        const username = response.data?.data?.username || "";
        setUsername(username);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchDetails();
  }, []);

  const handleTogglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleSaveDetails = async () => {
    try {
      await axiosInstance.post("/users/call-center-credentials/", { 
        username,
        password,
        is_active: true
      });

      toast.success('Request Successful')
    } catch (error) {
      handleApiError(error);
    }
  };

  const tabs = [
    { key: "ccdetails", label: "Call Center Agent Login Details" },
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

      {selected === "ccdetails" && (
        <div className="mt-6 ms-6 rounded-lg border border-gray-300 p-6">
              <div>
                <label htmlFor="username" className="block mb-2 font-medium">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full max-w-md border border-gray-300 p-2 rounded"
                  placeholder="Enter your webhook URL"
                />
              </div>

              <div className="relative mt-5">
                  <label htmlFor="password" className="block mb-2 font-medium">Password</label>

                  <input
                      type={showPassword ? 'text' : 'password'}
                      className="mt-1 block w-full  max-w-md p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-[#3EBF0F] focus:border-[#3EBF0F]"
                      id="password"
                      placeholder="*********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
              <br />
              <button
                onClick={handleSaveDetails}
                className="mt-5 t-4 px-4 py-2 bg-[#3EBF0F] text-white rounded"
              >
                Save
              </button>
        </div>
      )}
    </div>
  );
}
