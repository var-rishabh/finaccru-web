import { Outlet } from 'react-router-dom'
import "./Onboard.css"

import logo_with_name from "../../assets/logo_with_name.png"
import onboard1 from "../../assets/onboardBG.svg"

const Onboard = () => {
    return (
        <div className='onboard'>
            <div className="onboard__container">
                <div className="logo">
                    <img src={logo_with_name} alt="logo_with_name" />
                </div>
                <img className='onboard__bg' src={onboard1} alt="onboard" />
                <Outlet />
            </div>
        </div>
    )
}

export default Onboard;
