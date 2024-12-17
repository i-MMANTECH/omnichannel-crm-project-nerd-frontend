import React, { useState, useEffect } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import SuccessModal from "../../SuccessModal";
import Image from "next/image";
import Select from 'react-select';
import { selectStyles } from "../../selectStyles";


const CreateCustomerModal = ({ isModalOpen, closeModal }) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
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
        country: {id: 160, name: "Nigeria"},
        state: {},
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // const fetchInitialData = async () => {
    //     try {
    //         const countriesResponse = await axiosInstance.get("/users/countries/");
    //         setCountries(countriesResponse.data.countries);
    //         fetchStates();
    //     } catch (error) {
    //         console.log('country error', error.response)
    //         handleApiError(error);
    //     }
    // };

    // const fetchStates = async () => {
    //     if (formData.country) {
    //         try {
    //             const statesResponse = await axiosInstance.get(`/users/countries/${formData.country.id}/states/`);
    //             console.log(statesResponse)
    //             setStates('state response is ', statesResponse.data.states);
    //         } catch (error) {
    //             handleApiError(error);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     if (isModalOpen) {
    //         fetchInitialData();
    //     }
    // }, [isModalOpen]);

    // useEffect(() => {
    //     if (isModalOpen) {
    //         fetchStates();
    //     }
    // }, [formData.country]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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

    const handleCountryChange = (selectedCountry) => {
        setFormData(prev => ({ 
            ...prev, 
            country: selectedCountry,
            state: null
        }));
    };

    const handleStateChange = (selectedState) => {
        setFormData(prev => ({ ...prev, state: selectedState }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                tags: formData?.tags?.map(tag => tag.id),
                country: formData.country?.id,
                state: formData.state?.id
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


            const response = await axiosInstance.post("/customers/", formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                closeModal();
                setIsSuccessModalOpen(true);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const renderImageUpload = () => {
        return (
            <div className="col-span-2 flex items-center justify-start gap-4 p-2">
                <div className="flex bg-white items-center justify-center gap-[12.8px] w-[64px] h-[64px] rounded-[1598.4px] border-[1.6px] border-[var(--Greyscale-100, #DFE1E6)] bg-[var(--Greyscale-0, #FFF)] shadow-[0px_1.6px_3.2px_0px_rgba(13,13,18,0.06)]">
                    {!imagePreview && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
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
    };


    return (
        <>
            {isModalOpen && (
                <div className="fixed mt-14 inset-0 body-theme bg-opacity-50 flex items-center justify-center z-50">
                    <div className="body-theme text-md border rounded-lg shadow-lg p-6 w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        {/* Modal Header */}
                        <p className="flex items-center gap-2 text-[16px] font-[500] leading-[150%] tracking-[0.32px]">
                            {/* ... existing header SVGs ... */}
                        </p>

                        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                            {renderImageUpload()}

                            <div>
                                <label className="text-sm">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
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
                                    value={formData.first_name}
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

                            {/* Country Dropdown */}
                            {/* <div>
                                <label className="text-sm">Country</label>
                                <Select
                                    name="country"
                                    options={countries.map(country => ({ 
                                        value: country.id, 
                                        label: country.name 
                                    }))}
                                    onChange={handleCountryChange}
                                    value={formData.country ? { 
                                        value: formData.country.id, 
                                        label: formData.country.name 
                                    } : null}
                                    placeholder="Select country"
                                    styles={selectStyles}
                                />
                            </div> */}

                            {/* State Dropdown */}
                            {/* <div>
                                <label className="text-sm">State</label>
                                <Select
                                    name="state"
                                    options={states.map(state => ({ 
                                        value: state.id, 
                                        label: state.name 
                                    }))}
                                    onChange={handleStateChange}
                                    value={formData.state ? { 
                                        value: formData.state.id, 
                                        label: formData.state.name 
                                    } : null}
                                    placeholder="Select state"
                                    isDisabled={!formData.country}
                                    styles={selectStyles}
                                />
                            </div> */}

                            {/* Form submission buttons */}
                            <div className="col-span-2 flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 body-theme text-black rounded-md mr-2 border border-gray-300"
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
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </>
    );
};

export default CreateCustomerModal;