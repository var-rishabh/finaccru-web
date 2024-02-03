import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom'

import "./Chat.css"
import { Tabs } from 'antd';

import Header from '../Accountant/Header/Header';
import ChatList from './ChatList/ChatList';
import ChatPart from './ChatPart/ChatPart';
import useChatList from '../../CustomHooks/useChatList';

const Chat = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [tab, setTab] = useState(searchParams.get("type")?.toString() || "1");
    const { user } = useSelector(state => state.userReducer);
    const { users, loading } = useChatList(user.localId, tab);
    const [chatId, setChatId] = useState(id);
    const [chatItem, setChatItem] = useState();
    const [chatUser, setChatUser] = useState();
    console.log(users);
    const items = [
        {
            key: '1',
            label: 'Internal',
            children: <ChatList chatList={users} loading={loading} setChatId={setChatId} chatId={chatId} setChatItem={setChatItem} tab={tab} chatUser={chatUser} setChatUser={setChatUser} />,
        },
        {
            key: '2',
            label: user?.localInfo?.role === 1 ? "Clients" : "",
            children: <ChatList chatList={users} loading={loading} setChatId={setChatId} chatId={chatId} setChatItem={setChatItem} tab={tab} chatUser={chatUser} setChatUser={setChatUser} />,
            disabled: user?.localInfo?.role !== 1
        },
    ];

    return (
        <div className='client__body'>
            <Header headerFor="Chat" backNeeded={true} />
            <div className='chat--main'>
                <div className='chat--left'>
                    <Tabs items={items} onChange={(key) => {setTab(key); setChatId(); setChatItem()}} activeKey={tab} />
                </div>
                <div className='chat--right'>
                    <ChatPart chatId={chatId} tab={tab} user={chatItem} users={users} />
                </div>
            </div>
        </div>
    )
}

export default Chat;
