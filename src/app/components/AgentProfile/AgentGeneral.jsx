import React, { useState } from "react";
import axios from "axios";

const AgentGeneral = () => {
  const [formData, setFormData] = useState({
    firstName: "Pristia",
    lastName: "Candra",
    gender: "Female",
    role: "Admin",
    email: "Pristia@gmail.com",
    code: "+234",
    phoneNumber: "8101790957",
    url: "fueledbyramenco.nativetalkcrm.com",
    accountCreationDate: "2022-10-23",
    userManagementAccess: false,
    billingAccess: true,
  });

  const formattedDate = new Date(formData.accountCreationDate).toISOString().split('T')[0];


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/api/agent/update", formData);
      console.log("Data saved successfully:", response.data);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6 rounded-lg border body-theme w-full mt-5">
      <h2 className="text-lg font-semibold">Personal Info</h2>

      <div className="grid grid-cols-2 gap-6 w-full">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Creation Date</label>
          <input
            type="date"
            name="accountCreationDate"
            value={formattedDate}  
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">Code</label>
            <select
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring-blue-200"
            >
              <option value="+234">+234</option>
              <option value="+1">+1</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-blue-200"
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8 mt-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggle("userManagementAccess")}>
          <label className="text-sm font-medium">User Management Access</label>
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              formData.userManagementAccess ? "bg-[#3EBF0F]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 body-theme rounded-full transition-transform ${
                formData.userManagementAccess ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggle("billingAccess")}>
          <label className="text-sm font-medium">Billing & Subscription Access</label>
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              formData.billingAccess ? "bg-[#3EBF0F]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                formData.billingAccess ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-4 w-full">
        <button
          className="px-4 py-2 border rounded-md text-gray-700"
          onClick={() => alert("Edit canceled")}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-md bg-[#3EBF0F] "
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AgentGeneral;
