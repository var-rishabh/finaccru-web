import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence, sendPasswordResetEmail, confirmPasswordReset, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut, sendEmailVerification, createUserWithEmailAndPassword, applyActionCode } from 'firebase/auth';


export const sendLink = (user) => async (dispatch) => {
    try {
        dispatch({ type: "RegisterRequest" });
        const { email_id, password, full_name, mobile_number } = user;
        const urlObject = new URL(`${url}/public/check-user-existence`);
        urlObject.searchParams.append('email_id', email_id);
        window.localStorage.setItem("email_id", email_id);
        axios.get(`${urlObject.toString()}`, {
        }).then((data) => {
            if (data.data) {
                dispatch({ type: "RegisterFailure", payload: "User already exists" });
                toast.error("User already exists");
            }
        }).catch((error) => {
            // if error is 404 then user does not exist
            if (error.response.status === 404) {
                createUserWithEmailAndPassword(auth, email_id, password).then(async (userCredential) => {
                    // send verification mail.
                    // console.log(userCredential);
                    await sendEmailVerification(userCredential.user);
                    const token = await userCredential.user.getIdToken();
                    const urlObject2 = new URL(`${url}/private/client/onboarding/create`);
                    axios.post(`${urlObject2.toString()}`, {
                        full_name: full_name,
                        mobile_number: mobile_number
                    }, {
                        headers: {
                            'accept': 'application/json',
                            'token': token,
                        }
                    }).then((data) => {
                        dispatch({ type: "RegisterSuccess", payload: data.data });
                        toast.success("User Created");
                        signOut(auth).then(() => {
                            dispatch({
                                type: "LogoutSuccess",
                            });
                            dispatch({ type: "LoadUserRequest" });
                            window.location.href = "/confirm";
                            // Redirect to home page after logout
                        }).catch((error) => {
                            dispatch({
                                type: "LogoutFailure",
                                payload: error.message
                            });
                            toast.error(error.response?.data || error.message);
                        });
                    }).catch((error) => {
                        if (error.response?.status === 422) {
                            // I will get an array of errors from the backend in details
                            const errors = error.response.data.detail;
                            // I will loop through the array and display the errors
                            errors?.forEach((err) => {
                                toast.error(err.loc[1] + ": " + err.msg);
                            });
                        } else {
                            toast.error(error.response?.data || error.message);
                        }
                        dispatch({ type: "RegisterFailure", payload: error.message });
                        // delete user from firebase
                        userCredential.user.delete();
                    });
                }).catch((error) => {
                    dispatch({ type: "RegisterFailure", payload: error.message });
                    toast.error(error.response?.data || error.message);
                });

            } else {
                dispatch({ type: "RegisterFailure", payload: error.message });
                toast.error(error.response?.data || error.message);
            }
        });

    } catch (error) {
        console.log(error);
        dispatch({ type: "RegisterFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const confirmEmail = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ConfirmEmailRequest" });
        const { oobCode } = user;
        applyActionCode(auth, oobCode).then(() => {
            dispatch({ type: "ConfirmEmailSuccess" });
            toast.success("Email Verified");
            dispatch({ type: "LoadUserRequest" });
            window.location.href = "/";
        }).catch((error) => {
            dispatch({ type: "ConfirmEmailFailure", payload: error.message });
        });
        dispatch({ type: "ConfirmEmailSuccess" });
        toast.success("Email Verified");
    } catch (error) {
        console.log(error);
        dispatch({ type: "ConfirmEmailFailure", payload: error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const login = (user) => async (dispatch) => {
    const { email_id, mobile_number, password, remember_me } = user;
    try {
        dispatch({ type: "CheckUserRequest" });
        const urlObject = new URL(`${url}/public/check-user-existence`);
        const urlObject2 = new URL(`${url}/private/user/read`);
        if (email_id) urlObject.searchParams.append('email_id', email_id);
        if (mobile_number) urlObject.searchParams.append('mobile_number', mobile_number);
        const data = await axios.get(`${urlObject.toString()}`);
        dispatch({ type: "LoginRequest" });
        if (email_id) {
            window.localStorage.setItem("email_id", email_id);
            if (remember_me) {
                const user = await signInWithEmailAndPassword(auth, email_id, password);
                if (!user.user.emailVerified) {
                    dispatch({ type: "LoginFailure", payload: "User not verified" });
                    await sendEmailVerification(user.user);
                    toast.error("User not verified! Resent verification link");
                    setTimeout(() => {
                        dispatch({ type: "LoadUserRequest" })
                        window.location.href = "/confirm";
                    }, 1000);
                    return;
                }

                const token = await user.user.getIdToken();
                const data = await axios.get(`${urlObject2.toString()}`, {
                    headers: {
                        'accept': 'application/json',
                        'token': token,
                    }
                });
                const status = data.data.status;
                console.log(status);
                dispatch({ type: "LoginSuccess", payload: user.user.reloadUserInfo });
                toast.success("Login Successfull");
                if (status === 3) {
                    if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                } else if (status === 2) {
                    if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                } else if (status === 1) {
                    if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                } else if (window.location.pathname !== "/") window.location.href = "/";
            } else {
                await setPersistence(auth, browserSessionPersistence);
                const user = await signInWithEmailAndPassword(auth, email_id, password);
                if (!user.user.emailVerified) {
                    dispatch({ type: "LoginFailure", payload: "User not verified" });
                    await sendEmailVerification(user.user);
                    toast.error("User not verified! Resent verification link");
                    setTimeout(() => {
                        dispatch({ type: "LoadUserRequest" })
                        window.location.href = "/confirm";
                    }, 1000);
                    return;
                }
                dispatch({ type: "LoginSuccess", payload: user.user.reloadUserInfo });
                toast.success("Login Successfull");
                const token = await user.user.getIdToken();
                const data = await axios.get(`${urlObject2.toString()}`, {
                    headers: {
                        'accept': 'application/json',
                        'token': token,
                    }
                });
                const status = data.data.status;
                // dispatch({ type: "LoadUserRequest" });
                if (status === 3) {
                    if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                } else if (status === 2) {
                    if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                } else if (status === 1) {
                    if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                } else if (window.location.pathname !== "/") window.location.href = "/";
            }
        }
        if (mobile_number) {
            window.localStorage.setItem("mobile_number", mobile_number);
            window.location.href = "/verifyotp";
        }
    } catch (error) {
        console.log(error);
        if (error?.response?.status === 404) {
            dispatch({ type: "LoginFailure", payload: "User not found" });
            toast.error("User not found. Redirecting to register page");
            setTimeout(() => {
                dispatch({ type: "LoadUserRequest" });
                if (email_id) window.location.href = "/register?email_id=" + email_id;
                else if (mobile_number) window.location.href = "/register?mobile_number=" + mobile_number;
            }, 2000);
        } else {
            dispatch({ type: "LoginFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const forgotPassword = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ForgotPasswordRequest" });
        const { email_id } = user;
        await sendPasswordResetEmail(auth, email_id);
        dispatch({ type: "ForgotPasswordSuccess" });
        toast.success("Reset Password Link Sent to your Email");
    } catch (error) {
        console.log(error);
        dispatch({ type: "ForgotPasswordFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const resetPassword = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ResetPasswordRequest" });
        const { newPassword, oobCode } = user;
        // console.log(newPassword, oobCode);
        await confirmPasswordReset(auth, oobCode, newPassword);
        dispatch({ type: "ResetPasswordSuccess" });
        toast.success("Password Reset Successfull");
        window.location.href = "/";
    } catch (error) {
        console.log(error);
        dispatch({ type: "ResetPasswordFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const sendOtp = (user) => async (dispatch) => {
    try {
        dispatch({ type: "SendOtpRequest" });
        const { mobile_number } = user;
        const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
        });
        const data = await signInWithPhoneNumber(auth, mobile_number, appVerifier)
        const confirmationResult = await data;
        window.confirmationResult = confirmationResult;
        window.localStorage.setItem("mobilenumber", mobile_number);
        window.localStorage.removeItem("mobile_number");
        dispatch({ type: "SendOtpSuccess" });
        toast.success("OTP Sent");
    } catch (error) {
        console.log(error);
        dispatch({ type: "SendOtpFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
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
            // Check if user is verified
            if (!user.emailVerified) {
                dispatch({ type: "LoginFailure", payload: "User not verified" });
                await sendEmailVerification(user);
                toast.error("User not verified! Resent verification link");
                setTimeout(() => {
                    dispatch({ type: "LoadUserRequest" })
                    window.location.href = "/confirm";
                }, 1000);
                return;
            }
            dispatch({ type: "LoginSuccess", payload: user.reloadUserInfo });

            // const token = await user.getIdToken();
            // const data = await axios.get(`${urlObject.toString()}`, {
            //     headers: {
            //         'accept': 'application/json',
            //         'token': token,
            //     }
            // });
            // const status = data.data.status;

            toast.success("Login Successfull");
            dispatch({ type: "LoadUserRequest" })
            // if (status === 3) {
            //     if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
            // } else if (status === 2) {
            //     if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
            // } else if (status === 1) {
            //     if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
            // }
        }).catch((error) => {
            dispatch({
                type: "LoginFailure",
                payload: error.message
            });
            toast.error(error.response?.data || error.message);
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "LoginFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: "LoadUserRequest" });
        await onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                console.log(token);
                if (!token) {
                    dispatch({ type: "LoadUserFailure", payload: "User not found" });
                    return;
                }
                // Check if user is verified
                if (!user.emailVerified) {
                    dispatch({ type: "LoadUserFailure", payload: "User not verified" });
                    return;
                }
                const urlObject = new URL(`${url}/private/user/read`);
                axios.get(`${urlObject.toString()}`, {
                    headers: {
                        'accept': 'application/json',
                        'token': token,
                    }
                }).then(async (data) => {
                    if (data.data.status === 0) {
                        const client = await axios.get(`${url}/private/client/read`, {
                            headers: {
                                'accept': 'application/json',
                                'token': token,
                            }
                        });

                        await dispatch({
                            type: "LoadUserSuccess", payload: {
                                ...user.reloadUserInfo,
                                localInfo: data.data,
                                clientInfo: client.data
                            }
                        });
                    } else {
                        await dispatch({
                            type: "LoadUserSuccess", payload: {
                                ...user.reloadUserInfo,
                                localInfo: data.data,
                            }
                        });
                    }
                    const status = data.data.status;
                    if (status === 3) {
                        if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                    } else if (status === 2) {
                        if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                    } else if (status === 1) {
                        if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                    }
                }).catch((error) => {
                    dispatch({ type: "LoadUserFailure", payload: error.message });
                });

            } else {
                dispatch({ type: "LoadUserFailure", payload: "User not found" });
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "LoadUserFaliure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const resendEmail = () => async (dispatch) => {
    try {
        dispatch({ type: "ResendEmailRequest" });
        const user = auth.currentUser;
        if (!user) {
            dispatch({ type: "ResendEmailFailure", payload: "User not found" });
            return;
        }
        await sendEmailVerification(user);
        dispatch({ type: "ResendEmailSuccess" });
        toast.success("Email Sent");
    } catch (error) {
        console.log(error);
        dispatch({ type: "ResendEmailFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: "LogoutRequest" });
    signOut(auth).then(() => {
        dispatch({
            type: "LogoutSuccess",
        });
        // Redirect to home page after logout
        dispatch({ type: "LoadUserRequest" });
        window.location.href = "/";
        toast.success("Logout Successful");
    }).catch((error) => {
        dispatch({
            type: "LogoutFailure",
            payload: error.message
        });
        toast.error(error.response?.data || error.message);
    });
}
