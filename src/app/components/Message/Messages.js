import React, { useState, useEffect, useRef, Suspense } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatList from "./ChatList";
import { useApi } from "@/services/axiosConfig";
import { useError } from '@/context/ErrorContext';
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import "./style.css";
import { useAuth } from "@/context/AuthContext";

export const MessagesContent = () => {
	const { axiosInstance } = useApi();
	const { handleApiError } = useError();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [message, setMessage] = useState("");
	const [activeUser, setActiveUser] = useState(null);

	const [users, setUsers] = useState([]);
	const { company } = useAuth();
	const [chatHistory, setChatHistory] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

	const [page, setPage] = useState(1);
	const [next, setNext] = useState(null);	
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const [loading, setLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(true)
	const [chatResponse, setChatResponse] = useState();

	const [chatType, setChatType] = useState(searchParams.get("chat") || "leads");
	const chatId = searchParams.get("id");

	const menuRef = useRef(null);
	const buttonRef = useRef(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const [allChannels, setAllChannels] = useState([]);
	const [connectedChannels, setConnectedChannels] = useState([])
	const [selectedChannel, setSelectedChannel] = useState(null);

	const [cachedData, setCachedData] = useState({
        leads: { users: null, histories: {} },
        customers: { users: null, histories: {} },
        archived: { users: null, histories: {} }
    });

	const wsRef = useRef(null);
	const currentTabRef = useRef(chatType);
    const abortControllerRef = useRef(null);

	useEffect(() => {
        const newChatType = searchParams.get("chat") || "leads";
        setChatType(newChatType);
		currentTabRef.current = newChatType;

		if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Load cached data for the new tab if available
        if (cachedData[newChatType]?.users) {
            setUsers(cachedData[newChatType].users);
			setLoading(false);
        } else {
			setLoading(true);
		}
    }, [searchParams]);

	useEffect(() => {
		fetchChatList({ reset: true })
	}, [selectedChannel])

	useEffect(() => {
		fetchChatHistory();
	}, [activeUser]);

	useEffect(() => {
		if (chatId) {
			fetchChatHistory();
		}
	}, [chatType, chatId]);

	useEffect(() => {
		fetchChatList({ reset: true });
		setPage(1);
	}, [debouncedSearchQuery, chatType])

	useEffect(() => {
		if (!company?.id) return;
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const wsUrl = `${protocol}://ws-staging.nativetalkcrm.com/ws/chat/?uuid=${company?.id}&type=company`;

		const connectWebSocket = () => {
			if (wsRef.current) return;
	
			wsRef.current = new WebSocket(wsUrl);
	
			wsRef.current.onopen = () => {
				console.log("✅ WebSocket connected");
			};
	
			wsRef.current.onerror = (error) => {
				console.error("❌ WebSocket error:", error);
			};
	
			wsRef.current.onclose = () => {
				console.log("🔄 WebSocket disconnected, attempting to reconnect...");
				wsRef.current = null;
				setTimeout(connectWebSocket, 3000);
			};
		};
	
		connectWebSocket();
	
		return () => {
			console.log('returning')
			if (wsRef.current) {
				console.log("🔌 Closing WebSocket connection...");
				wsRef.current.close();
				wsRef.current = null;
			}
		};
		
	}, [company]);

	useEffect(() => {
		if (!wsRef.current) {
			console.log('message event returning')
			return;
		}

		wsRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);

			const message = data.message;
			const newUser = data.message.lead_sender_details;
			console.log("message ", message)

			if (
				activeUser &&
				(message.lead_sender === activeUser.id ||
				message.customer_sender === activeUser.id ||
				message.lead_info?.id === activeUser.id)
			) {
				console.log('new chat histroy found')
				const newHistory = [...chatHistory, message];
                setChatHistory(newHistory);
                setCachedData(prev => ({
                    ...prev,
                    [chatType]: {
                        ...prev[chatType],
                        histories: {
                            ...prev[chatType].histories,
                            [activeUser.id]: newHistory
                        }
                    }
                }));
			} else {	
				setUsers((prevUsers) => {
					const existingUsers = prevUsers?.results || [];
					const existingUserIndex = existingUsers.findIndex(user => user?.id === newUser?.id);
	
					let updatedUsers;
	
					if (existingUserIndex !== -1) {
						// If user already exists, remove them and move to top with updated details
						updatedUsers = [
							newUser, // Updated user
							...existingUsers.filter(user => user.id !== newUser.id)
						];
					} else {
						// If user is new, add them to the top of the list
						updatedUsers = [newUser, ...existingUsers];
					}
	
					return {
						...prevUsers,
						results: updatedUsers
					};
				});
	
				setCachedData(prev => ({
					...prev,
					[chatType]: {
						...prev[chatType],
						users: {
							...prev[chatType]?.users,
							results: [
								newUser,
								...(prev[chatType]?.users?.results || []).filter(user => user.id !== newUser.id)
							]
						}
					}
				}));
			}
		};
	}, [activeUser, chatHistory, chatType]);

	useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

	useEffect(() => {
		fetchChannelsData();
	  }, []);

	const fetchChatList = async ({ reset = false } = {}) => {
		let endpoint;
		const channelIdParam = selectedChannel ? `&channel_id=${selectedChannel.id}` : "";

		if (chatType === "customers") {
			endpoint = `/communication/chatted-customers/?search=${debouncedSearchQuery}${channelIdParam}`;
		  } else if (chatType === "leads") {
			endpoint = `/communication/contacts/?search=${debouncedSearchQuery}${channelIdParam}`;
		  } else if (chatType === "archived") {
			endpoint = `/communication/conversations/?status=ended&search=${debouncedSearchQuery}${channelIdParam}`;
		  }

		if (!endpoint) return;

		if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

		const requestChatType = chatType;
		
		try {
			if (!cachedData[chatType]?.users)
                setLoading(true);

            if (cachedData[chatType]?.users && !debouncedSearchQuery && !reset) {
                setUsers(cachedData[chatType].users);
            }

            const response = await axiosInstance.get(endpoint, {
                signal: abortControllerRef.current.signal
            });
			
			setLoading(false);

            // Only update state if we're still on the same tab
            if (currentTabRef.current === requestChatType) {
                setCachedData(prev => ({
                    ...prev,
                    [requestChatType]: {
                        ...prev[requestChatType],
                        users: reset
                        ? response.data
                        : {
                              ...response.data,
                              results: [
                                  ...(prev[requestChatType]?.users?.results || []),
                                  ...response.data.results,
                              ],
                          },
                    }
                }));

                setUsers((prevUsers) => ({
					...response.data,
					results: reset
						? response.data.results
						: [...(prevUsers?.results || []), ...response.data.results],
				}));

                setNext(response.data.next);

                const foundUser = response.data.results?.find(
                    (user) => user.id.toString() === chatId
                );
                if (foundUser) {
                    setActiveUser(foundUser);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                handleApiError(error);
            }
        }
	};

	const fetchChatHistory = async () => {
		if (!activeUser)
			return;

		if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

		const requestChatType = chatType;
        const requestUserId = activeUser.id;
		
		const cachedHistory = cachedData[chatType]?.histories[activeUser.id];
        if (cachedHistory) {
            setChatHistory(cachedHistory);
        }

		let endpoint;
		if (chatType === "customers") {
			endpoint = `/communication/customer-chat-history/${activeUser.id}`;
		} else if (chatType === "leads") {
			endpoint = `/communication/history/?lead_id=${activeUser.id}`;
		} else if (chatType === "archived") {
			endpoint = `/communication/conversations/${activeUser.id}/messages?status=ended`;
		}

		try {
			const response = await axiosInstance.get(endpoint, {
                signal: abortControllerRef.current.signal
            });

            if (currentTabRef.current === requestChatType && activeUser?.id === requestUserId) {
                const newHistory = response.data.results.reverse() || [];
                
                setCachedData(prev => ({
                    ...prev,
                    [requestChatType]: {
                        ...prev[requestChatType],
                        histories: {
                            ...prev[requestChatType].histories,
                            [requestUserId]: newHistory
                        }
                    }
                }));
                
                setChatHistory(newHistory);
				console.log('chat response is', response.data)
                setChatResponse(response.data);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                handleApiError(error);
            }
        }
	};

	const handleChatSelect = (user) => {
		setActiveUser(user);
		router.push(`/nativecrm/messages?chat=${chatType}&id=${user.id}`, { scroll: false });
	};

	const handleTabChange = (tab) => {
        // Cancel any ongoing requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        setActiveUser(null);
        setChatHistory(null);
        router.push(`/nativecrm/messages?chat=${tab}`, { scroll: false });
        
        // Update current tab reference
        currentTabRef.current = tab;
        
		if (!cachedData[tab]?.users) {
            setLoading(true);
        }

        // Load cached data for the new tab immediately
        if (cachedData[tab]?.users) {
            setUsers(cachedData[tab].users);
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
		if (chatType === "customers") {
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
				headers: chatType === "customers" ? { "Content-Type": "multipart/form-data" } : {},
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
							user_sender: activeUser?.user_id,
							lead_receiver: activeUser.id,
						}]
						: [{
							id: response.data.id,
							content: messageContent.text,
							content_type: "text",
							created_at: new Date().toISOString(),
							status: "SENT",
							user_sender: activeUser?.user_id,
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

	const fetchChannelsData = async () => {
		try {
		  const allChannelsResponse = await axiosInstance.get("/channels/all/");
		  setAllChannels(allChannelsResponse.data.channels);
	
		  const connectedChannelsResponse = await axiosInstance.get("/channels/connected-channels/");
		  setConnectedChannels(connectedChannelsResponse.data.connected_channels);
		} catch (error) {
		  handleApiError(error)
		}
	};

	const channelsMenuItems = [
		{
		  label: "All",
		  onClick: () => {
			setSelectedChannel(null);
		  },
		},
		...connectedChannels
		  .map((connectedChannel) => {
			const channelInfo = allChannels.find(channel => channel.id === connectedChannel.id);
			return channelInfo ? {
			  label: channelInfo.name,
			  onClick: () => {
				setSelectedChannel({ id: channelInfo.id, name: channelInfo.name });
			  },
			} : null;
		  })
		  .filter(Boolean), // Removes null entries
	];

	const loadMoreUsers = async () => {
		if (isFetchingMore || !next) return;
	  
		const endpointMap = {
			leads: `/communication/contacts/?page=${page}&page_size=${15}`,
			customers: `/communication/chatted-customers/?page=${page}&page_size=${15}`,
			archived: `/communication/conversations/?page=${page}&page_size=${15}`,
		};

		const endpoint = next || endpointMap[chatType];
		if (!endpoint) return;
		setIsFetchingMore(true);
	  
		try {
			const { data } = await axiosInstance.get(endpoint, { showLoader: false });
			const newContacts = data.results;
			setNext(data.next);

			setUsers((prevUsers) => {
				const currentResults = Array.isArray(prevUsers?.results) ? prevUsers.results : [];
				const mergedResults = [
					...currentResults,
					...newContacts.filter(
						(user) => !currentResults.some((existingUser) => existingUser.id === user.id)
					),
				];
	
				return { ...data, results: mergedResults };
			});

			setCachedData((prev) => ({
				...prev,
				[chatType]: {
					...prev[chatType],
					users: {
						...data,
						results: [
							...(prev[chatType]?.users?.results || []),
							...newContacts.filter(
								(user) =>
									!(prev[chatType]?.users?.results || []).some(
										(existingUser) => existingUser.id === user.id
									)
							),
						],
					},
				},
			}));
			
			setPage((prevPage) => prevPage + 1);
		} catch (error) {
		  handleApiError(error);
		} finally {
		  setIsFetchingMore(false);
		}
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
					<div 
						className=" flex h-10 min-w-20 px-3 justify-center items-center gap-2 rounded-lg border border-[#DFE1E6] body-theme cursor-pointer shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]"
						ref={buttonRef}
						onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
								{selectedChannel ? selectedChannel.name : "Filter"}
							</p>
					</div>
					{isMenuOpen && (
						<div
						ref={menuRef}
						className="absolute right-0 mt-12 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
						>
						<div className="py-1">
							{(channelsMenuItems).map((item, index) => (
							<button
								key={index}
								onClick={() => {
								item.onClick();
								setIsMenuOpen(false);
								}}
								className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							>
								{item.label}
							</button>
							))}
						</div>
					</div>
					)}
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
								<div className={`px-3 pb-1 ${chatType === 'leads' ? 'active' : ""}`} onClick={() => handleTabChange('leads')}>Leads</div>
							</div>
							<div className="tab-atom">
								<div className={`px-3 pb-1 ${chatType === 'customers' ? 'active' : ""}`} onClick={() => handleTabChange('customers')}>Customers</div>
							</div>
							<div className="tab-atom">
								<div className={`px-3 pb-1 ${chatType === 'archived' ? 'active' : ""}`} onClick={() => handleTabChange('archived')}>Archived</div>
							</div>
						</div>
					</div>

					<ChatList 
						users={users} 
						activeUser={activeUser} 
						handleChatSelect={handleChatSelect}
						loadMoreUsers={loadMoreUsers}
						loading={loading}
					/>
					{isFetchingMore && (
						<div className="flex justify-center py-4">
							<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gray-400"></div>
						</div>
					)}
				</div>
				
				<div className="detail ">
					{activeUser ? (
						<div>
							<ChatHeader activeUser={activeUser} conversationId={chatResponse?.conversation_id} isLead={chatType === "leads"}/>
							<div className="flex items-center ">
								<MessageList 
									chatHistory={chatHistory} 
								/>


								{chatType != "archived" ? ( 
									<MessageInput
										message={message}
										onInputChange={(e) => setMessage(e.target.value)}
										onSendMessage={handleSendMessage}
										audioRecordingEnabled
									/>
								): (
									<h2 className="w-full absolute bottom-5 flex items-center justify-center fw-bold text-red-300 p-2">Chat ended</h2>
									)
								}	
							</div>
						</div>
					) : (
						<div className="no-chat-selected">
							{chatType === "leads" && 
								"Select a lead to chat with" 
							}
							{chatType === "customers" && 
								"Select a customer to chat with" 
							}
							{chatType === "archived" && 
								"Select a chat to view it's history" 
							}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};


export const Messages = () => {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
			</div>
		}>
			<MessagesContent />
		</Suspense>
	);
  };