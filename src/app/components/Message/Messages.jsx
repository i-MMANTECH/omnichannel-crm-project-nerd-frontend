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
import UserAvatar from "../UserAvatar";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import TicketListPanel from "../Ticket/TicketsPanel";
import ExportModal from "../ExportModal";
import { Download } from "lucide-react";
import Modal from "../Modal";
import CreateTicketModal from "../Ticket/CreateTicketModal";
import useWebSocket from "@/context/useWebsocket";
import getBaseRoute from "@/utils/getBaseRoute";
import {
	deleteFailedMessageRecord,
	getFailedMessageRecords,
	saveFailedMessageRecord,
} from "@/utils/failedMessagesStore";

// --- GLOBAL CACHE START ---
// These persist across Next.js component unmounts but reset on hard refresh.
let globalChatCache = {
	leads: { users: null, histories: {} },
	customers: { users: null, histories: {} },
	internal: { users: null, histories: {} },
	archived: { users: null, histories: {} },
};

let globalPaginationCache = {
	leads: { pageUsers: 1, nextUsers: null },
	customers: { pageUsers: 1, nextUsers: null },
	internal: { pageUsers: 1, nextUsers: null },
	archived: { pageUsers: 1, nextUsers: null },
};

let globalMessagePaginationCache = {};
// --- GLOBAL CACHE END ---

const getFailedMessageChatKey = (chatType, userId) => `${chatType}:${userId}`;

const TEMP_MESSAGE_RECOVERABLE_STATUSES = new Set(["sending", "failed"]);

const getTimestampMs = (value) => {
	if (!value) return null;
	const date = new Date(value);
	const ms = date.getTime();
	return Number.isFinite(ms) ? ms : null;
};

const isTempMessageId = (value) => typeof value === "string" && value.startsWith("temp-");

const isRecoverableTempMessage = (message) =>
	isTempMessageId(message?.id) &&
	TEMP_MESSAGE_RECOVERABLE_STATUSES.has((message?.status || "").toLowerCase());

const isLikelySameOutgoingMessage = (tempMessage, incomingMessage, options = {}) => {
	const { requireCompanySender = false, currentUserId = null } = options;

	if (!tempMessage || !incomingMessage) return false;
	if (isTempMessageId(incomingMessage?.id)) return false;

	const tempContent = String(tempMessage?.content || "").trim();
	const incomingContent = String(incomingMessage?.content || "").trim();
	if (tempContent !== incomingContent) return false;

	const tempSubject = String(tempMessage?.subject || "").trim();
	const incomingSubject = String(incomingMessage?.subject || "").trim();
	if ((tempSubject || incomingSubject) && tempSubject !== incomingSubject) return false;

	if (
		tempMessage?.content_type &&
		incomingMessage?.content_type &&
		tempMessage.content_type !== incomingMessage.content_type
	) {
		return false;
	}

	const tempChannelId = tempMessage?.channel?.id;
	const incomingChannelId = incomingMessage?.channel?.id;
	if (
		tempChannelId != null &&
		incomingChannelId != null &&
		String(tempChannelId) !== String(incomingChannelId)
	) {
		return false;
	}

	if (requireCompanySender && !tempMessage?.company_is_sender) {
		return false;
	}

	if (currentUserId != null && incomingMessage?.sender?.id != null) {
		if (String(incomingMessage.sender.id) !== String(currentUserId)) {
			return false;
		}
	}

	const tempCreatedAt = getTimestampMs(tempMessage?.created_at);
	const incomingCreatedAt = getTimestampMs(incomingMessage?.created_at);
	if (tempCreatedAt != null && incomingCreatedAt != null) {
		const maxDriftMs = 10 * 60 * 1000; // 10 minutes
		if (Math.abs(tempCreatedAt - incomingCreatedAt) > maxDriftMs) {
			return false;
		}
	}

	return true;
};

const findRecoverableTempMatchIndex = (messages = [], incomingMessage, options = {}) =>
	messages.findIndex(
		(message) =>
			isRecoverableTempMessage(message) &&
			isLikelySameOutgoingMessage(message, incomingMessage, options)
	);

