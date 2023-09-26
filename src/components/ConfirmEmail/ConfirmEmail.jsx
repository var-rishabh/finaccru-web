import { useEffect, useRef, useState } from "react";
import "./ConfirmEmail.css"

const ConfirmEmail = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const [email, setEmail] = useState(user?.email);

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
                <div className="confirm__email--heading--foot">
                    <p>
                        Check you email and click on the confirmation link to login.
                    </p>
                </div>
            </div>

            <div className="confirm__email--button">
                <button type='submit'>Login</button>
            </div>

        </div>
    )
}

export default ConfirmEmail;
