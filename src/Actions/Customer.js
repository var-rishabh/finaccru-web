import axios from 'axios';
import { toast } from 'react-toastify';
import url from '../data/url';
import { auth } from "../firebase";

export const getCustomerList = (page = 1, keyword = "") => async (dispatch) => {
    try {
        dispatch({ type: "CustomerListRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/customers/read-customers-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "CustomerListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "CustomerListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const createCustomer = (data, handleCustomerSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "CreateCustomerRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/customers/create`, data, config);
        dispatch({ type: "CreateCustomerSuccess", payload: response.data });
        console.log(response.data);
        toast.success("Customer created successfully");
        if (handleCustomerSubmit) {
            handleCustomerSubmit(response.data);
        }
        dispatch(getCustomerList());
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "CreateCustomerFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "CreateCustomerFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const createInSalesDocument = (data, handleCustomerSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "CreateInSalesDocumentRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/customers/create-in-sales-document`, data, config);
        dispatch({ type: "CreateInSalesDocumentSuccess", payload: response.data });
        console.log(response.data);
        toast.success("InSales Document created successfully");
        if (handleCustomerSubmit) {
            handleCustomerSubmit(response.data);
        }
        dispatch(getCustomerList());
    } catch (error) {
        console.log(error);
        if (error.response?.status === 422) {
            // I will get an array of errors from the backend in details
            const errors = error.response.data.detail;
            // I will loop through the array and display the errors
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({ type: "CreateInSalesDocumentFailure", payload: error.response?.data || error.message });
        } else {
            dispatch({ type: "CreateInSalesDocumentFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const updateCustomer = (data, id, handleCustomerSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateCustomerRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.put(`${url}/private/client/customers/update/${id}`, data, config);
        dispatch({ type: "UpdateCustomerSuccess", payload: data });
        toast.success("Customer updated successfully");
        if (handleCustomerSubmit) {
            handleCustomerSubmit(data);
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
            dispatch({ type: "UpdateCustomerFailure", payload: error.response?.data || error.message });
        } else {
            dispatch({ type: "UpdateCustomerFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}



export const getCustomerDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CustomerDetailsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/customers/read/${id}`, config);
        dispatch({ type: "CustomerDetailsSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "CustomerDetailsFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}



export const getCustomerInfiniteScroll = (page = 1, refresh = false, keyword="") => async (dispatch) => {
    try {
        dispatch({ type: "CustomerInfiniteScrollRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/customers/read-customers-list/${page}?keyword=${keyword}`, config);
        dispatch({ type: "CustomerInfiniteScrollSuccess", payload: { data: response.data, refresh: refresh } });
    }
    catch (error) {
        console.log(error);
        dispatch({ type: "CustomerInfiniteScrollFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}


export const createShippingAddress = (data, customer_id, handleShippingAddressSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "CreateShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(`${url}/private/client/customers/${customer_id}/create-shipping-address`, data, config);
        dispatch({ type: "CreateShippingAddressSuccess", payload: response.data });
        console.log(response.data);
        toast.success("Shipping Address created successfully");
        if (handleShippingAddressSubmit) {
            handleShippingAddressSubmit(response.data);
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
            dispatch({ type: "CreateShippingAddressFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "CreateShippingAddressFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const getShippingAddressList = (customer_id) => async (dispatch) => {
    try {
        dispatch({ type: "ShippingAddressListRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(`${url}/private/client/customers/${customer_id}/read-shipping-address-list`, config);
        dispatch({ type: "ShippingAddressListSuccess", payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "ShippingAddressListFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const deleteCustomer = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteCustomerRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(`${url}/private/client/customers/delete/${id}`, config);
        dispatch({ type: "DeleteCustomerSuccess", payload: id });
        toast.success("Customer deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ type: "DeleteCustomerFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}

export const updateShippingAddress = (data, shipping_address_id, handleShippingAddressSubmit) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.put(`${url}/private/client/customers/update-shipping-address/${shipping_address_id}`, data, config);
        dispatch({ type: "UpdateShippingAddressSuccess", payload: data });
        toast.success("Shipping Address updated successfully");
        if (handleShippingAddressSubmit) {
            handleShippingAddressSubmit(data);
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
            dispatch({ type: "UpdateShippingAddressFailure", payload: error.response?.data || error.message });
        } else {

            dispatch({ type: "UpdateShippingAddressFailure", payload: error.response?.data || error.message });
            toast.error(error.response?.data || error.message);
        }
    }
}

export const deleteShippingAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(`${url}/private/client/customers/delete-shipping-address/${id}`, config);
        dispatch({ type: "DeleteShippingAddressSuccess", payload: id });
        toast.success("Shipping Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ type: "DeleteShippingAddressFailure", payload: error.response?.data || error.message });
        toast.error(error.response?.data || error.message);
    }
}