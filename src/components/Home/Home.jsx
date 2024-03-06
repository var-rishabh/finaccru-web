import React from 'react';

import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { logout } from '../../Actions/User';

import { Layout, Menu, Modal } from 'antd';
const { Content, Sider } = Layout;

import MenuItems from '../../MenuItems';
import useChatList from '../../CustomHooks/useChatList';
import ChatPart from '../Chat/ChatPart/ChatPart';
import CompanyModal from '../Accountant/CompanyModal/CompanyModal';

import './Home.css';
import { MessageOutlined, LoadingOutlined } from '@ant-design/icons';
import logo from '../../assets/Icons/cropped_logo.svg';
import logoutIcon from '../../assets/dashboardIcons/logout.svg';
import profileIcon from '../../assets/dashboardIcons/profile.svg';
import customer from '../../assets/dashboardIcons/customer.svg';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [key, setKey] = React.useState(window.location.pathname.split('/')[1]);

    const [companyModalOpen, setCompanyModalOpen] = useState(false);

    React.useEffect(() => {
        setKey(window.location.pathname.split('/')[1]);
    }, [window.location.pathname.split('/')[1]]);

    const { user } = useSelector(state => state.userReducer);
    const { open } = useSelector(state => state.chatReducer);

    const { users, loading } = useChatList(user?.localId, "2");

    const onClick = (e) => {
        navigate(e.key);
    };

    return (
        <>
            <Layout>
                <Sider width={280}>
                    {/* Icon */}
                    <div className='menu__top'>
                        <div className='home-icon'>
                            <img src={logo} alt='home-icon' />
                        </div>
                        <Menu
                            onClick={onClick}
                            defaultSelectedKeys={[`/${key}`]}
                            selectedKeys={[`/${key}`]}
                            mode='vertical'
                            items={MenuItems}
                        />
                    </div>
                    <div className='settings'>
                        <div className='settings__profile'>
                            <img src={profileIcon} alt="" />
                            <div className='setting__userinfo'>
                                <span className='setting__name'>{user?.displayName}</span>
                                <span className='setting__email'>{user?.email}</span>
                            </div>
                        </div>
                        <div className='settings__item' onClick={() => setCompanyModalOpen(true)}>
                            <img src={customer} alt="" />
                            <span>Profile</span>
                        </div>
                        <div className="settings__item" style={{ cursor: 'pointer' }} onClick={() => dispatch(logout())}>
                            <img src={logoutIcon} alt="" />
                            <span>Logout</span>
                        </div>
                    </div>
                </Sider>
                <CompanyModal isCompanyModalOpen={companyModalOpen} handleCompanyCancel={() => setCompanyModalOpen(false)} clientData={user?.clientInfo} />
                <Layout className='site-layout'>
                    <Content className='site-layout__background'>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
            <Modal className="chat__for__client" open={open} footer={null} onCancel={() => dispatch({ type: "CloseChatModal" })} width={800}>
                {open && <ChatPart chatId={user?.localId} tab="2" user={users?.at(0)} users={users} />}
            </Modal>
            <div className='chat__float' onClick={() => dispatch({ type: "OpenChatModal" })}>
                <MessageOutlined style={{ fontSize: "1.2rem" }} />
                <div className='chat__float--unreadNumber'>
                    {
                        loading ?
                            <LoadingOutlined /> : users.length <= 0
                                ? "" : users.at(0).unread > 0 ? users.at(0).unread : ""
                    }
                </div>
            </div>
        </>
    );
};
export default Home;
