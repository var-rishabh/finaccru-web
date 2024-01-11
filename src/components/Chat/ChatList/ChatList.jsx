import { useEffect, useState } from "react";
import "./ChatList.css";
import { readAccountantClientsList } from "../../../Actions/Accountant";
import { useDispatch, useSelector } from "react-redux";

const ChatList = ({ chatList, loading, setChatId, chatId, setChatItem, tab }) => {
    const { user } = useSelector(state => state.userReducer);
    const { clients, loading: clientLoading } = useSelector((state) => state.accountantReducer);
    const {open} = useSelector(state => state.chatReducer);
    const [appendedChatList, setAppendedChatList] = useState(chatList);

    const dispatch = useDispatch();

    // Accountant Clients List
    useEffect(() => {
        if (tab === "2" && user?.localInfo?.role === 1)
            dispatch(readAccountantClientsList());
        if (tab === "1")
            setAppendedChatList(chatList);
    }, [dispatch]);

    // Appending Clients List to Chat List to get clients with no chat history
    useEffect(() => {
        if (tab === "2" && user?.localInfo?.role === 1) {
            const newChatList = clients?.map((client) => {
                const chat = chatList?.find((chat) => chat.uid === client.client_id);
                if (chat) {
                    return chat;
                } else {
                    return {
                        uid: client.client_id,
                        name: client.company_name,
                        unread: 0,
                    };
                }
            });
            setAppendedChatList(newChatList);
        }
        if (tab === "1")
            setAppendedChatList(chatList);
    }, [clients, chatList]);

    return (
        loading ? <div>Loading...</div> :
            <div className="chatList--main">
                {
                    appendedChatList?.map((chat) => (
                        <div
                            className={`chatList--item ${chatId === chat.uid ? 'active' : ''}`}
                            key={chat.uid}
                            onClick={() => { setChatId(chat.uid), setChatItem(chat) }}
                        >
                            <div className="chatList--item__left">
                                <span>{chat.name}</span>
                            </div>
                            {
                                (chat.unread > 0 && !open) &&
                                <div className="chatList--item__right">
                                    <span>{chat.unread}</span>
                                </div>
                            }
                        </div>
                    ))
                }
            </div>
    )
}

export default ChatList;
