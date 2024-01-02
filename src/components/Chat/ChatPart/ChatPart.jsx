import "./ChatPart.css";

import { LinkOutlined, SendOutlined } from "@ant-design/icons";

const ChatPart = ({ chatId }) => {
    const messages = [
        {
            from: "Rishabh Varshney",
            to: "John",
            message: "Hello 1",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "John",
            to: "Rishabh Varshney",
            message: "Hello 3",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "Rishabh Varshney",
            to: "John",
            message: "Hello 2",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "John",
            to: "Rishabh Varshney",
            message: "Hello 3",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "John",
            to: "Rishabh Varshney",
            message: "Hello 3",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "John",
            to: "Rishabh Varshney",
            message: "Hello 3",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "Rishabh Varshney",
            to: "John",
            message: "Hello 2",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "Rishabh Varshney",
            to: "John",
            message: "Hello 2",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "John",
            to: "Rishabh Varshney",
            message: "Hello 3",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "Rishabh Varshney",
            to: "John",
            message: "Hello 2",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
        {
            from: "Rishabh Varshney",
            to: "John",
            message: "Hello 2",
            time: "12:00pm",
            document_number: "TI-456456",
            document_name: "Test 1",
        },
    ]
    
    return (
        <div className="chatPart__main">
            <div className="chatPart--header">Rishabh Varshney</div>
            <div className="chatPart--form">
                <div className="chatPart--chats">
                    {
                        messages.map((message, index) => {
                            return (
                                <div className={`chatPart--chat ${message.from === "John" ? "receivedChat" : "sentChat"}`} key={index}>
                                    <div className="chatPart--chat__from">
                                        <div className="chatPart--chatName">{message.from}</div>
                                        <div className="chatPart--chatTime">{message.time}</div>
                                    </div>
                                    <div className="chatPart--chatMessage">
                                        {message.message}
                                    </div>
                                    <div className="chatPart--chatDoc">
                                        <div className="chatPart--chatDocNumber">{message.document_number}</div>
                                        <div className="chatPart--chatDocName">{message.document_name}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <form className="chatPart--input">
                    <label htmlFor="file"><LinkOutlined /></label>
                    <input type="file" name="file" id="file" hidden />
                    <input type="text" placeholder="Type a message" />
                    <button type="submit" onClick={(e) => e.preventDefault()}><SendOutlined /></button>
                </form>
            </div>
        </div>
    )
}

export default ChatPart;
