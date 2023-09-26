import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence, sendPasswordResetEmail, confirmPasswordReset, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth';


export const sendLink = (user) => async (dispatch) => {
    try {
        dispatch({ type: "RegisterRequest" });
        const { email_id } = user;
        const urlObject = new URL(`${url}/public/check-user-existence`);
        urlObject.searchParams.append('email_id', email_id);

        axios.get(`${urlObject.toString()}`, {
        }).then((data) => {
            if (data.data) {
                dispatch({ type: "RegisterFailure", payload: "User already exists" });
                toast.error("User already exists");
            }
        }).catch((error) => {
            // if error is 404 then user does not exist
            if (error.response.status === 404) {
                sendSignInLinkToEmail(auth, email_id, {
                    url: 'http://localhost:5173/redirect',
                    handleCodeInApp: true,
                })
                    .then(() => {
                        window.localStorage.setItem("emailForSignIn", email_id);
                        toast.success("Confirmation Link Sent to your Email");
                        window.location.href = "/confirm";
                        dispatch({ type: "RegisterSuccess" });
                    })
                    .catch((error) => {
                        dispatch({ type: "RegisterFailure", payload: error.message });
                        toast.error(error.message);
                    });
            } else {
                dispatch({ type: "RegisterFailure", payload: error.message });
                toast.error(error.message);
            }
        });

    } catch (error) {
        console.log(error);
        dispatch({ type: "RegisterFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
};

export const confirmEmail = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ConfirmEmailRequest" });
        const user = JSON.parse(window.localStorage.getItem("user"));
        const { oobCode } = user;
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            signInWithEmailLink(auth, email, window.location.href)
                .then((result) => {
                    window.localStorage.removeItem('emailForSignIn');
                    dispatch({ type: "ConfirmEmailSuccess", payload: result.user.reloadUserInfo });
                    toast.success("Email Confirmed");
                    const urlObject = new URL(`${url}/private/client/create`);
                    const token = result.user.getIdToken();

                    axios.post(`${urlObject.toString()}`, {
                        full_name: user.full_name,
                        mobile_number: user.mobile_number
                    }, { 
                        headers: {
                            'accept': 'application/json',
                            'token': token,
                        }
                    }).then((data) => {
                        dispatch({ type: "ConfirmEmailSuccess", payload: data.data });
                        toast.success("User Created");
                        
                    }).catch((error) => {
                        dispatch({ type: "ConfirmEmailFailure", payload: error.message });
                        toast.error(error.message);
                        // delete user from firebase
                        result.user.delete();
                    });
                    window.location.href = "/";
                })
                .catch((error) => {
                    dispatch({ type: "ConfirmEmailFailure", payload: error.message });
                    toast.error(error.message);
                });
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: "ConfirmEmailFailure", payload: error.message });
        toast.error(error.message);
    }
};