const mergeFailedMessagesIntoHistory = (history = [], failedRecords = []) => {
	const merged = [...history];
	const existingIds = new Set(history.map((message) => String(message.id)));

	failedRecords.forEach((record) => {
		const failedMessage = {
			...record.message,
			status: record.message?.status === "sending" ? "failed" : record.message?.status || "failed",
		};

		if (!existingIds.has(String(failedMessage.id))) {
			merged.push(failedMessage);
			existingIds.add(String(failedMessage.id));
		}
	});

	return merged.sort(
		(a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
	);
};

const normalizeInternalChat = (chat, myUserId) => {
	// chat.other_member exists in your POST response, and is usually returned on list too
	const other = chat.other_member;

	const displayName =
		chat.name ||
		(other
			? `${other.first_name || ""} ${other.last_name || ""}`.trim() || other.email
			: "Internal chat");

	return {
		// ChatList relies on user.id
		id: chat.id,

		// ChatList renders name from several fallbacks — we’ll set "name"
		name: displayName,

		// ChatList expects "image" for avatar
		image: other?.image || null,

		// ChatList expects lastMessage / lastMessageTime / unreadCount
		lastMessage: chat.last_message?.content || chat.last_message || "",
		lastMessageTime: chat.last_message_at,
		unreadCount: chat.unread_count || 0,

		// helpful flags
		_internal: true,
		other_member: other || null,

		// keep raw in case you need later
		_raw: chat,
	};
};

const getMessageType = (message) => {
	if (message.lead_sender != null || message.lead_receiver != null) {
		return "leads";
	}
	if (message.customer_sender != null || message.customer_receiver != null) {
		return "customers";
	}
	return null;
};

export const MessagesContent = () => {
	const { axiosInstance } = useApi();
	const { handleApiError } = useError();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [activeUser, setActiveUser] = useState(null);

	const [users, setUsers] = useState([]);
	const { company, user } = useAuth();
	const baseRoute = getBaseRoute(user?.roles);
	const [chatHistory, setChatHistory] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

	const [page, setPage] = useState(1);
	const [next, setNext] = useState(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const [pageUsers, setPageUsers] = useState(1);
	const [nextUsers, setNextUsers] = useState(null);
	const [isFetchingMoreUsers, setIsFetchingMoreUsers] = useState(false);

	const [pageMessages, setPageMessages] = useState(1);
	const [nextMessages, setNextMessages] = useState(null);
	const [isFetchingMoreMessages, setIsFetchingMoreMessages] = useState(false);

	const [isScrolledUp, setIsScrolledUp] = useState(false);


	const [loading, setLoading] = useState(true);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const [chatResponse, setChatResponse] = useState();

	const [chatType, setChatType] = useState(searchParams.get("chat") || "leads");
	const chatId = searchParams.get("id");

	const menuRef = useRef(null);
	const buttonRef = useRef(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const [allChannels, setAllChannels] = useState([]);
	const [connectedChannels, setConnectedChannels] = useState([])
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [isRotating, setIsRotating] = useState(false);
	const [agents, setAgents] = useState([])
	const [selectedAgent, setSelectedAgent] = useState(null)

	const [activeAgent, setActiveAgent] = useState(null)
	const [userProfile, setUserProfile] = useState({})

	const [showAiTakeoverPrompt, setShowAiTakeoverPrompt] = useState(false);
	const [refreshChatHeader, setRefreshChatHeader] = useState(false)

	const [inputIsEmailMode, setInputIsEmailMode] = useState(false);
	const [inputBottomOffset, setInputBottomOffset] = useState(0);

	const [tabUnreadFlags, setTabUnreadFlags] = useState({
		leads: false,
		customers: false,
		internal: false,
		archived: false
	});

	const [isFilterActive, setIsFilterActive] = useState(false)

	// Ticketing states
	const [showTicketPanel, setShowTicketPanel] = useState(false);
	const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);

	// Suggested customer linking
	const [suggestedCustomer, setSuggestedCustomer] = useState(null);
	const [isLinkingCustomer, setIsLinkingCustomer] = useState(false);

	const isCancelError = (error) =>
		error?.name === 'CanceledError' || error?.message === 'canceled' || error?.code === 'ERR_CANCELED';

	// Initialize cachedData from the global module-level cache
	const [cachedData, setCachedData] = useState(() => globalChatCache);

	// Sync local cachedData back to globalChatCache whenever it changes
	useEffect(() => {
		globalChatCache = cachedData;
	}, [cachedData]);

	const currentTabRef = useRef(chatType);
	const abortControllerRef = useRef(null);
	const isFetchingMoreUsersRef = useRef(false);
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);

	const [showInternalModal, setShowInternalModal] = useState(false);
	const [internalUserSearch, setInternalUserSearch] = useState("");

	const loadFailedMessagesForChat = async (type, userId, baseHistory = []) => {
		if (!userId) {
			return baseHistory;
		}

		const failedRecords = await getFailedMessageRecords(getFailedMessageChatKey(type, userId));
		const recordsToMerge = [];
		const resolvedRecordIds = [];

		failedRecords.forEach((record) => {
			const failedMessage = record?.message;
			const hasServerEquivalent = baseHistory.some((historyMessage) =>
				isLikelySameOutgoingMessage(failedMessage, historyMessage, {
					requireCompanySender: type !== "internal",
					currentUserId: type === "internal" ? userProfile?.id : null,
				})
			);

			if (hasServerEquivalent) {
				resolvedRecordIds.push(record.id);
				return;
			}

			recordsToMerge.push(record);
		});

		if (resolvedRecordIds.length > 0) {
			await Promise.all(
				resolvedRecordIds.map((recordId) =>
					deleteFailedMessageRecord(recordId).catch(() => undefined)
				)
			);
		}

		return mergeFailedMessagesIntoHistory(baseHistory, recordsToMerge);
	};

	const persistFailedMessage = async (record) => {
		await saveFailedMessageRecord(record);
	};

	const removePersistedFailedMessage = async (messageId) => {
		await deleteFailedMessageRecord(messageId);
	};


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
			setPageUsers(globalPaginationCache[newChatType].pageUsers);
			setNextUsers(globalPaginationCache[newChatType].nextUsers);
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

	useEffect(() => { setIsScrolledUp(false); }, [activeUser?.id]);

	useEffect(() => {
		if (chatType !== "leads" || !activeUser?.id) {
			setSuggestedCustomer(null);
			return;
		}
		const fetchSuggestedCustomer = async () => {
			try {
				const { data } = await axiosInstance.get(`/customers/leads/${activeUser.id}`, { showLoader: false });
				setSuggestedCustomer(data?.lead?.suggested_customer || null);
			} catch {
				setSuggestedCustomer(null);
			}
		};
		fetchSuggestedCustomer();
	}, [activeUser?.id, chatType]);

	useEffect(() => {
		if (chatId) {
			fetchChatHistory();
		}
	}, [chatType, chatId]);

	useEffect(() => {
		fetchChatList({ reset: true });
		setPage(1);
	}, [debouncedSearchQuery, chatType, selectedAgent])

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const resp = await axiosInstance.get(`/users/me`)
				setUserProfile(resp?.data?.user)
			}
			catch (error) {
				if (isCancelError(error)) {
					// console.log('cr');
				} else {
					handleApiError(error);
				}
			}

		}

		fetchUserProfile()
	}, []);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef?.current?.abort();
			}
		};
	}, []);

	useEffect(() => {
		fetchAgents()
		fetchChannelsData();
	}, []);

	const handleInternalWsMessage = (data) => {
		// Expect: { type: "...", message: {...} } (or sometimes message is the data itself)
		const msg =
			(data?.data && typeof data.data === "object" ? data.data : null) ||
			(data?.message && typeof data.message === "object" ? data.message : null) ||
			data;

		// Try to locate the chat id in a flexible way
		const incomingChatId =
			data?.chat_id ||
			msg?.chat_id ||
			msg?.chat?.id ||
			msg?.chat ||
			msg?.thread_id ||
			msg?.room_id;

		const normalizedMsg = {
			...msg,
			// help MessageList identify who sent it
			user_sender: msg?.sender?.id,
			user_sender_details: msg?.sender,
			company_is_sender: false,
			is_internal: true,
		};


		// console.log("resolved", { incomingChatId, activeChatId: activeUser?.id, msgId: msg?.id });

		if (!incomingChatId || !msg?.id) return;

		// set unread dot on Internal tab when user isn't currently there
		if (currentTabRef.current !== "internal") {
			setTabUnreadFlags((prev) => ({ ...prev, internal: true }));
		}

		// If user is currently viewing that internal chat, append it
		const isViewingThisInternalChat =
			currentTabRef.current === "internal" &&
			activeUser?.id &&
			String(activeUser.id) === String(incomingChatId);

		if (isViewingThisInternalChat) {
			let matchedTempId = null;
			setChatHistory((prev) => {
				const exists = prev.some((m) => String(m.id) === String(msg.id));
				if (exists) return prev;

				// temp replacement (optional)
				const tempIndex = findRecoverableTempMatchIndex(prev, msg, {
					currentUserId: userProfile?.id,
				});
				if (tempIndex !== -1) {
					const copy = [...prev];
					matchedTempId = copy[tempIndex]?.id;
					copy[tempIndex] = msg;
					return copy;
				}

				return [...prev, msg];
			});

			if (matchedTempId) {
				removePersistedFailedMessage(matchedTempId).catch(() => undefined);
			}
		}

		// Update internal cache always
		setCachedData((prev) => {
			const existing = prev.internal?.histories?.[incomingChatId] || [];
			const already = existing.some((m) => String(m.id) === String(msg.id));
			const updatedHistory = already ? existing : [...existing, msg];

			return {
				...prev,
				internal: {
					...prev.internal,
					histories: {
						...(prev.internal?.histories || {}),
						[incomingChatId]: updatedHistory,
					},
				},
			};
		});

		// Update left list preview (move chat to top) if internal list is loaded
		setCachedData((prev) => {
			const list = prev.internal?.users?.results || [];
			if (!list.length) return prev;

			const idx = list.findIndex((c) => String(c.id) === String(incomingChatId));
			if (idx === -1) return prev;

			const updatedItem = {
				...list[idx],
				lastMessage: msg.content || "",
				lastMessageTime: msg.created_at,
				unreadCount: (list[idx].unreadCount || 0) + 1,
			};

			const moved = [updatedItem, ...list.filter((x) => String(x.id) !== String(incomingChatId))];

			return {
				...prev,
				internal: {
					...prev.internal,
					users: {
						...(prev.internal?.users || {}),
						results: moved,
					},
				},
			};
		});

		// If currently on internal tab, also reflect list update in `users` state
		if (currentTabRef.current === "internal") {
			setUsers((prev) => {
				const current = prev?.results || [];
				const idx = current.findIndex((c) => String(c.id) === String(incomingChatId));
				if (idx === -1) return prev;

				const updatedItem = {
					...current[idx],
					lastMessage: msg.content || "",
					lastMessageTime: msg.created_at,
					unreadCount: (current[idx].unreadCount || 0) + 1,
				};

				const moved = [updatedItem, ...current.filter((x) => String(x.id) !== String(incomingChatId))];
				return { ...(prev || {}), results: moved };
			});
		}
	};

	const wsUrl = company?.id
		? `${window.location.protocol === "https:" ? "wss" : "ws"}://${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/chat/?uuid=${company?.id}&type=company`
		: null;

	const { wsRef: companyWsRef, reconnect: reconnectCompanyWs } = useWebSocket(
		wsUrl,
		(data) => {
			// ✅ your existing handler body 그대로
			// console.log("📬 Processing WebSocket data:", { type: data.type });

			if (data.type === "message_status") {
				const updatedMessage = data.message;

				setChatHistory((prevHistory) =>
					prevHistory.map((msg) =>
						msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
					)
				);

				if (!activeUser || !activeUser.id) return;

				setCachedData((prev) => {
					const statusTab = currentTabRef.current; // safest
					const current = prev[statusTab]?.histories?.[activeUser?.id] || [];

					const updatedHistory = current.map((msg) =>
						msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
					);

					return {
						...prev,
						[statusTab]: {
							...prev[statusTab],
							histories: {
								...prev[statusTab].histories,
								[activeUser.id]: updatedHistory,
							},
						},
					};
				});

				return;
			}

			const message = data.message;

			if (message?.is_system_message) {
				if (activeUser && message.conversation === chatResponse?.conversation_id) {
					setChatHistory((prevHistory) => {
						const alreadyExists = prevHistory.some((msg) => msg.id === message.id);
						if (alreadyExists) return prevHistory;
						return [...prevHistory, message];
					});

					setCachedData((prev) => {
						const existing = prev[chatType]?.histories[activeUser.id] || [];
						const messageExists = existing.some((msg) => msg.id === message.id);
						if (messageExists) return prev;

						return {
							...prev,
							[chatType]: {
								...prev[chatType],
								histories: {
									...prev[chatType].histories,
									[activeUser.id]: [...existing, message],
								},
							},
						};
					});
				}
				return;
			}

			const isLeadMessage =
				message?.lead_sender != null || message?.lead_receiver != null;
			const isCustomerMessage =
				message?.customer_sender != null || message?.customer_receiver != null;

			const newUser = isLeadMessage
				? (message.lead_sender_details || message.lead_receiver_details)
				: isCustomerMessage
					? (message.customer_sender_details || message.customer_receiver_details)
					: null;

			const messageChatType = getMessageType(message);

			if (currentTabRef.current !== messageChatType) {
				setTabUnreadFlags((prev) => ({
					...prev,
					[messageChatType]: true,
				}));
			}

			const isRelevantToActiveUser =
				activeUser &&
				((message?.is_system_message &&
					message.conversation === chatResponse?.conversation_id) ||
					(isLeadMessage &&
						(message.lead_sender === activeUser.id ||
							message.lead_receiver === activeUser.id ||
							message.lead_info?.id === activeUser.id)) ||
					(isCustomerMessage &&
						(message.customer_sender === activeUser.id ||
							message.customer_receiver === activeUser.id)));

			if (currentTabRef.current === messageChatType && isRelevantToActiveUser) {
				if (!message.is_system_message) {
					markConversationAsRead(activeUser.id);
				}

				let matchedTempId = null;
				setChatHistory((prevHistory) => {
					const alreadyExists = prevHistory.some((msg) => msg.id === message.id);

					const tempMatchIndex = findRecoverableTempMatchIndex(prevHistory, message, {
						requireCompanySender: true,
					});

					if (alreadyExists) return prevHistory;

					if (tempMatchIndex !== -1) {
						const newHistory = [...prevHistory];
						matchedTempId = newHistory[tempMatchIndex]?.id;
						newHistory[tempMatchIndex] = message;
						return newHistory;
					}

					return [...prevHistory, message];
				});

				if (matchedTempId) {
					removePersistedFailedMessage(matchedTempId).catch(() => undefined);
				}

				if (!activeUser || !activeUser.id) return;

				setCachedData((prev) => {
					const existing = prev[messageChatType]?.histories[activeUser.id] || [];
					const messageExists = existing.some((msg) => msg.id === message.id);

					if (messageExists) return prev;

					const tempMatchIndex = findRecoverableTempMatchIndex(existing, message, {
						requireCompanySender: true,
					});

					let updatedHistory = [...existing];
					if (tempMatchIndex !== -1) {
						updatedHistory[tempMatchIndex] = message;
					} else {
						updatedHistory.push(message);
					}

					return {
						...prev,
						[messageChatType]: {
							...prev[messageChatType],
							histories: {
								...prev[messageChatType].histories,
								[activeUser.id]: updatedHistory,
							},
						},
					};
				});
			}

			if (newUser && currentTabRef.current === messageChatType) {
				setUsers((prevUsers) => {
					const existingUsers = prevUsers?.results || [];
					const updatedUsers = [
						newUser,
						...existingUsers.filter((user) => user.id !== newUser.id),
					];
					return {
						...prevUsers,
						results: updatedUsers,
					};
				});

				setCachedData((prev) => {
					const existing = prev[messageChatType]?.users?.results || [];
					const updated = [
						newUser,
						...existing.filter((user) => user.id !== newUser.id),
					];

					return {
						...prev,
						[messageChatType]: {
							...prev[messageChatType],
							users: {
								...prev[messageChatType].users,
								results: updated,
							},
						},
					};
				});
			}
		},
		{
			onOpen: () => console.log("✅ Company WS connected"),
			onClose: (event) => console.log("🔌 Company WS closed:", event.code),
			onError: (error) => console.error("❌ Company WS error:", error),
			reconnectDelay: 2000,
			shouldReconnect: true,
		}
	);

	const internalWsUrl = userProfile?.id
		? `${window.location.protocol === "https:" ? "wss" : "ws"}://${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/internal-chat/?agent_uuid=${userProfile.id}`
		: null;

	const { wsRef: internalWsRef, reconnect: reconnectInternalWs } = useWebSocket(
		internalWsUrl,
		handleInternalWsMessage,
		{ shouldReconnect: true, reconnectDelay: 2000 }
	);


	const handleExport = async (startDate, endDate) => {
		try {
			const params = new URLSearchParams();
			params.append('start_date', startDate);
			params.append('end_date', endDate);

			const response = await axiosInstance.get(`/communication/conversations/export/?${params.toString()}`, {
				responseType: 'blob',
			});

			// Create a blob from the CSV data
			const blob = new Blob([response.data], { type: 'text/csv' });

			// Create a download link and trigger it
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `messages_export_${startDate}_to_${endDate}.csv`);
			document.body.appendChild(link);
			link.click();

			// Clean up
			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);

		} catch (err) {
			handleApiError(err);
			throw err;
		}
	};


	const fetchAiStatus = async (conversationId) => {
		if (chatType === "archived") {
			return;
		}

		if (conversationId) {
			try {
				// Global AI Settings Check
				const globalAiRes = await axiosInstance.get('/companies/ai/settings/', { showLoader: false });
				const isGlobalAiEnabled = globalAiRes?.data?.data?.ai_enabled;

				if (!isGlobalAiEnabled) {
					return; // Do not show prompt or fetch conversation AI status if globally disabled
				}

				const res = await axiosInstance.get(`/communication/conversations/${conversationId}/ai-status/`, {
					showLoader: false
				});

				const aiIsActive = res?.data?.data?.ai_is_active;
				const aiPromptKey = `ai_prompt_dismissed_${conversationId}`;
				const dismissed = sessionStorage.getItem(aiPromptKey) === 'true';

				if (aiIsActive && !dismissed) {
					setShowAiTakeoverPrompt(true);
				}
			} catch (err) {
				handleApiError(err, "Failed to fetch AI status");
			}
		}
	};

	const markConversationAsRead = async () => {
		if (chatResponse) {
			try {
				const resp = await axiosInstance.patch(`/communication/conversations/${chatResponse?.conversation_id}/messages/status/`,
					{ 'status': 'read' },
					{ showLoader: false });

				const userIndex = users?.results?.findIndex((user) => user.id === activeUser.id);

				if (userIndex !== -1) {
					const currentUnreadCount = users.results[userIndex].unreadCount || 0;
					// const updatedCount = currentUnreadCount - (resp?.data?.data?.updated_count || 0);
					const updatedCount = 0

					const updatedUser = { ...users.results[userIndex], unreadCount: updatedCount };
					const updatedUsersResults = [
						...users.results.slice(0, userIndex),
						updatedUser,
						...users.results.slice(userIndex + 1),
					];

					const updatedUsers = { ...users, results: updatedUsersResults };
					setUsers(updatedUsers);

					setCachedData((prevCachedData) => {
						const cachedUsers = prevCachedData[chatType]?.users;
						if (cachedUsers) {
							const cachedUserIndex = cachedUsers.results.findIndex(
								(user) => user.id === activeUser.id
							);

							if (cachedUserIndex !== -1) {
								// Update the user in the cached data
								const updatedCachedUser = {
									...cachedUsers.results[cachedUserIndex],
									unreadCount: updatedCount,
								};

								const updatedCachedResults = [
									...cachedUsers.results.slice(0, cachedUserIndex),
									updatedCachedUser,
									...cachedUsers.results.slice(cachedUserIndex + 1),
								];

								return {
									...prevCachedData,
									[chatType]: {
										...prevCachedData[chatType],
										users: {
											...cachedUsers,
											results: updatedCachedResults,
										},
									},
								};
							}
						}

						// If no cached data is found, return the previous state
						return prevCachedData;
					})
				}
			}
			catch (error) {
				if (isCancelError(error)) {
					// console.log('cr');
				} else {
					handleApiError(error);
				}
			}
		}
	}

	const fetchChatList = async ({ reset = false } = {}) => {
		let endpoint;
		if (chatType === "internal") {
			endpoint = `/internal-messaging/chats/`;
		} else {
			const channelIdParam = selectedChannel ? `&channel_id=${selectedChannel.id}` : "";
			const assigneeParam = selectedAgent ? `&assignee=${selectedAgent}` : "";

			if (chatType === "customers") {
				endpoint = `/communication/chatted-customers/?search=${debouncedSearchQuery}${channelIdParam}${assigneeParam}`;
			} else if (chatType === "leads") {
				endpoint = `/communication/contacts/?search=${debouncedSearchQuery}${channelIdParam}${assigneeParam}`;
			} else if (chatType === "archived") {
				endpoint = `/communication/conversations/?status=ended&search=${debouncedSearchQuery}${channelIdParam}${assigneeParam}`;
			}
		}

		if (!endpoint) return;

		setIsRotating(true);

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
				signal: abortControllerRef.current.signal,
				showLoader: false
			});

			setLoading(false);

			if (requestChatType === "internal") {
				const chats = response?.data?.chats || response?.data?.results || response?.data || [];
				const normalized = chats
					.map((c) => normalizeInternalChat(c, userProfile?.id))
					// optional: client-side search if API doesn’t support it
					.filter((c) =>
						!debouncedSearchQuery
							? true
							: (c.name || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase())
					);

				const shaped = { results: normalized, next: null };

				setCachedData((prev) => ({
					...prev,
					internal: { ...prev.internal, users: shaped },
				}));

				setUsers(shaped);

				// open chat from URL: ?chat=internal&id=1
				const found = normalized.find((c) => c.id.toString() === chatId);
				if (found) setActiveUser(found);

				setNext(null);
				return;
			}

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
									...response.data.results.filter(
										u => !(prev[requestChatType]?.users?.results || []).some(e => e.id === u.id)
									),
								],
							},
					}
				}));

				setUsers((prevUsers) => ({
					...response.data,
					results: reset
						? response.data.results
						: [
							...(prevUsers?.results || []),
							...response.data.results.filter(
								u => !(prevUsers?.results || []).some(e => e.id === u.id)
							),
						],
				}));

				setNextUsers(response.data.next);

				// Sync pagination to global cache
				globalPaginationCache[requestChatType] = {
					pageUsers: reset ? 2 : pageUsers + 1,
					nextUsers: response.data.next
				};
				if (reset) {
					setPageUsers(1);
				}

				const foundUser = response.data.results?.find(
					(user) => user.id.toString() === chatId
				);
				if (foundUser) {
					setActiveUser(foundUser);
				}
			}
		}
		catch (error) {
			if (isCancelError(error)) {
				// console.log('cr');
			} else {
				handleApiError(error);
			}
		}
		finally {
			setIsRotating(false);
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
			const mergedCachedHistory = await loadFailedMessagesForChat(chatType, activeUser.id, cachedHistory);
			setChatHistory(mergedCachedHistory);
			// Restore message pagination from global cache
			if (globalMessagePaginationCache[activeUser.id]) {
				setPageMessages(globalMessagePaginationCache[activeUser.id].pageMessages);
				setNextMessages(globalMessagePaginationCache[activeUser.id].nextMessages);
			}
			setIsLoadingHistory(false);
		} else {
			setIsLoadingHistory(true);
		}

		// Always fetch page 1 on initial load — reset any stale pagination state
		globalMessagePaginationCache[activeUser.id] = null;
		setPageMessages(1);

		let endpoint;
		if (chatType === "internal") {
			endpoint = `/internal-messaging/chats/${activeUser.id}/messages/`;
		} else if (chatType === "customers") {
			endpoint = `/communication/customer-chat-history/${activeUser.id}?page=1`;
		} else if (chatType === "leads") {
			endpoint = `/communication/history/?lead_id=${activeUser.id}&page=1`;
		} else if (chatType === "archived") {
			endpoint = `/communication/conversations/${activeUser.id}/messages?status=ended&page=1`;
		}

		try {
			const response = await axiosInstance.get(endpoint, {
				signal: abortControllerRef.current.signal
			});

			setNextMessages(response.data.next);

			// Update global message pagination cache — reset to page 1
			globalMessagePaginationCache[activeUser.id] = {
				pageMessages: 1,
				nextMessages: response.data.next
			};

			if (currentTabRef.current === requestChatType && activeUser?.id === requestUserId) {
				if (requestChatType === "internal") {
					const msgs = response?.data?.messages || [];
					const newHistory = await loadFailedMessagesForChat(
						requestChatType,
						requestUserId,
						msgs.slice().reverse()
					);

					setCachedData((prev) => ({
						...prev,
						internal: {
							...prev.internal,
							histories: { ...prev.internal.histories, [requestUserId]: newHistory },
						},
					}));

					setChatHistory(newHistory);
					setChatResponse({ chat_id: requestUserId });
					return;
				}

				const newHistory = await loadFailedMessagesForChat(
					requestChatType,
					requestUserId,
					response.data.results.reverse() || []
				);

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
				setChatResponse(response.data);

				markConversationAsRead()
			}

			fetchAiStatus(response?.data?.results[0]?.conversation)
		}
		catch (error) {
			if (isCancelError(error)) {
				// console.log('cr');
			} else {
				handleApiError(error);
			}
		} finally {
			setIsLoadingHistory(false);
		}
	};

	const fetchAgents = async () => {
		try {
			const { data } = await axiosInstance.get(`/users`);
			setAgents(data.results || []);
		}
		catch (error) {
			if (isCancelError(error)) {
				console.log('cr');
			} else {
				handleApiError(error);
			}
		}
	};

	const handleAssigneeClick = (agentId) => {
		if (selectedAgent === agentId) {
			setSelectedAgent(null);
			setIsFilterActive(false);
			fetchChatList({ reset: true });
		} else {
			setSelectedAgent(agentId);
			setIsFilterActive(true);
			fetchChatList({ reset: true });
		}
	};

	const clearFilter = () => {
		setSelectedAgent(null);
		setIsFilterActive(false);
		fetchChatList({ reset: true });
	};

	const handleChatSelect = (user) => {
		if (activeUser?.id !== user.id) {
			setChatHistory([]);
		}
		setActiveUser(user);
		setIsScrolledUp(false);
		setPageMessages(1);
		router.push(`${baseRoute}/messages?chat=${currentTabRef.current}&id=${user.id}`, { scroll: false });
	};

	const handleLeadCategoryUpdated = ({ leadId, categories }) => {
		if (!leadId) return;
		const nextCategories = Array.isArray(categories) ? categories : [];

		setActiveUser((prev) =>
			String(prev?.id) === String(leadId)
				? { ...prev, categories: nextCategories }
				: prev
		);

		setUsers((prevUsers) => {
			if (!prevUsers?.results) return prevUsers;
			return {
				...prevUsers,
				results: prevUsers.results.map((chatUser) =>
					String(chatUser.id) === String(leadId)
						? { ...chatUser, categories: nextCategories }
						: chatUser
				),
			};
		});

		setCachedData((prev) => {
			const leadUsers = prev?.leads?.users;
			if (!leadUsers?.results) return prev;

			return {
				...prev,
				leads: {
					...prev.leads,
					users: {
						...leadUsers,
						results: leadUsers.results.map((chatUser) =>
							String(chatUser.id) === String(leadId)
								? { ...chatUser, categories: nextCategories }
								: chatUser
						),
					},
				},
			};
		});
	};

	const handleCustomerCategoryUpdated = ({ customerId, categories }) => {
		if (!customerId) return;
		const nextCategories = Array.isArray(categories) ? categories : [];

		setActiveUser((prev) =>
			String(prev?.id) === String(customerId)
				? { ...prev, categories: nextCategories }
				: prev
		);

		setUsers((prevUsers) => {
			if (!prevUsers?.results) return prevUsers;
			return {
				...prevUsers,
				results: prevUsers.results.map((chatUser) =>
					String(chatUser.id) === String(customerId)
						? { ...chatUser, categories: nextCategories }
						: chatUser
				),
			};
		});

		setCachedData((prev) => {
			const customerUsers = prev?.customers?.users;
			if (!customerUsers?.results) return prev;

			return {
				...prev,
				customers: {
					...prev.customers,
					users: {
						...customerUsers,
						results: customerUsers.results.map((chatUser) =>
							String(chatUser.id) === String(customerId)
								? { ...chatUser, categories: nextCategories }
								: chatUser
						),
					},
				},
			};
		});
	};

	const handleTabChange = (tab) => {
		currentTabRef.current = tab;

		// Cancel any ongoing requests
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		setActiveUser(null);
		setChatHistory([]);
		setIsScrolledUp(false);
		// Reset pagination guards so a stale nextUsers URL from the previous tab can't
		// bleed into loadMoreUsers on the new tab.
		setNextUsers(null);
		isFetchingMoreUsersRef.current = false;
		setIsFetchingMoreUsers(false);
		router.push(`${baseRoute}/messages?chat=${tab}`, { scroll: false });

		setTabUnreadFlags((prev) => ({
			...prev,
			[tab]: false,
		}));

		if (!cachedData[tab]?.users) {
			setLoading(true);
			setPageUsers(1);
		} else {
			setUsers(cachedData[tab].users);
			setPageUsers(globalPaginationCache[tab].pageUsers);
			setNextUsers(globalPaginationCache[tab].nextUsers);
		}
	};

	const sendMessageRequest = async (messageContent, options = {}) => {
		if (!activeUser?.id) {
			return;
		}

		const messageId = options.messageId || `temp-${Date.now()}`;
		const createdAt = options.createdAt || new Date().toISOString();
		const failedRecord = {
			id: messageId,
			chatKey: getFailedMessageChatKey(chatType, activeUser.id),
			request: messageContent,
			message: null,
		};

		if (chatType === "internal") {
			const tempMessage = {
				id: messageId,
				content: messageContent.text || "",
				created_at: createdAt,
				sender: userProfile,
				status: "sending",
			};

			failedRecord.message = tempMessage;
			await persistFailedMessage(failedRecord);

			setChatHistory((prev) => {
				const exists = prev.some((message) => message.id === messageId);
				if (exists) {
					return prev.map((message) =>
						message.id === messageId ? tempMessage : message
					);
				}

				return [...prev, tempMessage];
			});
			setIsScrolledUp(false);

			axiosInstance
				.post(`/internal-messaging/chats/${activeUser.id}/messages/`, {
					content: messageContent.text || "",
				}, { showLoader: false })
				.then(async (res) => {
					const real = res?.data?.data;

					if (!real) return;

					await removePersistedFailedMessage(messageId);

					setChatHistory((prev) =>
						prev.map((message) => (message.id === messageId ? real : message))
					);

					setUsers((prev) => {
						const current = prev?.results || [];
						const idx = current.findIndex((chat) => chat.id === activeUser.id);
						if (idx === -1) return prev;

						const updated = [...current];
						updated[idx] = {
							...updated[idx],
							lastMessage: real.content,
							lastMessageTime: real.created_at,
						};

						const moved = [updated[idx], ...updated.filter((chat) => chat.id !== activeUser.id)];
						return { ...prev, results: moved };
					});
				})
				.catch(async (error) => {
					if (isCancelError(error)) {
						return;
					}
					const failedMessage = { ...tempMessage, status: "failed" };
					await persistFailedMessage({ ...failedRecord, message: failedMessage });

					setChatHistory((prev) =>
						prev.map((message) =>
							message.id === messageId ? failedMessage : message
						)
					);
					handleApiError(error);
				});

			return;
		}

		const formData = new FormData();
		const hasFiles = Array.isArray(messageContent?.file) && messageContent.file.length > 0;
		const hasImages = Array.isArray(messageContent?.image) && messageContent.image.length > 0;
		const contentType = hasFiles
			? "document"
			: hasImages
				? "image"
				: "text";

		formData.append("content", messageContent.text || "");
		formData.append("subject", messageContent?.subject || "");
		formData.append("content_type", contentType);

		if (hasFiles) {
			// Append files as 'document'
			messageContent.file.forEach(file => {
				formData.append('document', file);
			});

			// Also append images as 'document' when files are present
			if (hasImages) {
				messageContent.image.forEach(img => {
					formData.append('document', img);
				});
			}
		} else if (hasImages) {
			// Only images, append them as 'image'
			messageContent.image.forEach(img => {
				formData.append('image', img);
			});
		}

		const tempMessage = {
			id: messageId,
			content: messageContent.text,
			content_type: contentType,
			subject: messageContent?.subject,
			channel: messageContent?.channel || null,
			image: messageContent?.image,
			document: messageContent?.file,
			created_at: createdAt,
			status: "sending",
			user_sender: userProfile?.id,
			company: company,
			user_sender_details: userProfile,
			company_is_sender: true,
		};

		failedRecord.message = tempMessage;
		await persistFailedMessage(failedRecord);

		setChatHistory((prevHistory) => {
			const exists = prevHistory.some((message) => message.id === messageId);
			if (exists) {
				return prevHistory.map((message) =>
					message.id === messageId ? tempMessage : message
				);
			}

			return [...prevHistory, tempMessage];
		});
		setIsScrolledUp(false);

		let url = "/communication/";

		if (chatType === "customers") {
			url += "send-to-customer/";
			formData.append("customer_id", activeUser.id);
			formData.append("channel_id", messageContent.channel_id);
		} else {
			url += "send-to-lead/";
			formData.append("lead_id", activeUser.id);
		}

		axiosInstance
			.post(url, formData, {
				headers: { "Content-Type": "multipart/form-data" },
				showLoader: false,
			})
			.then(async () => {
				await removePersistedFailedMessage(messageId);
			})
			.catch(async (error) => {
				if (isCancelError(error)) {
					return;
				}
				const failedMessage = { ...tempMessage, status: "failed" };
				await persistFailedMessage({ ...failedRecord, message: failedMessage });

				setChatHistory((prevHistory) =>
					prevHistory.map((message) =>
						message.id === messageId ? failedMessage : message
					)
				);
				handleApiError(error);
			});
	};

	const handleSendMessage = (messageContent) => {
		sendMessageRequest(messageContent);
	};

	const handleLinkLeadToCustomer = async () => {
		if (!suggestedCustomer || !activeUser?.id) return;
		setIsLinkingCustomer(true);
		try {
			await axiosInstance.post(`/customers/leads/${activeUser.id}/link-customer/`, {
				customer_id: suggestedCustomer.id,
			});
			const linkedCustomerId = suggestedCustomer.id;
			setSuggestedCustomer(null);
			router.push(`${baseRoute}/customers/${linkedCustomerId}`);
		} catch (error) {
			handleApiError(error);
		} finally {
			setIsLinkingCustomer(false);
		}
	};

	const handleRetryFailedMessage = async (message) => {
		if (!activeUser?.id || !message?.id) {
			return;
		}

		const failedRecords = await getFailedMessageRecords(
			getFailedMessageChatKey(chatType, activeUser.id)
		);
		const failedRecord = failedRecords.find((record) => record.id === message.id);

		if (!failedRecord?.request) {
			return;
		}

		await sendMessageRequest(failedRecord.request, {
			messageId: failedRecord.id,
			createdAt: failedRecord.message?.created_at || message.created_at,
		});
	};

	const fetchChannelsData = async () => {
		try {
			const allChannelsResponse = await axiosInstance.get("/channels/all/");
			setAllChannels(allChannelsResponse.data.channels);

			const connectedChannelsResponse = await axiosInstance.get("/channels/connected-channels/");
			setConnectedChannels(connectedChannelsResponse.data.connected_channels);
		}
		catch (error) {
			if (isCancelError(error)) {
				// console.log('cr');
			} else {
				handleApiError(error);
			}
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
		if (isFetchingMoreUsersRef.current || isFetchingMoreUsers || !nextUsers) return;

		// Capture the tab at call-time so we can discard stale results if the user switches tabs
		// before the fetch completes (leads/customers IDs overlap — mixing them corrupts the list).
		const requestChatType = currentTabRef.current;

		const endpointMap = {
			leads: `/communication/contacts/?page=${pageUsers}&page_size=${15}`,
			customers: `/communication/chatted-customers/?page=${pageUsers}&page_size=${15}`,
			archived: `/communication/conversations/?page=${pageUsers}&page_size=${15}`,
		};

		const endpoint = nextUsers || endpointMap[requestChatType];
		if (!endpoint) return;
		isFetchingMoreUsersRef.current = true;
		setIsFetchingMoreUsers(true);

		try {
			const { data } = await axiosInstance.get(endpoint, { showLoader: false });

			// Discard if the user has switched to a different tab while the request was in flight.
			if (currentTabRef.current !== requestChatType) return;

			const newContacts = data.results;
			setNextUsers(data.next);

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
				[requestChatType]: {
					...prev[requestChatType],
					users: {
						...data,
						results: [
							...(prev[requestChatType]?.users?.results || []),
							...newContacts.filter(
								(user) =>
									!(prev[requestChatType]?.users?.results || []).some(
										(existingUser) => existingUser.id === user.id
									)
							),
						],
					},
				},
			}));

			const nextPageUsers = pageUsers + 1;
			setPageUsers(nextPageUsers);

			// Update global cache
			globalPaginationCache[requestChatType] = {
				pageUsers: nextPageUsers,
				nextUsers: data.next
			};
		}
		catch (error) {
			if (isCancelError(error)) {
				console.log('cr');
			} else {
				handleApiError(error);
			}
		}
		finally {
			isFetchingMoreUsersRef.current = false;
			setIsFetchingMoreUsers(false);
		}
	};

	const handleCreateTicket = async (ticketData) => {
		try {
			setIsCreateTicketModalOpen(false);
			// Optionally refresh ticket panel or show success message
		} catch (error) {
			handleApiError(error);
		}
	};

	const loadMoreMessages = async () => {
		console.log("Loading more messages...");
		if (isFetchingMoreMessages || !nextMessages) return;  // Don't load if already fetching or no more pages
		setIsFetchingMoreMessages(true);

		try {
			const response = await axiosInstance.get(nextMessages);  // Fetch next page
			const newHistory = [...response.data.results.reverse(), ...chatHistory];

			setChatHistory(newHistory); // Prepend new messages
			setNextMessages(response.data.next);  // Update the next page URL

			// Update the cache so navigation back keeps the old messages loaded
			setCachedData((prev) => ({
				...prev,
				[chatType]: {
					...prev[chatType],
					histories: {
						...prev[chatType].histories,
						[activeUser.id]: newHistory,
					},
				},
			}));

			const nextPageMessage = (globalMessagePaginationCache[activeUser.id]?.pageMessages || 1) + 1;
			// Update pagination cache
			globalMessagePaginationCache[activeUser.id] = {
				pageMessages: nextPageMessage,
				nextMessages: response.data.next
			};
			setPageMessages(nextPageMessage);

		} catch (error) {
			handleApiError(error);
		} finally {
			setIsFetchingMoreMessages(false);
		}
	};

	const isInternalTab = chatType === "internal";


	return (
		<div className="body-theme flex flex-col px-2 sm:px-5 w-full max-w-full overflow-x-hidden min-w-0">
			<div className={`${activeUser ? "hidden md:flex" : "flex"} flex-wrap gap-3 p-2 sm:p-4 items-center justify-between w-full max-w-full min-w-0 overflow-x-hidden`}>
				<div className="flex items-center gap-3 sm:gap-8 min-w-0 max-w-full">
					<div className="relative flex items-center flex-wrap min-w-0 max-w-full">
						{agents.map((assignee, index) => {
							const tooltipName = (() => {
								const fullName = `${assignee?.first_name || ""} ${assignee?.last_name || ""}`.trim();
								if (fullName) return fullName;
								if (assignee?.email) return assignee.email;
								if (assignee?.phone_number) return assignee.phone_number;
								return "User"; // Fallback
							})();

							return (
								<div
									key={index}
									className={`cursor-pointer rounded-full transition-all duration-300
                ${selectedAgent === assignee.id ? 'ring-2 dark:ring-white ring-[#3EBF0F] z-10' : ''}`}
									style={{ marginLeft: index !== 0 ? '-7px' : '0px' }}
									onClick={() => handleAssigneeClick(assignee.id)}
									onMouseEnter={(e) => e.currentTarget.classList.add("z-10")}
									onMouseLeave={(e) => e.currentTarget.classList.remove("z-10")}
									data-tooltip-id={`tooltip-${assignee.id}`}
								>
									{assignee?.image ? (
										<Image
											alt="profile pic"
											className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200"
											src={assignee.image}
											width={30}
											height={30}
										/>
									) : (
										<UserAvatar
											name={assignee?.first_name ?
												`${assignee.first_name} ${assignee?.last_name}` :
												assignee?.email || '--'
											}
											className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
											width="w-6 sm:w-8"
											height="h-6 sm:h-8"
										/>
									)}
									{/* ✅ SMART TOOLTIP - Shows name, email, phone, or fallback */}
									<Tooltip id={`tooltip-${assignee.id}`} place="top">
										{tooltipName}
									</Tooltip>
								</div>
							);
						})}

						{isFilterActive && (
							<button
								className="ml-3 px-3 py-1.5 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-neutral-700 transition"
								onClick={clearFilter}
							>
								Clear Filter
							</button>
						)}
					</div>
				</div>

				<div className="relative flex flex-wrap gap-1.5 sm:gap-4 min-w-0 max-w-full">
					{baseRoute == '/admin' && (
						<>
							<button
								onClick={() => setIsExportModalOpen(true)}
								className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
								aria-label="Export"
							>
								<Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
								<span className="hidden sm:inline">Export</span>
							</button>
							<button
								onClick={() => { router.push(`${baseRoute}/settings#channels-integration`); }}
								className="bg-[#3EBF0F] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm text-xs sm:text-sm whitespace-nowrap">
								<span className="sm:hidden">+ Connect</span>
								<span className="hidden sm:inline">+ Connect Channel</span>
							</button>
						</>
					)}
					<div className="bg-gray-500 w-0.5 hidden"></div>
					<div
						className=" flex h-8 sm:h-10 min-w-0 sm:min-w-20 px-2 sm:px-3 justify-center items-center gap-1 sm:gap-2 rounded-lg border border-[#DFE1E6] body-theme cursor-pointer shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]"
						ref={buttonRef}
						onClick={() => setIsMenuOpen(!isMenuOpen)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0">
							<path
								d="M13.3333 2H2.66667C2.29848 2 2 2.29848 2 2.66667V3.7468C2 4.33065 2.25513 4.88535 2.69842 5.26531L5.96825 8.06802C6.41154 8.44799 6.66667 9.00269 6.66667 9.58654V14L9.33333 12.6667V9.58654C9.33333 9.00269 9.58846 8.44799 10.0318 8.06802L13.3016 5.26531C13.7449 4.88535 14 4.33065 14 3.7468V2.66667C14 2.29848 13.7015 2 13.3333 2Z"
								stroke="#808897"
								strokeWidth="1.33333"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>

						<p className=" text-xs sm:text-[14px] font-medium leading-[150%] tracking-[0.2px] truncate max-w-[80px] sm:max-w-none">
							{selectedChannel ? selectedChannel.name : "Filter"}
						</p>
					</div>

					{chatType === "internal" && (
						<button
							className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#3EBF0F] text-white rounded-md shadow-sm text-xs sm:text-sm whitespace-nowrap"
							onClick={() => setShowInternalModal(true)}
						>
							<span className="sm:hidden">+ New</span>
							<span className="hidden sm:inline">+ New Internal Chat</span>
						</button>
					)}

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

			<div className={`overflow-hidden messages flex flex-col md:flex-row items-stretch border border-gray-500 md:rounded-lg ${activeUser ? "rounded-none" : "rounded-lg"} relative ${activeUser ? "h-[calc(100dvh-100px)]" : "h-[calc(100dvh-180px)]"} md:h-[80vh] m-0 sm:m-4 mt-0 max-w-full`}>
				<div className={`${activeUser ? "hidden md:flex" : "flex"} flex-col w-full md:w-[320px] lg:w-[360px] md:flex-shrink-0 md:border-r md:border-gray-300 dark:md:border-gray-600 md:h-full min-h-0 min-w-0 overflow-x-hidden`}>
					<div className="body-theme justify-center gap-5 p-3 md:p-5 flex items-start flex-col w-full">
						<div className="flex items-center  w-full justify-between gap-3 ">
							<div className="relative flex-1 min-w-0">
								<input
									className="w-full body-theme bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
									placeholder="Search Users..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<button
									className="absolute top-1 right-0 flex items-center rounded body-theme py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow active:bg-gray-400 active:dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
									type="button"
									aria-label="Search"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
										<path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
									</svg>
								</button>
							</div>
							<svg
								className={`cursor-pointer ${isRotating ? 'rotate' : ''}`}
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 16 16"
								fill="none"
								onClick={() => fetchChatList({ reset: true })}
							>
								<path d="M7.99984 2.66683C5.05432 2.66683 2.6665 5.05464 2.6665 8.00016C2.6665 9.97425 3.73903 11.6978 5.33317 12.62M7.99984 2.66683L6.6665 1.3335M7.99984 2.66683L6.99984 4.3335M7.99984 13.3335C10.9454 13.3335 13.3332 10.9457 13.3332 8.00016C13.3332 6.02608 12.2606 4.30249 10.6665 3.38033M7.99984 13.3335L9.33317 14.6668M7.99984 13.3335L8.99984 11.6668" stroke="#3EBF0F" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<div className="flex gap-3 w-full overflow-x-auto -mx-1 px-1">
							<div className="tab-atom relative flex-shrink-0">
								<div className={`px-3 pb-1 whitespace-nowrap ${chatType === 'leads' ? 'active' : ""}`} onClick={() => handleTabChange('leads')}>
									Leads
									{tabUnreadFlags.leads && (
										<span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-[#3EBF0F] rounded-full"></span>
									)}
								</div>
							</div>
							<div className="tab-atom relative flex-shrink-0">
								<div className={`px-3 pb-1 whitespace-nowrap ${chatType === 'customers' ? 'active' : ""}`} onClick={() => handleTabChange('customers')}>
									Customers
									{tabUnreadFlags.customers && (
										<span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-[#3EBF0F] rounded-full"></span>
									)}
								</div>
							</div>
							<div className="tab-atom relative flex-shrink-0">
								<div className={`px-3 pb-1 whitespace-nowrap ${chatType === 'archived' ? 'active' : ""}`} onClick={() => handleTabChange('archived')}>
									Archived
									{tabUnreadFlags.archived && (
										<span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-[#3EBF0F] rounded-full"></span>
									)}
								</div>
							</div>
							<div className="tab-atom relative flex-shrink-0">
								<div className={`px-3 pb-1 whitespace-nowrap ${chatType === 'internal' ? 'active' : ""}`} onClick={() => handleTabChange('internal')}>
									Internal
									{tabUnreadFlags.internal && (
										<span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-[#3EBF0F] rounded-full"></span>
									)}
								</div>
							</div>
						</div>

					</div>

					<ChatList
						users={users}
						activeUser={activeUser}
						handleChatSelect={handleChatSelect}
						loadMoreUsers={loadMoreUsers}
						loading={loading}
						isFetchingMoreUsers={isFetchingMoreUsers}
						isAdmin={baseRoute === '/admin'}
					/>
				</div>

				<div className={`detail ${activeUser ? "flex" : "hidden md:flex"} flex-col flex-1 w-full min-w-0`}>
					{activeUser ? (
						<div className="flex flex-col w-full h-full min-w-0">
							<button
								type="button"
								onClick={() => {
									setActiveUser(null);
									router.push(`${baseRoute}/messages?chat=${chatType}`, { scroll: false });
								}}
								className="md:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#3EBF0F] border-b border-gray-200 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
								aria-label="Back to chats"
							>
								<span aria-hidden="true" className="text-base">&larr;</span> Back to chats
							</button>
							<ChatHeader
								activeUser={activeUser}
								conversationId={chatResponse?.conversation_id}
								isLead={chatType === "leads"}
								isInternal={isInternalTab}
								refreshChatList={() => {
									fetchChatList({ reset: true });
									setActiveUser(null);
								}}
								refreshChatHeader={refreshChatHeader}

								// ✅ only allow ticket actions outside internal
								onCreateTicket={!isInternalTab ? () => setIsCreateTicketModalOpen(true) : undefined}
								onToggleTicketPanel={!isInternalTab ? () => setShowTicketPanel(!showTicketPanel) : undefined}
								showTicketPanel={!isInternalTab ? showTicketPanel : false}
								baseRoute={baseRoute}
								onLeadCategoryUpdated={handleLeadCategoryUpdated}
								onCustomerCategoryUpdated={handleCustomerCategoryUpdated}
							/>

							{chatType === "leads" && suggestedCustomer && (
								<div className="mx-2 sm:mx-4 my-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 max-w-full overflow-hidden">
									<p className="text-sm text-blue-800 break-words min-w-0">
										This lead matches an existing customer: <strong>{suggestedCustomer.name}</strong>. Link them to merge their records.
									</p>
									<button
										onClick={handleLinkLeadToCustomer}
										disabled={isLinkingCustomer}
										className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap flex-shrink-0 self-start sm:self-auto"
									>
										{isLinkingCustomer ? "Linking..." : "Link to Customer"}
									</button>
								</div>
							)}

							<div className="flex items-center ">
								<MessageList
									chatHistory={chatHistory}
									isLoadingHistory={isLoadingHistory}
									inputIsEmailMode={inputIsEmailMode}
									inputBottomOffset={inputBottomOffset}
									loadMoreMessages={loadMoreMessages}
									isFetchingMore={isFetchingMoreMessages}
									isScrolledUp={isScrolledUp}
									setIsScrolledUp={setIsScrolledUp}
									next={nextMessages}
									chatType={chatType}
									currentUserId={userProfile?.id}
									onRetryFailedMessage={handleRetryFailedMessage}
								/>

								{/* Ticket Panel */}
								{chatType !== "internal" && showTicketPanel && (
									<TicketListPanel
										conversationId={chatResponse?.conversation_id}
										isVisible={showTicketPanel}
									/>
								)}


								{chatType != "archived" ? (
									<MessageInput
										onSendMessage={handleSendMessage}
										chatType={chatType}
										activeUser={activeUser}
										setInputIsEmailMode={setInputIsEmailMode}
										onHeightChange={setInputBottomOffset}
										latestChannelId={chatHistory?.length > 0 ? chatHistory[chatHistory.length - 1]?.channel?.id : null}
									/>
								) : (
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

			{/* AI Takeover Modal */}
			<Modal
				isOpen={showAiTakeoverPrompt}
				onClose={() => setShowAiTakeoverPrompt(false)}
				title="AI is handling this chat"
				footer={
					<>
						<button
							type="button"
							className="hover:shadow-md px-4 py-2 bg-theme rounded-md border border-gray-30"
							onClick={() => {
								setShowAiTakeoverPrompt(false)
								sessionStorage.setItem(`ai_prompt_dismissed_${chatResponse?.conversation_id}`, 'true');
							}}
						>
							Let AI Handle
						</button>
						<button
							type="submit"
							className="hover:shadow-md px-4 py-2 bg-[#3EBF0F] text-white rounded-md "
							onClick={async () => {
								try {
									await axiosInstance.patch(`/communication/conversations/${chatResponse?.conversation_id}/ai-status/`, {}, { showLoader: false });
									setShowAiTakeoverPrompt(false);
									sessionStorage.setItem(`ai_prompt_dismissed_${chatResponse?.conversation_id}`, 'true');
									setRefreshChatHeader(!refreshChatHeader)
								} catch (err) {
									handleApiError(err, "Failed to take over chat");
								}
							}}
						>
							Take Over Chat
						</button>
					</>
				}
			>
				<p>
					Automated responses are currently enabled for this chat. Would you like to take over and respond manually?
				</p>
			</Modal>

			{chatType !== "internal" && (
				<CreateTicketModal
					isOpen={isCreateTicketModalOpen}
					onClose={() => setIsCreateTicketModalOpen(false)}
					onSubmit={handleCreateTicket}
					customerId={activeUser?.id}
					customerName={activeUser?.name || activeUser?.email}
					conversationId={chatResponse?.conversation_id}
				/>
			)}

			<ExportModal
				isOpen={isExportModalOpen}
				onClose={() => setIsExportModalOpen(false)}
				onExport={handleExport}
				title="Export Messages"
			/>

			<Modal
				isOpen={showInternalModal}
				onClose={() => setShowInternalModal(false)}
				title="Start internal chat"
				footer={null}
			>
				<input
					className="w-full body-theme bg-transparent text-sm border border-slate-200 rounded-md px-3 py-2"
					placeholder="Search users..."
					value={internalUserSearch}
					onChange={(e) => setInternalUserSearch(e.target.value)}
				/>

				<div className="mt-3 max-h-[360px] overflow-y-auto">
					{agents
						.filter((u) => u.id !== userProfile?.id)
						.filter((u) => {
							const name = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email;
							return name.toLowerCase().includes(internalUserSearch.toLowerCase());
						})
						.map((u) => {
							const name = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email;

							return (
								<button
									key={u.id}
									className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
									onClick={async () => {
										const res = await axiosInstance.post("/internal-messaging/chats/", {
											chat_type: "direct",
											recipient_id: u.id,
										}, { showLoader: false });

										const chat = res?.data?.chat;
										if (!chat?.id) return;

										const normalized = normalizeInternalChat(chat, userProfile?.id);
										setShowInternalModal(false);

										setActiveUser(normalized);
										router.push(`${baseRoute}/messages?chat=internal&id=${chat.id}`, { scroll: false });

										// refresh list so it appears immediately
										fetchChatList({ reset: true });
									}}
								>
									<UserAvatar name={name} width="w-8" height="h-8" />
									<div className="text-left">
										<div className="font-medium">{name}</div>
										<div className="text-xs text-gray-500">{u.email}</div>
									</div>
								</button>
							);
						})}
				</div>
			</Modal>

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
