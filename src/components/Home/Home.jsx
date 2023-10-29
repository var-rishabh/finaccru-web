import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../Actions/User';
import { useDispatch, useSelector } from 'react-redux';

import { Layout, Menu } from 'antd';
const { Content, Sider } = Layout;

import MenuItems from '../../MenuItems';
import logo from '../../assets/Icons/cropped_logo.svg';
import settingIcon from '../../assets/dashboardIcons/setting.svg';
import logoutIcon from '../../assets/dashboardIcons/logout.svg';
import profileIcon from '../../assets/dashboardIcons/profile.svg';
import './Home.css';


const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [key, setKey] = React.useState(window.location.pathname.split('/')[1]);

    React.useEffect(() => {
        setKey(window.location.pathname.split('/')[1]);
    }, [window.location.pathname.split('/')[1]]);

    const { user } = useSelector(state => state.userReducer);
    
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
                                <span className='setting__name'>{ user?.displayName }</span>
                                <span className='setting__email'>{ user?.email }</span>
                            </div>
                        </div>
                        <div className='settings__item'>
                            <img src={settingIcon} alt="" />
                            <span>Settings</span>
                        </div>
                        <div className="settings__item" style={{cursor: 'pointer'}} onClick={() => dispatch(logout())}>
                            <img src={logoutIcon} alt="" />
                            <span>Logout</span>
                        </div>
                    </div>
                </Sider>
                <Layout className='site-layout'>
                    <Content className='site-layout__background'>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};
export default Home;
