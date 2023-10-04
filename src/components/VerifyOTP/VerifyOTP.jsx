import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import "./verifyOTP.css"
import { sendOtp, verifyOTP } from "../../Actions/User";

const VerifyOTP = () => {
    const mobile_number = window.localStorage.getItem("mobile_number");
    const [otp, setOtp] = useState({ otp1: "", otp2: "", otp3: "", otp4: "", otp5: "", otp6: "", disable: true });
    useEffect(() => {
        sendOtpFunc();
    }, []);
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.userReducer);
    const sendOtpFunc = () => {
        const mobile_number = window.localStorage.getItem("mobile_number");
        if (mobile_number === null) {
            toast.error("Please enter mobile number");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            dispatch(sendOtp({ mobile_number }));
        }
    };
    const handleOtpChange = (value, e) => {
        setOtp({ ...otp, [value]: e.target.value });
    }

    const handleVerify = (e) => {
        e.preventDefault();
        if (otp.otp1 === "" || otp.otp2 === "" || otp.otp3 === "" || otp.otp4 === "" || otp.otp5 === "" || otp.otp6 === "") {
            toast.error("Please enter OTP");
            return;
        }
        if (window.localStorage.getItem("mobile_number") === null) {
            toast.error("Please enter mobile number");
            window.location.href = "/";
            return;
        }

        const otpString = `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}${otp.otp5}${otp.otp6}`;
        dispatch(verifyOTP({ otpString }));
    }

    const inputfocus = (element) => {
        if (element.key === "Delete" || element.key === "Backspace") {
            const next = element.target.tabIndex - 2;
            if (next > -1) {
                element.target.form.elements[next].focus()
            }
        }
        else {
            const next = element.target.tabIndex;
            if (next <= 5) {
                element.target.form.elements[next].focus()
            }
        }
    }

    return (
        <div className="verify__main">
            <div id="recaptcha-container"></div>
            <div className="verify__heading">
                <div className="verify__heading--main">
                    <h1>Please Enter OTP</h1>
                </div>
                <div className="verify__heading--sub">
                    <p>
                        It has been sent to your registered mobile number.
                    </p>
                </div>
                <div className="otp__heading--count">
                    
                </div>
            </div>

            <div className="form__data--verify">
                <div className="verify__form">
                    <form className='verify__auth__form' onSubmit={handleVerify}>
                        <div className='verify__auth__form--otp'>
                            <input type="text" autoComplete="off" name="otp1" value={otp.otp1} onChange={e => handleOtpChange("otp1", e)} tabIndex="1" maxLength="1" onKeyUp={e => inputfocus(e)} />
                            <input type="text" autoComplete="off" name="otp2" value={otp.otp2} onChange={e => handleOtpChange("otp2", e)} tabIndex="2" maxLength="1" onKeyUp={e => inputfocus(e)} />
                            <input type="text" autoComplete="off" name="otp3" value={otp.otp3} onChange={e => handleOtpChange("otp3", e)} tabIndex="3" maxLength="1" onKeyUp={e => inputfocus(e)} />
                            <input type="text" autoComplete="off" name="otp4" value={otp.otp4} onChange={e => handleOtpChange("otp4", e)} tabIndex="4" maxLength="1" onKeyUp={e => inputfocus(e)} />
                            <input type="text" autoComplete="off" name="otp5" value={otp.otp5} onChange={e => handleOtpChange("otp5", e)} tabIndex="5" maxLength="1" onKeyUp={e => inputfocus(e)} />
                            <input type="text" autoComplete="off" name="otp6" value={otp.otp6} onChange={e => handleOtpChange("otp6", e)} tabIndex="6" maxLength="1" onKeyUp={e => inputfocus(e)} />
                        </div>
                        <div className="signup__link--verify">
                            <p>
                                Don&#39;t receive any OTP yet?
                                <a onClick={() => {
                                    const mobile_number = window.localStorage.getItem("mobilenumber");
                                    dispatch(sendOtp({ mobile_number }));
                                }}>
                                    &nbsp; Resend
                                </a>
                            </p>
                        </div>
                        <div className='verify__auth__form--button--verify'>
                            <button type='submit'>{loading ? "Loading..." : "Login"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default VerifyOTP;
