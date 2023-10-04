import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { resendEmail } from "../../Actions/User";
import "./ConfirmEmail.css";

const ConfirmEmail = () => {
    const dispatch = useDispatch();

    const email_id = window.localStorage.getItem("email_id");
    const [email, setEmail] = useState(email_id);

    return (
        <div className="confirm__email--main">

            <div className="confirm__email--heading">
                <div className="confirm__email--heading--main">
                    <h1>Confirm your email address.</h1>
                </div>
                <div className="confirm__email--heading--sub">
                    <p>
                        We sent a confirmation email to {email}
                    </p>
                </div>
                <button className="resend__button" onClick={() =>
                    dispatch(resendEmail())
                }>Resend Email</button>
                <div className="confirm__email--heading--foot">
                    <p>
                        Check you email and click on the confirmation link to login.
                    </p>
                </div>
            </div>

            <a className="confirm__email--button" href="/">Login</a>

        </div>
    )
}

export default ConfirmEmail;
