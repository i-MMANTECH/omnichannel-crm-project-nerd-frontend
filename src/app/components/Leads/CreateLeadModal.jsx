import React, { useState, useEffect } from "react";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import Image from "next/image";
import Select from "react-select";
import { selectStyles } from "../selectStyles";
import Modal from "../Modal";

const INITIAL_FORM = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    category: null,
    channel: null,
};

// Curated category list aligned with NativeTalk's customer engagement focus.
// Backend categories are merged in alongside these (deduped by label) so any
// company-specific values still appear.
const DEFAULT_CATEGORY_OPTIONS = [
    "New Customer",
    "Sales Inquiry",
    "Support Request",
    "Complaint",
    "Feedback",
    "Partnership",
    "Follow-up",
    "VIP / High Priority",
    "Abandoned Chat",
    "Other",
];

const dedupeByLabel = (items) => {
    const seen = new Set();
    return items.filter((item) => {
        const key = (item.label || "").toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

function CreateLeadModal({ isOpen, onClose, setIsSuccessModalOpen, setSuccessModalMessage }) {
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();
    const [categories, setCategories] = useState([]);
    const [channels, setChannels] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [contactError, setContactError] = useState("");

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchSelectOptions();
        }
    }, [isOpen]);

    const fetchSelectOptions = async () => {
        try {
            const [catRes, channelsRes] = await Promise.all([
                axiosInstance.get("/customers/leads/categories/"),
                axiosInstance.get("/channels/connected-channels/"),
            ]);
            setCategories(catRes.data.categories || []);
            setChannels(channelsRes.data.connected_channels || []);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear the contact-required error as soon as the user provides one.
        if ((name === "email" || name === "phone_number") && contactError && value.trim()) {
            setContactError("");
        }
    };

    const handleCategoryChange = (selectedOption) => {
        setFormData((prev) => ({ ...prev, category: selectedOption }));
    };

    const handleChannelChange = (selectedOption) => {
        setFormData((prev) => ({ ...prev, channel: selectedOption }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setImage(null);
        setImagePreview(null);
        setContactError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        // Hard-required by the backend.
        if (!formData.channel?.value) {
            handleApiError({
                response: { data: { channel: "Please select a channel for this lead." } },
            });
            return;
        }
        if (!formData.category?.label) {
            handleApiError({
                response: { data: { category: "Please select a category for this lead." } },
            });
            return;
        }
        // At-least-one-of-email-or-phone — leads without any contact path are
        // not actionable.
        if (!formData.email.trim() && !formData.phone_number.trim()) {
            setContactError("Please provide either an email address or a phone number.");
            return;
        }

        try {
            setSubmitting(true);

            const fullName = `${formData.first_name || ""} ${formData.last_name || ""}`.trim();

            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", fullName || formData.first_name);
            formDataToSubmit.append("first_name", formData.first_name);
            if (formData.last_name) formDataToSubmit.append("last_name", formData.last_name);
            if (formData.email) formDataToSubmit.append("email", formData.email);
            if (formData.phone_number) formDataToSubmit.append("phone_number", formData.phone_number);

            // Channel = PrimaryKeyRelatedField (id).
            formDataToSubmit.append("channel", formData.channel.value);

            // Category = SafeSlugRelatedField on `name`. The backend expects
            // an existing category — the seed migration in the matching
            // backend ticket guarantees the 10 default categories exist per
            // company, so no client-side create-on-the-fly is needed.
            formDataToSubmit.append("categories", formData.category.label);

            if (image) {
                formDataToSubmit.append("image", image);
            }

            const response = await axiosInstance.post("/customers/leads/", formDataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201 || response.status === 200) {
                resetForm();
                onClose();
                if (typeof setSuccessModalMessage === "function") {
                    setSuccessModalMessage("Lead has been successfully created.");
                }
                setIsSuccessModalOpen(true);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderImageUpload = () => (
        <div className="col-span-2 flex items-center justify-start gap-4">
            <div className="flex bg-white items-center justify-center gap-[12.8px] w-[64px] h-[64px] rounded-[1598.4px] border-[1.6px] border-[var(--Greyscale-100,#DFE1E6)] bg-[var(--Greyscale-0,#FFF)] shadow-[0px_1.6px_3.2px_0px_rgba(13,13,18,0.06)]">
                {!imagePreview && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M18.6667 18.6667H13.3334C9.65146 18.6667 6.66669 21.6514 6.66669 25.3333V26.6667C6.66669 27.403 7.26364 28 8.00002 28H24C24.7364 28 25.3334 27.403 25.3334 26.6667V25.3333C25.3334 21.6514 22.3486 18.6667 18.6667 18.6667Z" stroke="#0D0D12" strokeWidth="2.66667" />
                        <path d="M16 14.6667C18.9455 14.6667 21.3334 12.2789 21.3334 9.33333C21.3334 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z" stroke="#0D0D12" strokeWidth="2.66667" />
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

            <div className="flex bg-white cursor-pointer items-center justify-center gap-2 h-[40px] px-[12px] py-[8px] rounded-[10px] border border-[var(--Greyscale-100,#DFE1E6)] bg-[var(--Greyscale-0,#FFF)] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="leadImageUpload"
                />
                <label htmlFor="leadImageUpload" className="flex items-center gap-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5.66669 7.33301H4.66669C3.56212 7.33301 2.66669 8.22844 2.66669 9.33301V10.6663C2.66669 11.7709 3.56212 12.6663 4.66669 12.6663H11.3334C12.4379 12.6663 13.3334 11.7709 13.3334 10.6663V9.33301C13.3334 8.22844 12.4379 7.33301 11.3334 7.33301H10.3334M8.00002 8.66634V3.33301M8.00002 3.33301L6.33335 4.99967M8.00002 3.33301L9.66669 4.99967" stroke="#0D0D12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-black text-center text-[14px] font-semibold">Add Image</p>
                </label>
            </div>
        </div>
    );

    const channelOptions = channels.map((c) => ({
        value: c.id,
        label: c.name || c.channel_name || `Channel #${c.id}`,
    }));

    const categoryOptions = dedupeByLabel([
        ...DEFAULT_CATEGORY_OPTIONS.map((label) => ({ value: label, label })),
        ...categories.map((cat) => ({
            value: cat.id,
            label: cat.label || cat.name,
        })),
    ]);

    const noChannels = channels.length === 0;

    const modalFooter = (
        <div className="flex gap-3 w-7/12">
            <button
                type="button"
                onClick={onClose}
                className="w-6/12 px-4 py-2 bg-theme rounded-md border border-gray-300"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="leadForm"
                disabled={submitting || noChannels}
                className="w-6/12 px-4 py-2 bg-[#3EBF0F] text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {submitting ? "Creating..." : "Create Lead"}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Lead"
            width="700px"
            footer={modalFooter}
        >
            {noChannels && (
                <div className="mb-4 px-4 py-3 rounded-md border border-yellow-200 bg-yellow-50 text-sm text-yellow-800">
                    No channels are connected for this company. Connect a channel under
                    Settings before creating a lead manually.
                </div>
            )}

            <form id="leadForm" className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                {renderImageUpload()}

                <div className="col-span-2">
                    <label className="text-sm">Channel <span className="text-red-500">*</span></label>
                    <Select
                        name="channel"
                        options={channelOptions}
                        classNamePrefix="select"
                        onChange={handleChannelChange}
                        value={formData.channel}
                        placeholder={noChannels ? "No connected channels" : "Select the channel this lead came from"}
                        styles={selectStyles}
                        isClearable
                        isDisabled={noChannels}
                    />
                </div>

                <div>
                    <label className="text-sm">First Name <span className="text-red-500">*</span></label>
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
                    <label className="text-sm">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 mt-2"
                        placeholder="Doe"
                    />
                </div>

                <div>
                    <label className="text-sm">Phone Number</label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={`w-full border rounded-md p-2 mt-2 ${contactError ? "border-red-400" : "border-gray-300"}`}
                        placeholder="+234 801 234 5678"
                    />
                </div>

                <div>
                    <label className="text-sm">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full border rounded-md p-2 mt-2 ${contactError ? "border-red-400" : "border-gray-300"}`}
                        placeholder="johndoe@mail.com"
                    />
                </div>

                {contactError && (
                    <p className="col-span-2 -mt-2 text-xs text-red-500">{contactError}</p>
                )}

                <div className="col-span-2">
                    <label className="text-sm">Category <span className="text-red-500">*</span></label>
                    <Select
                        name="category"
                        options={categoryOptions}
                        classNamePrefix="select"
                        onChange={handleCategoryChange}
                        value={formData.category}
                        placeholder="Select a category"
                        styles={selectStyles}
                        isClearable
                    />
                </div>
            </form>
        </Modal>
    );
}

export default CreateLeadModal;
