import { useDispatch, useSelector } from "react-redux";

import { markMessageAsRead, sendChatMessage } from "../../../Actions/Chat";
import useChats from "../../../CustomHooks/useChats";

import "./ChatPart.css";
import { LinkOutlined, SendOutlined, LoadingOutlined, WechatOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

const ChatPart = ({ chatId, tab, user, users }) => {

    const dispatch = useDispatch()

    const { user: userDetails } = useSelector(state => state.userReducer);
    const { loading: chatLoading, open } = useSelector(state => state.chatReducer);

    // Get chats
    const { chats, loading } = useChats(chatId, tab);

    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    // Send message
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            chat_id: chatId,
            receiver_id: user?.user,
            text: text,
        }
        dispatch(sendChatMessage(data, userDetails?.localInfo?.role, tab, chatId));
        setText("");
    }

    // Auto scroll to bottom
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [chats, open])


    useEffect(() => {
        if (chatId) {
            dispatch({ type: "OpenChatModal" });
        } else {
            dispatch({ type: "CloseChatModal" });
        }
        return () => {
            dispatch({ type: "CloseChatModal" });
        }
    }, [chatId])


    // Mark as read
    useEffect(() => {
        if ((chats?.length > 0) && ((userDetails?.localInfo?.role !== 0) || (open))) {
            dispatch(markMessageAsRead(userDetails?.localInfo?.role, tab, chatId));
        }
    }, [chats, users]);


    return (
        <div className="chat-section">
            {
                user?.name ?
                    <>
                        <div className="chatPart--header">{user?.name}</div>
                        <div className="chatPart--chats">
                            {
                                chats?.map((message, index) => {
                                    return (
                                        <div className={`chatPart--chat ${message.from === user?.user ? "receivedChat" : "sentChat"}`} key={index}>
                                            <div className="chatPart--chatMessage">
                                                {message.message}
                                            </div>
                                            <div className="chatPart--chatInfo">
                                                <div className="chatPart--chatTime">
                                                    {
                                                        new Date(message?.time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                    } | {
                                                        new Date(message?.time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                                    }
                                                </div>
                                                {
                                                    message?.document_number &&
                                                    <a href={`/`} rel="noreferrer" target="_blank" className="chatPart--chatDocNumber">
                                                        {message?.document_name}
                                                    </a>
                                                }
                                            </div>
                                        </div>
                                    )
                                })

                            }
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="chatPart--input">
                            <label htmlFor="file"><LinkOutlined /></label>
                            <input type="file" name="file" id="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                            <input type="text" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} disabled={chatLoading} />
                            <button type="submit" onClick={handleSubmit} disabled={chatLoading}>
                                {chatLoading ? <LoadingOutlined /> : <SendOutlined />}
                            </button>
                        </form>
                    </> :
                    <div className="empty__chatBlock">
                        <WechatOutlined style={{fontSize: "3rem"}}/>
                        <div className="empty__chatBlock--text">
                            Start a chat now!
                        </div>
                    </div>
            }
        </div>
    )
}

export default ChatPart;
