import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import "./Chat.css"
import { Tabs } from 'antd';

import Header from '../Accountant/Header/Header';
import ChatList from './ChatList/ChatList';
import ChatPart from './ChatPart/ChatPart';

const Chat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [chatId, setChatId] = useState("");

    const chatList = [
        {
            name: "Rishabh Varshney",
            unread: 0,
        },
        {
            name: "John Songate",
            unread: 4,
        },
        {
            name: "Keeper",
            unread: 2,
        },
        {
            name: "Cena Songer",
            unread: 0,
        },
        {
            name: "Long Sion",
            unread: 45,
        },
        {
            name: "Keeper",
            unread: 2,
        },
        {
            name: "Cena Songer",
            unread: 0,
        },
        {
            name: "Long Sion",
            unread: 45,
        },
        {
            name: "Cena Songer",
            unread: 0,
        },
        {
            name: "Long Sion",
            unread: 45,
        },
        {
            name: "Shubham",
            unread: 0,
        },
        {
            name: "Randome Guy",
            unread: 17,
        },
        {
            name: "John Songate",
            unread: 4,
        },
        {
            name: "Long Sion",
            unread: 45,
        },
        {
            name: "Shubham",
            unread: 0,
        },
        {
            name: "Randome Guy",
            unread: 17,
        },
        {
            name: "John Songate",
            unread: 4,
        },
        {
            name: "Rishabh Varshney",
            unread: 0,
        },
        {
            name: "John Songate",
            unread: 4,
        }
    ]

    const { user } = useSelector(state => state.userReducer);

    const items = [
        {
            key: '1',
            label: 'Internal',
            children: <ChatList chatList={chatList} />,
        },
        {
            key: '2',
            label: user?.localInfo?.role === 2 ? "" : "Clients",
            children: <ChatList chatList={chatList.slice(10, 20)} />,
            disabled: user?.localInfo?.role === 2 ? true : false,
        },
    ];

    return (
        <div className='client__body'>
            <Header headerFor="Chat" backNeeded={true} />
            <div className='chat--main'>
                <div className='chat--left'>
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
                <div className='chat--right'>
                    <ChatPart chatId={chatId} />
                </div>
            </div>
        </div>
    )
}

export default Chat;
