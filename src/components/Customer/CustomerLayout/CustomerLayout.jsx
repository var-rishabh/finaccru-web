import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getCountries, getStates } from "country-state-picker";
import { createCustomer } from "../../../Actions/Customer";
import uaeStates from "../../../data/uaeStates";

import { Select, Input } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
import backButton from "../../../assets/Icons/back.svg";
import MinusIcon from "../../../assets/Icons/minus.svg";
import "./CustomerLayout.css";

const CustomerLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.customerReducer)

    const [customerName, setCustomerName] = useState("");
    const [contactName, setContactName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [countryPhoneCode, setCountryPhoneCode] = useState("+971");
    const [billingAddress1, setBillingAddress1] = useState("");
    const [billingAddress2, setBillingAddress2] = useState("");
    const [billingAddress3, setBillingAddress3] = useState("");
    const [trnNumber, setTrnNumber] = useState("");
    const [openingBalance, setOpeningBalance] = useState(null);
    const [openingBalanceDate, setOpeningBalanceDate] = useState("");
    const [sameBillingAddress, setSameBillingAddress] = useState(false);
    const [shippingAddresses, setShippingAddresses] = useState([
        { label: "", address_line_1: "", address_line_2: "", address_line_3: "", state: "", country: "United Arab Emirates", countryCode: "ae" }
    ]);
    const [billingState, setBillingState] = useState(null);
    const [billingCountry, setBillingCountry] = useState("United Arab Emirates");
    const [allBillingState, setAllBillingStates] = useState(uaeStates);
    const [selectedBillingCountry, setSelectedBillingCountry] = useState("ae");
    const [isPhoneError, setIsPhoneError] = useState(false);

    const handleCountryPhoneCodeChange = (value) => {
        setCountryPhoneCode(value);
    }

    const selectBefore = (
        <Select onChange={handleCountryPhoneCodeChange} defaultValue={countryPhoneCode}>
            {getCountries().map((country) => (
                <Option key={country.code} value={country.dial_code}>
                    {country.dial_code}
                </Option>
            ))}
        </Select>
    );

    const handleBillingCountryChange = (value) => {
        const countryCode = value;
        setSelectedBillingCountry(countryCode);
        const selectedBillingCountry = getCountries().find(country => country.code === countryCode);
        setBillingCountry(selectedBillingCountry ? selectedBillingCountry.name : "");
        if (countryCode === "ae") {
            setAllBillingStates(uaeStates);
            setBillingState(null);
        } else if (countryCode) {
            const countryStates = getStates(countryCode);
            setAllBillingStates(countryStates);
            setBillingState(null);
        } else {
            setAllBillingStates([]);
        }
    };

    const handleUseBillingAddress = () => {
        if (!sameBillingAddress) {
            setSameBillingAddress(true);
            const updatedShippingAddress = shippingAddresses?.map((address) => ({ ...address }));
            updatedShippingAddress[0].address_line_1 = billingAddress1;
            updatedShippingAddress[0].address_line_2 = billingAddress2;
            updatedShippingAddress[0].address_line_3 = billingAddress3;
            updatedShippingAddress[0].state = billingState;
            updatedShippingAddress[0].country = billingCountry;
            updatedShippingAddress[0].countryCode = selectedBillingCountry;
            setShippingAddresses(updatedShippingAddress);
        } else {
            setSameBillingAddress(false);
        }
    }

    const handleShippingAddressChange = (index, key, value) => {
        const updatedShippingAddress = shippingAddresses?.map((address) => ({ ...address }));
        updatedShippingAddress[index][key] = value;
        if (key === "countryCode") {
            const countryCode = value;
            const selectedShippingCountry = getCountries().find(country => country.code === countryCode);
            updatedShippingAddress[index].country = selectedShippingCountry ? selectedShippingCountry.name : "";
            updatedShippingAddress[index].state = null;
        }
        setShippingAddresses(updatedShippingAddress);
    };

    const handleAddShippingAddress = (event) => {
        event.preventDefault();
        setShippingAddresses([...shippingAddresses, { label: "", address_line_1: "", address_line_2: "", address_line_3: "", state: "", country: "United Arab Emirates", countryCode: "ae" }]);
    };

    const handleRemoveShippingAddress = (index, event) => {
        event.preventDefault();
        const updatedShippingAddress = shippingAddresses.filter((_, i) => i !== index);
        setShippingAddresses(updatedShippingAddress);
        if (index === 0) {
            setSameBillingAddress(false);
        }
    };

    const handleSubmit = () => {
        if (phone !== "") {
            if (isPhoneError) {
                toast.error("Please Enter Valid Phone Number.");
                return;
            }
            if ((countryPhoneCode + phone).length > 13) {
                toast.error("Phone Number can have atmost 13 digits including country code.");
                return;
            }
        }
        if (customerName === "" || displayName === "" || billingAddress1 === "" || billingState == "" || billingCountry == "") {
            toast.error("Please fill all the fields");
            return;
        }
        if (shippingAddresses.some(address => address.address_line_1 === "" || address.state === "" || address.country === "")) {
            toast.error("Please fill compulsory fields of shipping address.");
            return;
        }
        if (shippingAddresses.some(address => address.label === "")) {
            shippingAddresses.forEach(address => {
                if (address.label === "") { address.label = null; }
            })
        }
        if (shippingAddresses.some(address => address.address_line_2 === "")) {
            shippingAddresses.forEach(address => {
                if (address.address_line_2 === "") { address.address_line_2 = null; }
            })
        } else if (shippingAddresses.some(address => address.address_line_3 === "")) {
            shippingAddresses.forEach(address => {
                if (address.address_line_3 === "") { address.address_line_3 = null; }
            })
        }
        shippingAddresses.forEach(address => {
            delete address.countryCode;
        })
        const customer = {
            customer_name: customerName,
            contact_name: contactName === "" ? null : contactName,
            display_name: displayName,
            email: email === "" ? null : email,
            mobile_number: phone === "" ? null : countryPhoneCode + phone,
            billing_address_line_1: billingAddress1,
            billing_address_line_2: billingAddress2 === "" ? null : billingAddress2,
            billing_address_line_3: billingAddress3 === "" ? null : billingAddress3,
            billing_state: billingState,
            billing_country: billingCountry,
            shipping_addresses: shippingAddresses,
            trn: trnNumber === "" ? null : trnNumber,
            opening_balance: openingBalance === "" ? null : openingBalance,
            opening_balance_date: openingBalanceDate === "" ? null : openingBalanceDate,
        }
        dispatch(createCustomer(customer));
    }

    return (
        <>
            <div className='create__estimate__header'>
                <div className='create__estimate__header--left'>
                    <img src={backButton} alt='back' className='create__estimate__header--back-btn' onClick={() => navigate("/customer")} />
                    <h1 className='create__estimate__header--title'> Customers List </h1>
                </div>
            </div>
            <div className="create__customer--main">
                <span className="create__customer--header">Add New Customer</span>
                <form className="create__customer--form">
                    <div className="create__customer--form-main">
                        <div className="create__customer--left">
                            <div className="create__customer--input">
                                <span className="required__field">Customer Name</span>
                                <input type="text" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            </div>
                            <div className="create__customer--input">
                                <span>Contact Name</span>
                                <input type="text" name="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                            </div>
                            <div className="create__customer--input">
                                <span className="required__field">Display Name</span>
                                <input type="text" name="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            </div>
                            <div className="create__customer--input">
                                <span>Email</span>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="create__customer--input">
                                <span>Phone</span>
                                <Input type="text" name="phone" addonBefore={selectBefore} value={phone}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d{9,10}$/);
                                        setPhone(e.target.value);
                                        if (valid) {
                                            setIsPhoneError(false);
                                        } else {
                                            setIsPhoneError(true);
                                        }
                                    }}
                                />
                                {/* <span className="phone__error--span">{isPhoneError ? "Wrong Phone Number" : ""}</span> */}
                            </div>
                            <div className="create__customer--input">
                                <span>TRN Number</span>
                                <input type="text" name="trnNumber" value={trnNumber} onChange={(e) => setTrnNumber(e.target.value)} />
                            </div>
                            <div className="create__customer--input">
                                <span>Opening Balance</span>
                                <Input type="text" name="openingBalance" addonBefore={"AED"} value={openingBalance}
                                    onChange={(e) => {
                                        setOpeningBalance(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="create__customer--input">
                                <span>Opening Balance Date</span>
                                <input type="date"
                                    name="openingBalanceDate"
                                    value={openingBalanceDate}
                                    onChange={(e) => setOpeningBalanceDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="create__customer--right">
                            <div className="create__customer--input">
                                <span className="required__field">Billing Address 1</span>
                                <input type="text" name="billingAddress1" value={billingAddress1}
                                    onChange={(e) => setBillingAddress1(e.target.value)}
                                />
                            </div>
                            <div className="create__customer--input">
                                <span>Billing Address 2</span>
                                <input type="text" name="billingAddress2" value={billingAddress2}
                                    onChange={(e) => setBillingAddress2(e.target.value)}
                                />
                            </div>
                            <div className="create__customer--input">
                                <span>Billing Address 3</span>
                                <input type="text" name="billingAddress3" value={billingAddress3}
                                    onChange={(e) => setBillingAddress3(e.target.value)}
                                />
                            </div>
                            <div className="create__customer--select">
                                <span className="required__field">Billing Country</span>
                                <Select
                                    showSearch
                                    id="country"
                                    defaultValue="ae"
                                    value={selectedBillingCountry}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                    options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                                    onChange={handleBillingCountryChange}
                                />
                            </div>
                            <div className="create__customer--select">
                                {selectedBillingCountry && (
                                    <>
                                        <span className="required__field">{selectedBillingCountry == "ae" ? "Emirates" : "State"}</span>
                                        <Select
                                            showSearch
                                            id="state"
                                            placeholder="Select State"
                                            value={billingState}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                            }
                                            options={allBillingState.map((state) => ({ value: state, label: state }))}
                                            onChange={(value) => setBillingState(value)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="create__customer--form-shipping">
                        <span className="create__customer--form-header">Shipping Address</span>
                        <div className="create__customer--checkbox">
                            <input type="checkbox" value={sameBillingAddress}
                                checked={sameBillingAddress}
                                onChange={handleUseBillingAddress}
                            />
                            <span>Use Billing Address</span>
                        </div>
                        <div className="create__customer--shippingList">
                            {
                                shippingAddresses?.map((address, index) => (
                                    <>
                                        <div className="create__customer--shipping-address" key={index}>
                                            {shippingAddresses.length > 1 && (
                                                <div className='create__customer--shipping-address-minus'>
                                                    {index === 0 ? <span style={{ marginBottom: '1rem' }}>&nbsp;</span> : <></>}
                                                    <img src={MinusIcon} onClick={(e) => handleRemoveShippingAddress(index, e)} />
                                                </div>
                                            )}
                                            <div className="create__customer--shipping-address-single">
                                                <div className="create__customer--shipping-address-left">
                                                    <div className="create__customer--input shipping-input">
                                                        <span>Label</span>
                                                        <input type="text" name="label" value={address.label}
                                                            onChange={(e) => handleShippingAddressChange(index, "label", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="create__customer--input shipping-input">
                                                        <span className="required__field">Address Line 1</span>
                                                        <input type="text" name="address_line_1" value={address.address_line_1}
                                                            onChange={(e) => handleShippingAddressChange(index, "address_line_1", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="create__customer--input shipping-input">
                                                        <span>Address Line 2</span>
                                                        <input type="text" name="address_line_2" value={address.address_line_2}
                                                            onChange={(e) => handleShippingAddressChange(index, "address_line_2", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="create__customer--input shipping-input">
                                                        <span>Address Line 3</span>
                                                        <input type="text" name="address_line_3" value={address.address_line_3}
                                                            onChange={(e) => handleShippingAddressChange(index, "address_line_3", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="create__customer--shipping-address-right">
                                                    <div className="create__customer--select shipping-input">
                                                        <span className="required__field">Country</span>
                                                        <Select
                                                            showSearch
                                                            id="country"
                                                            defaultValue="ae"
                                                            value={address.country}
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                                            options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                                                            onChange={(value) => handleShippingAddressChange(index, "countryCode", value)}
                                                        />
                                                    </div>
                                                    <div className="create__customer--select shipping-input">
                                                        {address.country && (
                                                            <>
                                                                <span className="required__field">{address.country == "ae" ? "Emirates" : "State"}</span>
                                                                <Select
                                                                    showSearch
                                                                    id="state"
                                                                    placeholder="Select State"
                                                                    value={address.state}
                                                                    optionFilterProp="children"
                                                                    filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                                                    filterSort={(optionA, optionB) =>
                                                                        (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                                                    }
                                                                    options={address.countryCode == "ae" ? uaeStates?.map((state) => ({ value: state, label: state })) : getStates(address.countryCode).map((state) => ({ value: state, label: state }))}
                                                                    onChange={(value) => handleShippingAddressChange(index, "state", value)}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {index === shippingAddresses.length - 1 && (
                                            <div className='add--item-btn'>
                                                <button onClick={(e) => handleAddShippingAddress(e)}>
                                                    <PlusOutlined />
                                                </button>
                                                <span>Add New Shipping Address</span>
                                            </div>
                                        )}
                                    </>
                                ))
                            }
                        </div>
                    </div>
                    <div>
                        <div className="create__customer--btns">
                            <a className="create__customer--submit-btn" onClick={handleSubmit}> {
                                // loading ? <LoadingOutlined /> : "Submit"
                                "Submit"
                            } </a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CustomerLayout;