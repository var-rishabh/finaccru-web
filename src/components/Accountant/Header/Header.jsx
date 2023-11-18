import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../../Actions/User';
import CompanyModal from "../CompanyModal/CompanyModal";

import "./Header.css"
import { InfoCircleTwoTone } from "@ant-design/icons";
import logoutIcon from "../../../assets/dashboardIcons/logout.svg";
import profileIcon from "../../../assets/dashboardIcons/profile.svg";
import { Input, Tooltip } from "antd";

const Header = ({ headerFor }) => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const [companyModalOpen, setCompanyModalOpen] = useState(false);

    const { user } = useSelector(state => state.userReducer);

    // const [searchText, setSearchText] = useState("");

    // useEffect(() => {
    //     if (searchText.length > 2) {
    // dispatch(getPaymentsList(1, searchText));
    //     }
    //     if (searchText.length === 0) {
    // dispatch(getPaymentsList());
    //     }
    // }, [searchText, dispatch]);

    return (
        <div className="header__accountant">
            <div className="header__accountant--left">
                <span className="header__accountant--title">
                    {
                        headerFor ?
                            <>
                                <h1> {headerFor?.full_name} </h1>
                                <InfoCircleTwoTone onClick={() => setCompanyModalOpen(true)} />
                            </>
                            :
                            <h1> Dashboard </h1>
                    }
                </span>
                {/* <Input placeholder="Search" onChange={(e) => setSearchText(e.target.value)} value={searchText} /> */}
            </div>
            <CompanyModal isCompanyModalOpen={companyModalOpen} handleCompanyCancel={() => setCompanyModalOpen(false)} clientData={headerFor} />
            <div className="header__accountant--right">
                <div className="header__accountant--profile">
                    <img src={profileIcon} alt="" />
                    <div className="header__accountant--userinfo">
                        <span className="header__accountant--name">{user?.displayName}</span>
                        <span className="header__accountant--email">{user?.email}</span>
                    </div>
                    <Tooltip title="Logout" color='red' placement="bottom">
                        <img className="header__accountant--logout" src={logoutIcon} alt="logout"
                            onClick={() => dispatch(logout())}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default Header;
