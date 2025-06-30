'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import AssignedMessages from "./AssignedMessages";
import './CustomerDetailsStyle.css';
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import Notes from "./Notes";
import { getRoleStyle } from "@/utils/getRoleStyle";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import EditCustomerModal from "./EditCustomerModal";
import SuccessModal from '@/app/components/SuccessModal';
import SendMessageModal from "./SendMessageModal";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { useCall } from "@/context/CallContext";
import ConfirmationModal from "../../components/ConfirmationModal";

const ModalController = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const isModalOpen = searchParams.get('action') === 'edit-customer';

  const openModal = () => {
      const params = new URLSearchParams(searchParams);
      params.set('action', 'edit-customer');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
      const params = new URLSearchParams(searchParams);
      params.delete('action');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  

  return children({ isModalOpen, openModal, closeModal });
};

export default function CustomerDetails() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const { makeCall } = useCall();
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [selected, setSelected] = useState("work-schedule");
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState({})

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { id } = useParams();

  const getCustomer = async () => {
    try {
      const { data } = await axiosInstance.get(`/customers/${id}/`);
      setCustomer(data.customer);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [id]);
  

  const handleChatSelect = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/communication/customer-chat-history/${customer.id}/`);
      const messages = response.data?.results?.messages || [];

      if (messages.length > 0) {
        router.push(`/nativecrm/messages?chat=customers&id=${customer.id}`);
      } else {
        setIsMessageModalOpen(true);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    getCustomer()
  };

const customerUsername = useMemo(() => {
  if (customer?.username) {
    return customer.username;
  } else if (customer?.name) {
    return customer.name;
  } else if (customer?.first_name && customer?.last_name) {
    return `${customer.first_name} ${customer.last_name}`;
  } else if (customer?.first_name) {
    return customer.first_name;
  } else {
    return '--';
  }
}, [customer]);


  const customerName = useMemo(() => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name} ${customer.last_name}`;
    } else if (customer?.first_name) {
      return customer.first_name;
    } else if (customer?.username) {
      return customer.username;
    } else {
      return '--';
    }
  }, [customer]);
  

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/customers/${id}/`);
      setIsDeleteModalOpen(false);
      setIsSuccessModalOpen(true);
      router.push("/nativecrm/customers");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>    
      <ModalController>
        {({ isModalOpen, openModal, closeModal }) => (
          <div className="flex justify-center mt-5">
            <div className="flex mb-5 flex-col max-w-[788px] p-8 items-center gap-6 flex-1 rounded-lg border border-gray-300 body-theme">
              <div className="customer-top-content flex justify-between border w-full rounded-lg p-6 gap-3">
                <div className="px-6 py-4 flex flex-col items-center gap-1 h-fit rounded-lg border border-gray-200 body-theme">
                  {customer?.image && <Image 
                    alt="profile pic"
                    width={40}
                    height={40}
                    className="customer-left-image mt-2 rounded-full w-20 h-20" 
                    src={customer.image} 
                  />}
                  {!customer?.image && <UserAvatar name={ customerUsername } width="w-20" height="h-20" />}

                  <p className="customer-left-name text-xl font-bold mt-1">{ customerUsername.slice(0, 10) }</p>
                  <p className="customer-left-email text-sm mt-1">{ customer?.email }</p>
                  <div className="flex gap-6 mt-5">
                    <div
                      className="hidden flex flex-col items-center gap-2 cursor-pointer"
                      onClick={() => makeCall({ phone: customer?.phone_number, name: customerName, id: customer.id })}
                    >
                      <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 17 16" stroke="currentColor">
                          <path d="M8.61164 9.82798L6.91797 8.13712C6.37282 7.59287 6.37282 6.71048 6.91797 6.16623C7.40516 5.67985 7.46403 4.91134 7.05658 4.35665L5.6659 2.46343C5.25421 1.90296 4.43898 1.84072 3.94671 2.33217C3.19724 3.08039 2.69543 4.07059 2.75475 5.12706C3.04456 10.2884 7.08224 13.7386 11.6484 13.9953C12.6955 14.0542 13.6707 13.5486 14.4123 12.8082C14.9119 12.3094 14.8486 11.4834 14.2789 11.0663L12.3984 9.68959C11.8428 9.28282 11.073 9.34159 10.5858 9.82798C10.0407 10.3722 9.1568 10.3722 8.61164 9.82798Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-center text-sm font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                        Call
                      </span>
                    </div>

                    <div onClick={() => handleChatSelect()} className="flex flex-col items-center gap-2 pointer" >
                      <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 16" fill="none">
                          <path d="M6.08333 5.33333H8.08333M6.08333 8H10.0833M4.08333 2H13.4167C14.153 2 14.75 2.59431 14.75 3.32743V9.96753C14.75 10.7007 14.153 11.295 13.4167 11.295H5.73708C5.53456 11.295 5.34302 11.3866 5.2165 11.5441L3.34362 13.8748C3.14679 14.1198 2.75 13.9812 2.75 13.6675V3.32743C2.75 2.59431 3.34695 2 4.08333 2Z" stroke="#0D0D12" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="text-center text-sm font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                        Message
                      </span>
                    </div>

                    <div className="relative">
                    <div 
                    className="pointer flex flex-col items-center gap-2"
                    ref={buttonRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === customer.id ? null : customer.id);
                        }}>
                      <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                      <svg width="12" height="4" viewBox="0 0 12 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.91665 1.99967C6.91665 2.36786 6.61817 2.66634 6.24998 2.66634C5.88179 2.66634 5.58331 2.36786 5.58331 1.99967C5.58331 1.63148 5.88179 1.33301 6.24998 1.33301C6.61817 1.33301 6.91665 1.63148 6.91665 1.99967Z" fill="#0D0D12"/>
                        <path d="M2.91665 1.99967C2.91665 2.36786 2.61817 2.66634 2.24998 2.66634C1.88179 2.66634 1.58331 2.36786 1.58331 1.99967C1.58331 1.63148 1.88179 1.33301 2.24998 1.33301C2.61817 1.33301 2.91665 1.63148 2.91665 1.99967Z" fill="#0D0D12"/>
                        <path d="M10.9166 1.99967C10.9166 2.36786 10.6182 2.66634 10.25 2.66634C9.88179 2.66634 9.58331 2.36786 9.58331 1.99967C9.58331 1.63148 9.88179 1.33301 10.25 1.33301C10.6182 1.33301 10.9166 1.63148 10.9166 1.99967Z" fill="#0D0D12"/>
                        <path d="M6.91665 1.99967C6.91665 2.36786 6.61817 2.66634 6.24998 2.66634C5.88179 2.66634 5.58331 2.36786 5.58331 1.99967C5.58331 1.63148 5.88179 1.33301 6.24998 1.33301C6.61817 1.33301 6.91665 1.63148 6.91665 1.99967Z" stroke="#0D0D12" strokeWidth="2"/>
                        <path d="M2.91665 1.99967C2.91665 2.36786 2.61817 2.66634 2.24998 2.66634C1.88179 2.66634 1.58331 2.36786 1.58331 1.99967C1.58331 1.63148 1.88179 1.33301 2.24998 1.33301C2.61817 1.33301 2.91665 1.63148 2.91665 1.99967Z" stroke="#0D0D12" strokeWidth="2"/>
                        <path d="M10.9166 1.99967C10.9166 2.36786 10.6182 2.66634 10.25 2.66634C9.88179 2.66634 9.58331 2.36786 9.58331 1.99967C9.58331 1.63148 9.88179 1.33301 10.25 1.33301C10.6182 1.33301 10.9166 1.63148 10.9166 1.99967Z" stroke="#0D0D12" strokeWidth="2"/>
                      </svg>

                      </div>
                      <span className="text-center text-sm font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                        More
                      </span>
                    </div>
                    {menuOpen === customer.id && (
                        <div
                          ref={menuRef}
                          className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                        >
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal()
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              Edit customer
                            </button>
                          </div>
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteModalOpen(true);
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              Delete customer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 ms-4 justify-start flex-col body-theme">
                  <p className="text-left">
                    General
                  </p>
                  <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-3 mb-1" />

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-left">
                      Name
                    </p>
                    <p className="customer-left-name font-bold">{ customerName.slice(0, 30) }</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-left">
                      Gender
                    </p>
                    <p className="customer-left-name font-bold">{ customer?.gender || '--'}</p>
                  </div>

                  <div className="flex flex-row items-center justify-between mt-2 ">
                    <p className="flex-1">Tags</p>
                    {customer?.tags?.length <= 0 && (
                      <p className="customer-left-name font-bold mr-1">--</p>
                    )}
                      <div className="flex flex-wrap gap-1 max-w-[250px]  text-sm ">
                        {customer?.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 ml-1 rounded whitespace-nowrap"
                            style={getRoleStyle(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-left">
                      Email
                    </p>
                    <p className="customer-left-name font-bold">{ customer?.email || '--' }</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-left">
                      Phone Number
                    </p>
                    <p className="customer-left-name font-bold">{ customer?.phone_number || '--' }</p>
                  </div>

                  <p className="text-left mt-6">
                    Other Information
                  </p>
                  <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-3 mb-1" />

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-left">
                      Country
                    </p>
                    <p className="customer-left-name font-bold">{ customer?.country || '--' }</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-left">
                      City
                    </p>
                    <p className="customer-left-name font-bold">{ customer?.state || '--' }</p>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-selected justify-start gap-4 w-full mt-4">
                  <p
                    className={`cursor-pointer pb-2 px-10 ${selected === "work-schedule" ? "selected" : "not-selected"}`}
                    onClick={() => setSelected("work-schedule")}
                  >
                    Notes
                  </p>
                  <p
                    className={`cursor-pointer pb-2 px-10  ${selected === "assigned-messages" ? "selected" : "not-selected"}`}
                    onClick={() => setSelected("assigned-messages")}
                  >
                    Messages
                  </p>
                </div>

                <div className="mt-10 w-full ">
                  {selected === "work-schedule" && (
                    <Notes customerId={customer.id}/>
                  )}
                  {selected === "assigned-messages" && (
                    <AssignedMessages/>
                  )}
                </div>
              </div>
            </div>

            <EditCustomerModal 
                isOpen={isModalOpen} 
                onClose={closeModal}
                customerId={customer?.id}
                setIsSuccessModalOpen={setIsSuccessModalOpen}
            />

            <SendMessageModal
              isOpen={isMessageModalOpen}
              onClose={() => setIsMessageModalOpen(false)}
              customerId={customer.id}
              customerName={customerName}
              onMessageSent={() => router.push(`/nativecrm/messages?chat=customers&id=${customer.id}`)}
            />

            <SuccessModal
                  isOpen={isSuccessModalOpen}
                  title="Success!"
                  message="Customer updated successfully"
                  buttonText="Okay, thank you"
                  onClose={closeSuccessModal}
              />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Confirm Delete"
                message="Are you sure you want to delete this customer?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
          </div>
        )}
      </ModalController>
    </Suspense>
  );
}