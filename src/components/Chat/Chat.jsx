import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import "./Chat.css"
import { Tabs } from 'antd';

import Header from '../Accountant/Header/Header';
import ChatList from './ChatList/ChatList';
import ChatPart from './ChatPart/ChatPart';
import useChatList from '../../CustomHooks/useChatList';

const Chat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tab, setTab] = useState("1");
    const { user } = useSelector(state => state.userReducer);
    const { users, loading } = useChatList(user.localId, tab);
    const [chatId, setChatId] = useState();
    const [chatItem, setChatItem] = useState();
    const items = [
        {
            key: '1',
            label: 'Internal',
            children: <ChatList chatList={users} loading={loading} setChatId={setChatId} chatId={chatId} setChatItem={setChatItem} tab={tab} />,
        },
        {
            key: '2',
            label: user?.localInfo?.role === 2 ? "" : "Clients",
            children: <ChatList chatList={users} loading={loading} setChatId={setChatId} chatId={chatId} setChatItem={setChatItem} tab={tab} />,
            disabled: user?.localInfo?.role === 2
        },
    ];

    return (
        <div className='client__body'>
            <Header headerFor="Chat" backNeeded={true} />
            <div className='chat--main'>
                <div className='chat--left'>
                    <Tabs defaultActiveKey="1" items={items} onChange={(key) => {setTab(key); setChatId(); setChatItem()}} />
                </div>
                <div className='chat--right'>
                    <ChatPart chatId={chatId} tab={tab} user={chatItem} users={users} />
                </div>
            </div>
        </div>
    )
}

export default Chat;