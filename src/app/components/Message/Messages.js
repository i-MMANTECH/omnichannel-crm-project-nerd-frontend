import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";
import { useAuth } from "@/context/AuthContext";
import "./style.css";
import { useApi } from "@/services/axiosConfig";
import { useError } from '@/context/ErrorContext';
import { useRouter } from "next/navigation";

import { useDebounce } from "use-debounce";

export const Messages = () => {
	const { axiosInstance, loading } = useApi();
	const { user: currentUser } = useAuth();

	const [message, setMessage] = useState("");
	const [activeUser, setActiveUser] = useState(null);
	const [socket, setSocket] = useState(null);
	const [users, setUsers] = useState([]);
	const [chatHistory, setChatHistory] = useState([]);
	const [companyId, setCompanyId] = useState('');
	const { handleApiError } = useError();
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState("leads");
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

	const wsRef = useRef(null);

	useEffect(() => {
		fetchChatHistory();
	}, [activeUser, activeTab]);

  useEffect(() => {
    fetchChatList()
  }, [debouncedSearchQuery])

	useEffect(() => {
		const fetchCompanyId = async () => {
			try {
				const response = await axiosInstance.get("/companies/details/");
				if (response.data.company) {
					setCompanyId(response.data.company.id);
				}
			} catch (error) {
				handleApiError(error);
			}
		};

		fetchCompanyId();
	}, []);

	useEffect(() => {
		if (companyId && !wsRef.current) {
			const protocol = window.location.protocol === "https:" ? "wss" : "ws";
			const wsUrl = `${protocol}://ws-staging.nativetalkcrm.com/ws/chat/?uuid=${companyId}&type=company`;
			wsRef.current = new WebSocket(wsUrl);

			wsRef.current.onopen = () => {
				console.log("WebSocket connected");
			};

			wsRef.current.onerror = (error) => {
				console.error("WebSocket error:", error);
			};

			wsRef.current.onclose = () => {
				console.log("WebSocket disconnected");
				wsRef.current = null;
			};

			return () => {
				if (wsRef.current) {
					wsRef.current.close();
					wsRef.current = null;
				}
			};
		}
	}, [companyId]);

	useEffect(() => {
		if (!wsRef.current) return;
  
		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			const message = data.message;
  
			console.log("Received WebSocket message:", message);

			if (message.is_new_lead) {
				console.log("New sender detected, fetching updated users list...");
				fetchChatList();
			}
  
			if (
				activeUser &&
				(message.lead_sender === activeUser.id ||
				message.customer_sender === activeUser.id ||
				message.lead_info?.id === activeUser.id)
			) {
				setChatHistory((prev) => [...prev, message]);
			} else {
				fetchChatList();
			}
		};
	}, [activeUser, users]);

	const fetchChatList = async () => {
		const endpoint = activeTab === "customers"
			? `/communication/chatted-customers/?search=${debouncedSearchQuery}`
			: `/communication/contacts/?search=${debouncedSearchQuery}`;
  
		console.log("Fetching chat list with endpoint:", endpoint);

		await axiosInstance.get(endpoint)
			.then((response) => {
				setUsers(response.data);
			})
			.catch(handleApiError);
	};
  
	const fetchChatHistory = async () => {
		if (activeUser) {
			const endpoint = activeTab === "customers"
				? `/communication/customer-chat-history/${activeUser.id}`
				: `/communication/history/?lead_id=${activeUser.id}`;
  
			await axiosInstance.get(endpoint)
				.then((response) => {
					setChatHistory(activeTab === "customers"
						? response.data.results.messages.reverse() || []
						: response.data.messages || []);
				})
				.catch(handleApiError);
		} else {
			fetchChatList();
		}
	};

	const handleSendMessage = (messageContent) => {
		const payload = {
			lead_id: activeUser.id,
			content: messageContent.text || "",
			content_type: "text",
		};

		let url = '/communication/';
		let dataToSend = payload;
		if (activeTab === "customers") {
			url += "send-to-customer/";
  
			const formData = new FormData();
			formData.append("customer_id", activeUser.id);
			formData.append("content", messageContent.text || "");
			formData.append("channel_id", 2);
  
			dataToSend = formData;
		} else {
			url += "send-to-lead/";
		}
  
		axiosInstance
			.post(url, dataToSend, {
				headers: activeTab === "customers" ? { "Content-Type": "multipart/form-data" } : {},
			})
			.then((response) => {  
				setActiveUser((prevUser) => {
					const updatedMessages = prevUser.messages
						? [...prevUser.messages, {
							id: response.data.id,
							content: messageContent.text,
							content_type: "text",
							created_at: new Date().toISOString(),
							status: "SENT",
							user_sender: currentUser?.user_id,
							lead_receiver: activeUser.id,
						}]
						: [{
							id: response.data.id,
							content: messageContent.text,
							content_type: "text",
							created_at: new Date().toISOString(),
							status: "SENT",
							user_sender: currentUser?.user_id,
							lead_receiver: activeUser.id,
						}];
					
					return {
						...prevUser,
						messages: updatedMessages,
					};
				});
  
				setMessage("");
			})
			.catch((error) => {
				handleApiError(error);
			});
	};

	const handleInputChange = (e) => {
		setMessage(e.target.value);
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setActiveUser(null); // Reset active user when changing tabs
	};

	return (
		<div className="body-theme flex flex-col px-5 ">
			<div className="flex p-4 items-center justify-between w-full ">
				<h1 className="font-bold ">
					All Messages
				</h1>

				<div className="flex gap-4">
					<button 
						onClick={() => {router.push('/nativecrm/settings#channels-integration');}}
						className="bg-[#3EBF0F] text-white px-4 py-2 rounded-lg shadow-sm">
						+ Connect Channel
					</button>
					<div className="bg-gray-500 w-0.5 hidden"></div>
					<div className="hidden flex h-10 w-20 px-3 justify-center items-center gap-2 rounded-lg border border-[#DFE1E6] body-theme cursor-pointer shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path 
								d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z" 
								stroke="#808897" 
								strokeWidth="1.33333" 
								strokeLinecap="round" 
								strokeLinejoin="round"
							/>
						</svg>

						<p className=" text-[14px] font-medium leading-[150%] tracking-[0.2px]">
							Filter
						</p>
					</div>
				</div>
			</div>

			<div className="overflow-y-hidden overflow-x-hidden messages flex items-start border border-gray-500 rounded-lg relative h-[80vh] m-4 mt-0">
				<div>
					<div className="body-theme justify-center gap-5 p-5 flex items-start flex-col w-full">
						<div className="relative">
							<input
								className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
								placeholder="Search Users..."
								value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<button
								className="absolute top-1 right-1 flex items-center rounded body-theme py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow active:bg-gray-400 active:dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
								type="button"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
									<path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
								</svg>                                        
							</button> 
						</div>
						<div className="flex gap-3 w-full ">
							<div className="tab-atom">
								<div className={`px-4 pb-1 ${activeTab === 'leads' ? 'active' : ""}`} onClick={() => handleTabChange('leads')}>Leads</div>
							</div>
							<div className="tab-atom">
								<div className={`px-4 pb-1 ${activeTab === 'customers' ? 'active' : ""}`} onClick={() => handleTabChange('customers')}>Customers</div>
							</div>
						</div>
					</div>

					<ChatList users={users} activeUser={activeUser} setActiveUser={setActiveUser} />
				</div>
				
				<div className="detail ">
					{activeUser ? (
						<div>
							<ChatHeader activeUser={activeUser} />
							<div className="flex items-center ">
								<MessageList 
									chatHistory={chatHistory} 
									currentUserId={currentUser?.user_id} 
								/>

								<MessageInput
									message={message}
									onInputChange={handleInputChange}
									onSendMessage={handleSendMessage}
									audioRecordingEnabled
								/>
							</div>
						</div>
					) : (
						<div className="no-chat-selected">
							{activeTab === "leads" ? "Select a lead to chat with" : "Select a customer to chat with"}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