export const login = (user) => async (dispatch) => {
    try {
        dispatch({ type: "CheckUserRequest" });
        const urlObject2 = new URL(`${url}/private/user/read`);
        const { email_id, mobile_number, password, remember_me } = user;
        const urlObject = new URL(`${url}/public/check-user-existence`);
        if (email_id) urlObject.searchParams.append('email_id', email_id);
        if (mobile_number) urlObject.searchParams.append('mobile_number', mobile_number);
        const data = await axios.get(`${urlObject.toString()}`);
        dispatch({ type: "LoginRequest" });
        if (email_id) {
            if (remember_me) {
                const user = await signInWithEmailAndPassword(auth, email_id, password);
                dispatch({ type: "LoginSuccess", payload: user.user.reloadUserInfo });
                toast.success("Login Successfull");
                const token = await user.user.getIdToken();
                const data = await axios.post(`${urlObject2.toString()}`, {}, {
                    headers: {
                        'accept': 'application/json',
                        'token': token,
                    }
                });
                const status = data.data.status;
                if (status === 3) {
                    if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                } else if (status === 2) {
                    if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                } else if (status === 1) {
                    if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                } else {
                    if (window.location.pathname !== "/") window.location.href = "/";
                }
            } else {
                await setPersistence(auth, browserSessionPersistence);
                const user = await signInWithEmailAndPassword(auth, email_id, password);
                dispatch({ type: "LoginSuccess", payload: user.user.reloadUserInfo });
                toast.success("Login Successfull");
                const token = await user.user.getIdToken();
                const data = await axios.post(`${urlObject2.toString()}`, {}, {
                    headers: {
                        'accept': 'application/json',
                        'token': token,
                    }
                });
                const status = data.data.status;
                if (status === 3) {
                    if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                } else if (status === 2) {
                    if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                } else if (status === 1) {
                    if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                } else {
                    if (window.location.pathname !== "/") window.location.href = "/";
                }
            }
        }
        if (mobile_number) {
            window.localStorage.setItem("mobile_number", mobile_number);
            window.location.href = "/verifyotp";

        }
    } catch (error) {
        console.log(error);
        dispatch({ type: "LoginFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
};



export const forgotPassword = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ForgotPasswordRequest" });
        const { email_id } = user;
        await sendPasswordResetEmail(auth, email_id);
        dispatch({ type: "ForgotPasswordSuccess" });
        toast.success("Reset Password Link Sent to your Email");
        window.location.href = "/";
    } catch (error) {
        console.log(error);
        dispatch({ type: "ForgotPasswordFailure", payload: error.response.data.message || error.message });
        toast.error(error.response.data.message || error.message);
    }
};


export const resetPassword = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ResetPasswordRequest" });
        const { newPassword, oobCode } = user;
        console.log(newPassword, oobCode);
        await confirmPasswordReset(auth, oobCode, newPassword);
        dispatch({ type: "ResetPasswordSuccess" });
        toast.success("Password Reset Successfull");
        window.location.href = "/";
    } catch (error) {
        console.log(error);
        dispatch({ type: "ResetPasswordFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
};

export const sendOtp = (user) => async (dispatch) => {
    try {
        const { mobile_number } = user;
        const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
        });
        signInWithPhoneNumber(auth, mobile_number, appVerifier)
            .then((result) => {
                window.confirmationResult = result;
                toast.success("OTP Sent");
            }).catch((error) => {
                dispatch({
                    type: "LoginFailure",
                    payload: error.message
                });
                toast.error(error.message);
            });

    } catch (error) {
        console.log(error);
        dispatch({ type: "LoginFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
};

export const verifyOTP = (user) => async (dispatch) => {
    try {
        const { otpString } = user;
        const code = otpString;
        if (window.confirmationResult === undefined) {
            toast.error("Too many attempts");
        }
        const urlObject = new URL(`${url}/private/user/read`);
        window.confirmationResult.confirm(code).then(async (result) => {
            const user = result.user;
            dispatch({ type: "LoginSuccess", payload: user.reloadUserInfo });

            const token = await user.getIdToken();
            const data = await axios.post(`${urlObject.toString()}`, {}, {
                headers: {
                    'accept': 'application/json',
                    'token': token,
                }
            });
            const status = data.data.status;
            toast.success("Login Successfull");
            if (status === 3) {
                if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
            } else if (status === 2) {
                if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
            } else if (status === 1) {
                if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
            }
        }).catch((error) => {
            dispatch({
                type: "LoginFailure",
                payload: error.message
            });
            toast.error(error.message);
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "LoginFailure", payload: error.response?.data.message || error.message });
        toast.error(error.response.data.message || error.message);
    }
};

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: "LoadUserRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                console.log(token);
                const urlObject = new URL(`${url}/private/user/read`);
                axios.post(`${urlObject.toString()}`, {}, {
                    headers: {
                        'accept': 'application/json',
                        'token': token,
                    }
                }).then((data) => {
                    dispatch({
                        type: "LoadUserSuccess", payload: {
                            ...user.reloadUserInfo,
                            localInfo: data.data
                        }
                    });
                    // const status = data.data.status;
                    // if (status === 3) {
                    //     if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                    // } else if (status === 2) {
                    //     if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                    // } else if (status === 1) {
                    //     if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                    // }
                }).catch((error) => {
                    dispatch({ type: "LoadUserFailure", payload: error.message });
                });

            } else {
                dispatch({ type: "LoadUserFailure", payload: "User not found" });
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "LoadUserFaliure", payload: error.response?.data.message || error.message });
        toast.error(error.response?.data.message || error.message);
    }
};


export const logout = () => async (dispatch) => {
    dispatch({ type: "LogoutRequest" });
    signOut(auth).then(() => {
        dispatch({
            type: "LogoutSuccess",
        });
        // Redirect to home page after logout
        window.location.href = "/";
        toast.success("Logout Successful");
    }).catch((error) => {
        dispatch({
            type: "LogoutFailure",
            payload: error.message
        });
        toast.error(error.message);
    });
}
