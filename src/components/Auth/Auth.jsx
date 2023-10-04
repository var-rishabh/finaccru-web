import { Outlet } from 'react-router-dom'
import './Auth.css'

import auth_main1 from "../../assets/auth_main1.svg"
import auth_main2 from "../../assets/auth_main2.svg"
import auth_main3 from "../../assets/auth_main3.svg"
import logo_with_name from "../../assets/logo_with_name.png"

const Auth = () => {
  return (
    <>
      <div className='auth'>
        <div className='auth__left'>
          <img src={auth_main1} alt='auth_main1' className='auth__image1' />
          <img src={auth_main2} alt='auth_main2' className='auth__image2' />
          <img src={auth_main3} alt='auth_main3' className='auth__image3' />
        </div>
        <div className='auth__right'>
          <div className="logo">
            <img src={logo_with_name} alt="logo_with_name" />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Auth
