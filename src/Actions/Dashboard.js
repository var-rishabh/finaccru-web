import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";

export const getDashboardStats = (data) => async (dispatch) => {
    dispatch({ type: "DashboardStatsRequest" });
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post(`${url}/private/client/dashboard/read-stats`, data, {
            headers: {
                token: token,
                "Content-Type": "application/json",
            },
        });
        dispatch({ type: "DashboardStatsSuccess", payload: response.data });
    } catch (error) {
        dispatch({ type: "DashboardStatsFailure", payload: error });
        toast.error(error.response.data);
    }
};

export const getDashboardBalance = (data) => async (dispatch) => {
    dispatch({ type: "DashboardBalanceRequest" });
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post(`${url}/private/client/dashboard/read-balance`, data, {
            headers: {
                token: token,
                "Content-Type": "application/json",
            },
        });
        dispatch({ type: "DashboardBalanceSuccess", payload: response.data });
    } catch (error) {
        dispatch({ type: "DashboardBalanceFailure", payload: error });
        toast.error(error.response.data);
    }
}