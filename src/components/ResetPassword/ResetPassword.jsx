import { useState } from "react";
import "./ResetPassword.css"
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { resetPassword } from "../../Actions/User";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const query = useLocation().search;
    const params = new URLSearchParams(query);
    const oobCode = params.get('oobCode');
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.userReducer);

    const handleReset = (e) => {
        e.preventDefault();
        if (loading) return;
        if (newPassword === "") {
            toast.error("Please Enter New Password");
            return;
        } else if (confirmPassword === "") {
            toast.error("Please Enter Confirm Password");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Password and Confirm Password does not match");
            return;
        }
        dispatch(resetPassword({ newPassword: newPassword, oobCode: oobCode }));
    }

    return (
        <div className="reset__main">

            <div className="reset__heading">
                <div className="reset__heading--main">
                    <h1>Reset your Password</h1>
                </div>
                <div className="reset__heading--sub">
                    <p>
                        We need your registered email address to send you a new password.
                    </p>
                </div>
            </div>

            <div className="form__data--reset">
                <div className="reset__form">
                    <form className='reset__auth__form' onSubmit={handleReset}>
                        <div className='reset__auth__form--input'>
                            <span>Password</span>
                            <input type='password' placeholder='New Password' name='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className='reset__auth__form--input'>
                            <span>Password</span>
                            <input type='password' placeholder='Confirm Password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className='reset__auth__form--button--reset'>
                            <button type='submit'> {loading ? "Loading..." : "Reset Password"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
