import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";

export const getVendorList = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: "VendorListRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/vendors/read-vendors-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "VendorListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "VendorListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const createVendor = (data, handleVendorSubmit, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateVendorRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/vendors/create`, data, config);
        dispatch({ type: "CreateVendorSuccess", payload: response.data });
        toast.success("Vendor created successfully");
        if (handleVendorSubmit) {
            handleVendorSubmit(response.data);
        }
        dispatch(getVendorList());
        navigate("/vendor");
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "CreateVendorFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "CreateVendorFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}


export const updateVendor = (data, id, handleVendorSubmit, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateVendorRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.put(`${url}/private/client/vendors/update/${id}`, data, config);
        dispatch({ type: "UpdateVendorSuccess", payload: data });
        toast.success("Vendor updated successfully");
        if (handleVendorSubmit) {
            handleVendorSubmit(data);
        } else {
            navigate("/vendor/view/" + id);
        }
    }
    catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "UpdateVendorFailure", payload: error.response?.data || error.message });
        } else {
            dispatch({ type: "UpdateVendorFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const getVendorDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "VendorDetailsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/vendors/read/${id}`, config);
        dispatch({ type: "VendorDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "VendorDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const getVendorInfiniteScroll = (page = 1, refresh = false, keyword="") => async (dispatch) => {
    try {
        dispatch({ type: "VendorInfiniteScrollRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/vendors/read-vendors-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "VendorInfiniteScrollSuccess", payload: { data: response.data, refresh: refresh } });
    }
    catch (error) {
        console.log(error);
        dispatch({ type: "VendorInfiniteScrollFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const createVendorShippingAddress = (data, customer_id, handleVendorShippingAddressSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "CreateVendorShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/vendors/${customer_id}/create-shipping-address`, data, config);
        dispatch({ type: "CreateVendorShippingAddressSuccess", payload: response.data });
        toast.success("Vendor Shipping Address created successfully");
        if (handleVendorShippingAddressSubmit) {
            handleVendorShippingAddressSubmit(response.data);
        }
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "CreateVendorShippingAddressFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "CreateVendorShippingAddressFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const getVendorShippingAddressList = (customer_id) => async (dispatch) => {
    try {
        dispatch({ type: "VendorShippingAddressListRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/vendors/${customer_id}/read-shipping-address-list`, config);
        dispatch({ type: "VendorShippingAddressListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "VendorShippingAddressListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteVendor = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteVendorRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(`${url}/private/client/vendors/delete/${id}`, config);
        dispatch({ type: "DeleteVendorSuccess", payload: id });
        dispatch(getVendorList());
        toast.success("Vendor deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ type: "DeleteVendorFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updateVendorShippingAddress = (data, shipping_address_id, handleVendorShippingAddressSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateVendorShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.put(`${url}/private/client/vendors/update-shipping-address/${shipping_address_id}`, data, config);
        dispatch({ type: "UpdateVendorShippingAddressSuccess", payload: data });
        toast.success("Vendor Shipping Address updated successfully");
        if (handleVendorShippingAddressSubmit) {
            handleVendorShippingAddressSubmit(data);
        }
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "UpdateVendorShippingAddressFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "UpdateVendorShippingAddressFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const deleteVendorShippingAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteVendorShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(`${url}/private/client/vendors/delete-shipping-address/${id}`, config);
        dispatch({ type: "DeleteVendorShippingAddressSuccess", payload: id });
        toast.success("VendorShipping Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ type: "DeleteVendorShippingAddressFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

