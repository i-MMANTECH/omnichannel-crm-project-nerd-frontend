import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { formatDateTime } from "@/utils/timeUtils";
import Select from 'react-select';
import { selectStyles } from "../../selectStyles";
import { toast } from 'react-toastify';


const GeneralProfile = ({ onProfileChanged }) => {
  const { axiosInstance, loading } = useApi();
  const { handleApiError } = useError();

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);

  const inputClasses = "w-full border rounded-md p-2 focus:ring-blue-200";
  const disabledInputClasses = "w-full border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const CountryOption = ({ data, ...props }) => (
    <div {...props}>
      <span>{data.label}</span>
      <span className="text-gray-500 ml-2">({data.phonecode})</span>
    </div>
  );

  const fetchInitialData = async () => {
    try {
      const [userResponse, rolesResponse, countriesResponse] = await Promise.all([
        axiosInstance.get(`/users/me`),
        axiosInstance.get("/users/roles/"),
        axiosInstance.get("/users/countries/")
      ]);

      const userData = userResponse.data.user;
      const roles = rolesResponse.data.results;
      const countriesData = countriesResponse.data.countries;

      const formattedCountries = countriesData.map(country => ({
        value: country.id,
        label: `+${country.phonecode}`,
        name: country.name,
        phonecode: country.phonecode
      }));

      setFormData(userData);
      setOriginalData(userData);
      setAvailableRoles(roles.map(role => ({
        value: role.name,
        label: role.name
      })));
      setCountries(formattedCountries);

      // if (userData.country_id) {
      //   await fetchStates(userData.country_id);
      // }

      if (userData.roles?.[0]) {
        await fetchRolePermissions(userData.roles[0]);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const formatCountryLabel = ({ label, phonecode }) => (
    <div className="flex items-center">
      <span>{label}</span>
      <span className="text-gray-500 ml-2">({phonecode})</span>
    </div>
  );

  const fetchRolePermissions = async (role) => {
    if (role) {
      try {
        const response = await axiosInstance.get(`/users/roles/${role.id}`);
        setRolePermissions(response.data.permissions || []);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const response = await axiosInstance.get(`/users/countries/${countryId}/states`);
      const statesData = response.data.states;
      setStates(statesData.map(state => ({
        value: state.id,
        label: state.name
      })));
    } catch (error) {
      handleApiError(error);
      setStates([]);
    }
  };


  const handleSelectChange = async (selectedOption, { name }) => {
    if (name === 'role' && selectedOption) {
      setFormData(prev => ({
        ...prev,
        roles: [selectedOption.value]
      }));
      await fetchRolePermissions(selectedOption.value);
    } else if (name === 'country' && selectedOption) {
      setFormData(prev => ({
        ...prev,
        country_id: selectedOption.value,
        state_id: null
      }));
      await fetchStates(selectedOption.value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: selectedOption ? selectedOption.value : ''
      }));
    }
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getCurrentSelectValue = (name, options) => {
    let value;
    switch (name) {
      case 'role':
        value = formData.roles?.[0];
        break;
      case 'country':
        value = formData.country_id;
        break;
      case 'state':
        value = formData.state_id;
        break;
      default:
        value = formData[name];
    }
    return options.find(option => option.value === value) || null;
  };

  const getPhoneCodeOption = () => {
    const selectedCountry = countries.find(country => country.value === formData.country_id);
    return selectedCountry ? { value: `+${selectedCountry.phonecode}`, label: `+${selectedCountry.phonecode}` } : null;
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      const resp = await axiosInstance.put("/users/me/update/", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone_number: formData.phone_number,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchInitialData()
      onProfileChanged()
      toast.success(resp?.data?.message)
    } catch (error) {
      console.log('error is ', error)

      handleApiError(error);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  const genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' }
  ];

  return (
    <div className="flex flex-col p-6 gap-6 rounded-lg border body-theme w-full mt-5">
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/3 hidden">
            <label className="block text-sm font-medium mb-1">Country Code</label>
            <Select
              name="country"
              value={countries.find(country => country.value === formData.country_id)}
              onChange={(option) => handleSelectChange(option, { name: 'country' })}
              options={countries}
              components={{ Option: CountryOption }}
              formatOptionLabel={formatCountryLabel}
              classNamePrefix="select"
              styles={selectStyles}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <Select
            name="gender"
            value={getCurrentSelectValue('gender', genderOptions)}
            onChange={(option) => handleSelectChange(option, { name: 'gender' })}
            options={genderOptions}
            classNamePrefix="select"
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Account Creation Date</label>
          <input
            name="created_at"
            value={formData?.created_at ? formatDateTime(formData.created_at) : ''}
            disabled
            className={disabledInputClasses}
          />
        </div>
      </div>

      {rolePermissions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-4">Role Permissions</h3>
          <div className="grid grid-cols-2 gap-4">
            {rolePermissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{permission}</span>
                <div className="w-11 h-6 rounded-full transition-colors bg-gray-300">
                  <div className="w-6 h-6 body-theme rounded-full transition-transform translate-x-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-start gap-4 w-full">
        <button
          className="px-4 py-2 border rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCancel}
          disabled={!hasChanges || isSaving}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 rounded-md ${hasChanges && !isSaving
            ? 'bg-[#3EBF0F] text-white hover:bg-[#35a00d]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GeneralProfile;
