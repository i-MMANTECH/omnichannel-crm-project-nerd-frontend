'use client'


import React, { useState, useEffect, useRef, Suspense } from "react";
import AssignedMessages from "./AssignedMessages";
import WorkSchedule from "./WorkSchedule";
import './UserDetailsStyle.css';
import UserAvatar from "../../UserAvatar";
import Image from "next/image";
import { getRoleStyle } from "@/utils/getRoleStyle";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import EditUserModal from "./EditUserModal";
import ConfirmationModal from "../../ConfirmationModal";
import SuccessModal from "../../SuccessModal";


const ModalController = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isModalOpen = searchParams.get('action') === 'edit-customer';

  const openModal = () => {
    const params = new URLSearchParams(searchParams);
    params.set('action', 'edit-customer');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('action');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };


  return children({ isModalOpen, openModal, closeModal });
};


export default function UserDetails() {
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [selected, setSelected] = useState("work-schedule");
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const [user, setUser] = useState({})
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isToggleActiveModalOpen, setIsToggleActiveModalOpen] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");
  const [isActionSuccessOpen, setIsActionSuccessOpen] = useState(false);
  const router = useRouter();

  const { id } = useParams();

  const getUser = async () => {
    try {
      const { data } = await axiosInstance.get(`/users/${id}/`);
      setUser(data.user);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    getUser()
  };

  const closeActionSuccessModal = () => {
    setIsActionSuccessOpen(false);
    setActionSuccessMessage("");
    getUser();
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/users/${id}/`);
      setIsDeleteModalOpen(false);
      setIsSuccessModalOpen(true);
      router.push("/nativecrm/users");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleToggleActiveStatus = async () => {
    try {
      const nextActive = !user?.is_active;
      const endpoint = nextActive
        ? `/users/account/${id}/enable/`
        : `/users/account/${id}/disable/`;
      await axiosInstance.post(endpoint);
      setIsToggleActiveModalOpen(false);
      setActionSuccessMessage(nextActive ? "User enabled successfully" : "User disabled successfully");
      setIsActionSuccessOpen(true);
      setUser((prev) => ({ ...prev, is_active: nextActive }));
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
              <div className="user-top-content flex justify-between border w-full rounded-lg p-6 gap-3">
                <div className="px-6 py-4 flex flex-col items-center gap-1 h-fit rounded-lg border border-gray-200 body-theme">
                  {user?.image && <Image
                    className="user-left-image mt-2 w-10 h-10 rounded-full"
                    alt="bio"
                    src={user?.image}
                    width={50}
                    height={50}
                  />}
                  {!user?.image &&
                    <UserAvatar
                      name={user?.first_name ?
                        `${user?.first_name} ${user?.last_name}` :
                        user?.email || '--'
                      }
                      width="w-8"
                      height="h-8"
                    />
                  }


                  <p className="user-left-name">
                    {user?.first_name ?
                      `${user?.first_name} ${user?.last_name}` : '--'
                    }
                  </p>
                  <p className="user-left-email">{user?.email}</p>
                  <div className="flex w-full mt-4 items-center justify-center">
                    <p className="py-1 pl-2 pr-2 text-right text-[#40C4AA] -ml-1 font-medium text-[12px] font-normal rounded-sm">
                      {user?.roles?.map((role) => (
                        <span
                          key={role.id}
                          className="px-2 py-1 rounded ml-1"
                          style={getRoleStyle(role.name)}
                        >
                          {role.name}
                        </span>
                      ))}
                    </p>
                    {user?.last_active &&
                      <p className="text-right font-medium text-sm bg-[#F8F9FB] dark:bg-gray-800 px-2 py-1 rounded">
                        Last active: {user?.last_active}
                      </p>
                    }
                  </div>
                  <div className="flex gap-6 mt-5">
                    <div
                      className="flex flex-col items-center gap-2 cursor-pointer"
                      onClick={() => startCall({ name: customerName, id: customer.id })}
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
                    <div className="relative">
                      <div
                        className="pointer flex flex-col items-center gap-2"
                        ref={buttonRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === user?.id ? null : user?.id);
                        }}>
                        <div className="flex w-8 h-8 p-2 justify-center items-center gap-2 rounded-md border border-gray-100 bg-white shadow-sm text-gray-600">
                          <svg width="12" height="4" viewBox="0 0 12 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.91665 1.99967C6.91665 2.36786 6.61817 2.66634 6.24998 2.66634C5.88179 2.66634 5.58331 2.36786 5.58331 1.99967C5.58331 1.63148 5.88179 1.33301 6.24998 1.33301C6.61817 1.33301 6.91665 1.63148 6.91665 1.99967Z" fill="#0D0D12" />
                            <path d="M2.91665 1.99967C2.91665 2.36786 2.61817 2.66634 2.24998 2.66634C1.88179 2.66634 1.58331 2.36786 1.58331 1.99967C1.58331 1.63148 1.88179 1.33301 2.24998 1.33301C2.61817 1.33301 2.91665 1.63148 2.91665 1.99967Z" fill="#0D0D12" />
                            <path d="M10.9166 1.99967C10.9166 2.36786 10.6182 2.66634 10.25 2.66634C9.88179 2.66634 9.58331 2.36786 9.58331 1.99967C9.58331 1.63148 9.88179 1.33301 10.25 1.33301C10.6182 1.33301 10.9166 1.63148 10.9166 1.99967Z" fill="#0D0D12" />
                            <path d="M6.91665 1.99967C6.91665 2.36786 6.61817 2.66634 6.24998 2.66634C5.88179 2.66634 5.58331 2.36786 5.58331 1.99967C5.58331 1.63148 5.88179 1.33301 6.24998 1.33301C6.61817 1.33301 6.91665 1.63148 6.91665 1.99967Z" stroke="#0D0D12" strokeWidth="2" />
                            <path d="M2.91665 1.99967C2.91665 2.36786 2.61817 2.66634 2.24998 2.66634C1.88179 2.66634 1.58331 2.36786 1.58331 1.99967C1.58331 1.63148 1.88179 1.33301 2.24998 1.33301C2.61817 1.33301 2.91665 1.63148 2.91665 1.99967Z" stroke="#0D0D12" strokeWidth="2" />
                            <path d="M10.9166 1.99967C10.9166 2.36786 10.6182 2.66634 10.25 2.66634C9.88179 2.66634 9.58331 2.36786 9.58331 1.99967C9.58331 1.63148 9.88179 1.33301 10.25 1.33301C10.6182 1.33301 10.9166 1.63148 10.9166 1.99967Z" stroke="#0D0D12" strokeWidth="2" />
                          </svg>

                        </div>
                        <span className="text-center text-sm font-normal font-['Encode_Sans'] tracking-wide leading-[150%]">
                          More
                        </span>
                      </div>
                      {menuOpen === user?.id && (
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
                              Edit user
                            </button>
                          </div>
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsToggleActiveModalOpen(true);
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {user?.is_active ? "Disable User" : "Enable User"}
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
                              Delete user
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 ms-4 justify-start flex-col body-theme">
                  <p className=" font-medium text-[14px] font-normal text-left">
                    General
                  </p>
                  <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-2" />

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] font-normal text-left">
                      Name
                    </p>
                    <p className="user-left-name">
                      {user?.first_name ?
                        `${user?.first_name} ${user.last_name}` : '--'
                      }
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] font-normal text-left">
                      Role
                    </p>
                    <p className="user-left-name -ml-1">
                      {user?.roles?.map((role) => (
                        <span
                          key={role.id}
                          className="px-2 py-1 ml-1 rounded"
                          style={getRoleStyle(role.name)}
                        >
                          {role.name}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] font-normal text-left">
                      Email
                    </p>
                    <p className="user-left-name">{user?.email || '--'}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium text-[14px] font-normal text-left">
                      Phone Number
                    </p>
                    <p className="user-left-name">{user?.phone_number || '--'}</p>
                  </div>

                  {user?.gender || user?.dob || user?.country || user?.state &&
                    <div>
                      <p className="mt-5 text-left">
                        Other Information
                      </p>
                      <hr className="w-[318px] h-[1px] bg-[#DFE1E6] mt-2" />

                      <div className="flex items-center justify-between mt-2">
                        {user?.gender && (
                          <>
                            <p className="font-medium text-[14px] font-normal text-left">
                              Gender
                            </p>
                            <p className="user-left-name">{user.gender}</p>
                          </>
                        )}
                      </div>

                      {user?.dob && (
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                            DOB
                          </p>
                          <p className="user-left-name">{user.dob}</p>
                        </div>
                      )}

                      {user?.country && (
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                            Country
                          </p>
                          <p className="user-left-name">{user.country}</p>
                        </div>
                      )}

                      {user?.state && (
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-medium text-[14px] leading-[21px] tracking-[0.2px] font-normal text-left">
                            State
                          </p>
                          <p className="user-left-name">{user.state}</p>
                        </div>
                      )}
                    </div>
                  }


                </div>
              </div>

              <div className="hidden w-full">
                <div className="flex flex-selected justify-start gap-4 w-full mt-4">
                  <p
                    className={`cursor-pointer ${selected === "work-schedule" ? "selected" : "not-selected"}`}
                    onClick={() => setSelected("work-schedule")}
                  >
                    Work Schedule
                  </p>
                  <p
                    className={`cursor-pointer pb-2 px-10 ${selected === "assigned-messages" ? "selected" : "not-selected"}`}
                    onClick={() => setSelected("assigned-messages")}
                  >
                    Assigned Messages
                  </p>
                </div>

                <div className="mt-6 w-full">
                  {selected === "work-schedule" && (
                    <WorkSchedule />
                  )}
                  {selected === "assigned-messages" && (
                    // <AssignedMessages/>
                    <div>
                      Agent has no assigned messages
                    </div>
                  )}
                </div>
              </div>
            </div>

            <EditUserModal
              isOpen={isModalOpen}
              onClose={closeModal}
              userId={user?.id}
              setIsSuccessModalOpen={setIsSuccessModalOpen}
            />

            <SuccessModal
              isOpen={isSuccessModalOpen}
              title="Success!"
              message="User updated successfully"
              buttonText="Okay, thank you"
              onClose={closeSuccessModal}
            />

            <SuccessModal
              isOpen={isActionSuccessOpen}
              title="Success!"
              message={actionSuccessMessage}
              buttonText="Okay, thank you"
              onClose={closeActionSuccessModal}
            />

            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              title="Confirm Delete"
              message="Are you sure you want to delete this user?"
              onConfirm={handleConfirmDelete}
              onCancel={() => setIsDeleteModalOpen(false)}
            />

            <ConfirmationModal
              isOpen={isToggleActiveModalOpen}
              title={user?.is_active ? "Disable User" : "Enable User"}
              message={
                user?.is_active
                  ? "Are you sure you want to disable this user?"
                  : "Are you sure you want to enable this user?"
              }
              onConfirm={handleToggleActiveStatus}
              onCancel={() => setIsToggleActiveModalOpen(false)}
            />
          </div>
        )}
      </ModalController>
    </Suspense>
  );
}


