import "./ChatList.css";

const ChatList = ({chatList}) => {
    return (
        <div className="chatList--main">
            {
                chatList?.map((chat, index) => (
                    <div className="chatList--item" key={index}>
                        <div className="chatList--item__left">
                            <span>{chat.name}</span>
                        </div>
                        <div className="chatList--item__right">
                            <span>{chat.unread}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ChatList;
