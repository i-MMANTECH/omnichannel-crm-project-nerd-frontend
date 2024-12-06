import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SuccessModal from "../SuccessModal";

const CreateCustomerModal = ({ isModalOpen, closeModal }) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        instagram: "",
        facebook: "",
        whatsapp: "",
        tiktok: "",
        tag: "",
        country: "Nigeria",
        state: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/customers", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                closeModal();
                setIsSuccessModalOpen(true);
            } else {
                alert("Failed to create user. Please try again.");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
            <div className="fixed mt-14 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    <p className="flex items-center gap-2 text-[var(--Greyscale-500, #666D80)] font-[Encode Sans] text-[16px] font-[500] leading-[150%] tracking-[0.32px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                            <path d="M11.6667 11.6667H8.33335C6.03217 11.6667 4.16669 13.5321 4.16669 15.8333V16.6667C4.16669 17.1269 4.53978 17.5 5.00002 17.5H15C15.4603 17.5 15.8334 17.1269 15.8334 16.6667V15.8333C15.8334 13.5321 13.9679 11.6667 11.6667 11.6667Z" stroke="#808897" strokeWidth="1.66667"/>
                            <path d="M10 9.16667C11.841 9.16667 13.3334 7.67428 13.3334 5.83333C13.3334 3.99238 11.841 2.5 10 2.5C8.15907 2.5 6.66669 3.99238 6.66669 5.83333C6.66669 7.67428 8.15907 9.16667 10 9.16667Z" stroke="#808897" strokeWidth="1.66667"/>
                        </svg>
                        Create Customer
                        <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer ml-auto flex-shrink-0">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#808897" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </p>

                    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                        <div className="col-span-2 flex items-center justify-start  p-2">
                            <div className="flex items-center justify-center gap-[12.8px] w-[64px] h-[64px] rounded-[1598.4px] border-[1.6px] border-[var(--Greyscale-100, #DFE1E6)] bg-[var(--Greyscale-0, #FFF)] shadow-[0px_1.6px_3.2px_0px_rgba(13,13,18,0.06)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
                                    <path d="M18.6667 18.6667H13.3334C9.65146 18.6667 6.66669 21.6514 6.66669 25.3333V26.6667C6.66669 27.403 7.26364 28 8.00002 28H24C24.7364 28 25.3334 27.403 25.3334 26.6667V25.3333C25.3334 21.6514 22.3486 18.6667 18.6667 18.6667Z" stroke="#0D0D12" strokeWidth="2.66667"/>
                                    <path d="M16 14.6667C18.9455 14.6667 21.3334 12.2789 21.3334 9.33333C21.3334 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z" stroke="#0D0D12" strokeWidth="2.66667"/>
                                </svg>
                            </div>

                            <div className="flex items-center justify-center gap-2 h-[40px] px-[12px] py-[8px] rounded-[10px] border border-[var(--Greyscale-100, #DFE1E6)] bg-[var(--Greyscale-0, #FFF)] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M5.66669 7.33301H4.66669C3.56212 7.33301 2.66669 8.22844 2.66669 9.33301V10.6663C2.66669 11.7709 3.56212 12.6663 4.66669 12.6663H11.3334C12.4379 12.6663 13.3334 11.7709 13.3334 10.6663V9.33301C13.3334 8.22844 12.4379 7.33301 11.3334 7.33301H10.3334M8.00002 8.66634V3.33301M8.00002 3.33301L6.33335 4.99967M8.00002 3.33301L9.66669 4.99967" stroke="#0D0D12" stroke-linecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p className="text-[var(--Greyscale-900, #0D0D12)] text-center font-[Encode Sans] text-[14px] font-semibold leading-[150%] tracking-[0.2px]">
                                    Add Image
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="John"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2  bg-gray-100"
                                required
                            >
                                <option>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Phone Number</label>
                            <div className="flex">
                                <select
                                    className="border border-gray-300 rounded-l-md p-2 bg-gray-100"
                                    defaultValue="+234"
                                >
                                    <option value="+1">+1</option>
                                    <option value="+234">+234</option>
                                </select>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-r-md p-2"
                                    placeholder="8101790957"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="johndoe@mail.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Instagram</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="Instagram username"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Facebook</label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="Facebook username"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="WhatsApp number"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">TikTok</label>
                            <input
                                type="text"
                                name="tiktok"
                                value={formData.tiktok}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="TikTok handle"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Tag</label>
                            <select
                                name="tag"
                                value={formData.tag}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2  bg-gray-100"
                            >
                                <option value="">Select tag</option>
                                <option value="VIP">VIP Customer</option>
                                <option value="regular">Regular Customer</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Country</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2  bg-gray-100"
                            >
                                <option value="Nigeria">Nigeria</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                placeholder="Lagos"
                            />
                        </div>

                        <div className="col-span-2 flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-white text-black rounded-md mr-2 border border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#3EBF0F] text-white rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

            <SuccessModal
                isOpen={isSuccessModalOpen}
                title="Success!"
                message="You have successfully created a customer"
                buttonText="Okay, thank you"
                onClose={closeSuccessModal}
            />
        </>
    );
};

export default CreateCustomerModal;
