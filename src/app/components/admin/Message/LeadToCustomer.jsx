import React, { useState, useEffect } from "react";
import Image from "next/image";
import Select from 'react-select';
import { selectStyles } from "../../selectStyles";
import Modal from "../../Modal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";

function LeadToCustomer({ isOpen, onClose, leadId, setIsSuccessModalOpen, setSuccessModalMessage }) {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [tags, setTags] = useState([]);
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        gender: "",
        phone_number: "",
        email: "",
        instagram: "",
        facebook: "",
        whatsapp: "",
        tiktok: "",
        tag: [],
        country: { id: 160, name: "Nigeria" },
        state: {},
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (isOpen && leadId) {
            const fetchLead = async () => {
                try {
                    const response = await axiosInstance.get(`/customers/leads/${leadId}`);
                    if (response?.data) {
                        console.log('lead response ', response?.data)
                        const leadData = response.data.lead;
                        const [firstName, lastName] = leadData.name.split(' ');

                        setFormData((prevData) => ({
                            ...prevData,
                            username: (leadData.name || "").replace(/\s+/g, ""),
                            first_name: firstName || leadData.name || "",
                            last_name: lastName || "",
                            gender: leadData.gender || "",
                            phone_number: leadData?.channel?.id == 2 ? leadData.unique_identifier : "",
                            email: leadData.email || "",
                            instagram: leadData.instagram || "",
                            facebook: leadData.facebook || "",
                            whatsapp: leadData?.channel?.id == 2 ? leadData.unique_identifier : "",
                            tiktok: leadData.tiktok || "",
                            tag: leadData.tag || [],
                            country: { id: 160, name: "Nigeria" },
                            state: {},
                        }));
                    }
                } catch (error) {
                    handleApiError(error);
                }
            };

            fetchLead();
        }
    }, [isOpen, leadId]);

    const handleGenderChange = (selectedOption) => {
        setFormData({ ...formData, gender: selectedOption ? selectedOption.value : '' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTagChange = (selectedTags) => {
        setFormData(prev => ({ ...prev, tags: selectedTags }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submissionData = {
                ...formData,
                tags: formData?.tags?.map(tag => tag.id),
                country: formData.country?.id,
                state: formData.state?.id,
            };

            const formDataToSubmit = new FormData();

            Object.keys(submissionData).forEach(key => {
                const value = submissionData[key];
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            formDataToSubmit.append(key, item);
                        });
                    } else {
                        formDataToSubmit.append(key, value);
                    }
                }
            });

            if (image) {
                formDataToSubmit.append('image', image);
            }

            const response = await axiosInstance.post(
                `/customers/leads/${leadId}/convert/`,
                formDataToSubmit,
            );

            if (response.status === 200) {
                setFormData({
                    username: "",
                    first_name: "",
                    last_name: "",
                    gender: "",
                    phone_number: "",
                    email: "",
                    instagram: "",
                    facebook: "",
                    whatsapp: "",
                    tiktok: "",
                    tags: [],
                    country: { id: 160, name: "Nigeria" },
                    state: {},
                });
                setImage(null);
                setImagePreview(null);
                setSuccessModalMessage('Lead has been successfully converted to a customer.')
                setIsSuccessModalOpen(true);
                onClose();
            } else {
                alert('Lead conversion failed!');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const renderImageUpload = () => (
        <div className="col-span-2 flex items-center justify-start gap-4">
            <div className="flex bg-white items-center justify-center gap-[12.8px] w-[64px] h-[64px] rounded-[1598.4px] border-[1.6px] border-[var(--Greyscale-100, #DFE1E6)] bg-[var(--Greyscale-0, #FFF)] shadow-[0px_1.6px_3.2px_0px_rgba(13,13,18,0.06)]">
                {!imagePreview && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M18.6667 18.6667H13.3334C9.65146 18.6667 6.66669 21.6514 6.66669 25.3333V26.6667C6.66669 27.403 7.26364 28 8.00002 28H24C24.7364 28 25.3334 27.403 25.3334 26.6667V25.3333C25.3334 21.6514 22.3486 18.6667 18.6667 18.6667Z" stroke="#0D0D12" strokeWidth="2.66667"/>
                        <path d="M16 14.6667C18.9455 14.6667 21.3334 12.2789 21.3334 9.33333C21.3334 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z" stroke="#0D0D12" strokeWidth="2.66667"/>
                    </svg>
                )}
                {imagePreview && (
                    <Image 
                        src={imagePreview} 
                        alt="Profile" 
                        width={64} 
                        height={64} 
                        className="rounded-full object-cover"
                    />
                )}
            </div>

            <div className="flex bg-white cursor-pointer items-center justify-center gap-2 h-[40px] px-[12px] py-[8px] rounded-[10px] border border-[var(--Greyscale-100, #DFE1E6)] bg-[var(--Greyscale-0, #FFF)] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                    id="imageUpload"
                />
                <label htmlFor="imageUpload" className="flex items-center gap-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5.66669 7.33301H4.66669C3.56212 7.33301 2.66669 8.22844 2.66669 9.33301V10.6663C2.66669 11.7709 3.56212 12.6663 4.66669 12.6663H11.3334C12.4379 12.6663 13.3334 11.7709 13.3334 10.6663V9.33301C13.3334 8.22844 12.4379 7.33301 11.3334 7.33301H10.3334M8.00002 8.66634V3.33301M8.00002 3.33301L6.33335 4.99967M8.00002 3.33301L9.66669 4.99967" stroke="#0D0D12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-black text-center text-[14px] font-semibold">
                        Add Image
                    </p>
                </label>
            </div>
        </div>
    );

    const modalFooter = (
        <div className="flex gap-3 w-7/12">
            <button
                type="button"
                onClick={onClose}
                className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-30"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="customerForm"
                className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md "
            >
                Save
            </button>
        </div>
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Convert Lead to Customer"
                width="700px"
                footer={modalFooter}
            >
                <form id="customerForm" className="grid grid-cols-2 gap-4 " onSubmit={handleSubmit}>
                    {renderImageUpload()}
                    
                    <div>
                        <label className="text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData?.username}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="Johnny_22"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData?.first_name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="John"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm ">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm">Gender</label>

                        <Select
                            name="gender"
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' }
                            ]}
                            classNamePrefix="select"
                            onChange={handleGenderChange}
                            value={formData.gender ? { value: formData.gender, label: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) } : null}
                            placeholder="Select gender"
                            styles={selectStyles}
                        />
                    </div>
                    <div>
                        <label className="text-sm ">Phone Number</label>
                        <div className="flex">
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 mt-2"
                                placeholder="8101790957"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm ">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="johndoe@mail.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm">Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="Instagram username"
                        />
                    </div>
                    <div>
                        <label className="text-sm ">Facebook</label>
                        <input
                            type="text"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="Facebook username"
                        />
                    </div>
                    <div>
                        <label className="text-sm">WhatsApp</label>
                        <input
                            type="text"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="WhatsApp number"
                        />
                    </div>
                    <div>
                        <label className="text-sm ">TikTok</label>
                        <input
                            type="text"
                            name="tiktok"
                            value={formData.tiktok}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                            placeholder="TikTok handle"
                        />
                    </div>
                    {/* Multiselect Tags */}
                    <div>
                        <label className="text-sm">Tags</label>
                        <Select
                            isMulti
                            name="tags"
                            options={tags?.map(tag => ({ 
                                value: tag.id, 
                                label: tag.name 
                            }))}
                            classNamePrefix="select"
                            onChange={handleTagChange}
                            value={formData?.tags}
                            placeholder="Select tags"
                            styles={selectStyles}
                        />
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default LeadToCustomer;