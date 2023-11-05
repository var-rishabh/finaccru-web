import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./ForgetPassword.css";
import { forgotPassword } from "../../../Actions/User";
import { toast } from "react-toastify";

const ForgetPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const handleReset = (e) => {
        e.preventDefault();
        if (loading) return;
        if (email === "") {
            toast.error("Please Enter Email");
            return;
        }
        dispatch(forgotPassword({ email_id: email }));
    }
    const { loading } = useSelector(state => state.userReducer);
    return (
        <div className="forget__main">

            <div className="forget__heading">
                <div className="forget__heading--main">
                    <h1>Forget Password</h1>
                </div>
                <div className="forget__heading--sub">
                    <p>
                        We need your registered email address to send you a new password.
                    </p>
                </div>
            </div>

            <div className="form__data--forget">
                <div className="forget__form">
                    <form className='forget__auth__form' onSubmit={handleReset}>
                        <div className='forget__auth__form--input'>
                            <span>Registered Email</span>
                            <input type='email' placeholder='Enter Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='forget__auth__form--button--forget'>
                            <button type='submit'>{loading ? "Loading..." : "Reset Password"}</button>
                        </div>
                    </form>
                </div>

                <div className="signup__link--forget">
                    <p>
                        Back to <a href="/">Login</a>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default ForgetPassword;
