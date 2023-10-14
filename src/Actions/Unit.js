import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";


export const createUnit = (data) => async (dispatch) => {
    try {
        dispatch({ type: "CreateUnitRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/units/create`, data, config);
        dispatch({ type: "CreateUnitSuccess", payload: response.data });
        toast.success("Unit Created Successfully");
    } catch (error) {
        console.log(error)
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({ type: "CreateUnitFailure", payload: error.response?.data || error.message });
        } else {;
            dispatch({ type: "CreateUnitFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const getUnit = () => async (dispatch) => {
    try {
        dispatch({ type: "GetUnitRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/units/read`, config);
        dispatch({ type: "GetUnitSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "GetUnitFailure", payload: error.response?.data || error.message });
    }
}