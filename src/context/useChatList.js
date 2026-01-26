export const useChatList = (chatType, searchQuery, selectedChannel, selectedAgent) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [next, setNext] = useState(null);
    const { axiosInstance } = useApi();
    const { handleApiError } = useError();

    const fetchChatList = useCallback(async ({ reset = false } = {}) => {
        console.log('🔍 Fetching chat list:', { chatType, searchQuery, reset });

        let endpoint;
        // ... your endpoint logic

        try {
            setLoading(true);
            const response = await axiosInstance.get(endpoint, { showLoader: false });

            console.log('✅ Chat list fetched:', response.data);

            setUsers(reset ? response.data : {
                ...response.data,
                results: [...(users?.results || []), ...response.data.results]
            });
            setNext(response.data.next);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    }, [chatType, searchQuery, selectedChannel, selectedAgent]);

    return { users, loading, next, fetchChatList };
};