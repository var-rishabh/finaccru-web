import ProformaLayoutP1 from './ProformaLayoutP1/ProformaLayoutP1';
import ProformaLayoutP2 from './ProformaLayoutP2/ProformaLayoutP2';
import { useNavigate } from 'react-router-dom';
import { createProforma, getProformaDetails, getNewProformaNumber, updateProforma } from '../../../Actions/Proforma';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCurrency } from '../../../Actions/Onboarding';
import { getDate } from '../../../utils/date';
import { toast } from 'react-toastify';

import "./ProformaLayout.css"
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import { getCustomerDetails } from '../../../Actions/Customer';

const ProformaLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [proformaNumber, setProformaNumber] = useState('');
    const [proformaDate, setProformaDate] = useState(getDate());
    const [validTill, setValidTill] = useState(getDate());
    const [reference, setReference] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [subject, setSubject] = useState(null);
    const [termsAndConditions, setTermsAndConditions] = useState(null);
    const [isSetDefaultTncCustomer, setIsSetDefaultTncCustomer] = useState(false);
    const [isSetDefaultTncClient, setIsSetDefaultTncClient] = useState(false);
    const [items, setItems] = useState([{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
    const [shippingAddress1, setShippingAddress1] = useState('');
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [currency, setCurrency] = useState('AED');

    const isAdd = window.location.pathname.split('/')[2] === 'create';
    const { user } = useSelector(state => state.userReducer);
    const { loading: proformaLoading, proforma, number } = useSelector(state => state.proformaReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const { customer } = useSelector(state => state.customerReducer);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCurrency());
            dispatch(getProformaDetails(window.location.pathname.split('/')[3]));
            // proforma?.customer?.customer_id
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            dispatch(getCurrency());
            dispatch(getNewProformaNumber());
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCustomerDetails(proforma?.customer?.customer_id));
        }
    }, [dispatch, proforma?.customer?.customer_id]);

    useEffect(() => {
        setTermsAndConditions(customer?.terms_and_conditions ? customer?.terms_and_conditions : termsAndConditions);
    }, [customer, termsAndConditions]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            setProformaNumber(proforma?.pi_number);
            setProformaDate(proforma?.pi_date);
            setValidTill(proforma?.due_date);
            setReference(proforma?.reference);
            setCustomerName(proforma?.customer?.customer_name);
            setCustomerId(proforma?.customer?.customer_id);
            setCurrencyId(proforma?.currency_id);
            setCurrencyConversionRate(proforma?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv : 'AED');
            setItems(proforma?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(proforma?.customer?.shipping_address_line_1);
            setShippingAddress2(proforma?.customer?.shipping_address_line_2);
            setShippingAddress3(proforma?.customer?.shipping_address_line_3);
            setShippingCountry(proforma?.customer?.shipping_country);
            setShippingState(proforma?.customer?.shipping_state);
            setSubject(proforma?.subject);
            setTermsAndConditions(proforma?.terms_and_conditions);
            setIsSetDefaultTncCustomer(proforma?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(proforma?.is_set_default_tnc_client);
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            setProformaNumber(number);
            setTermsAndConditions(user?.clientInfo?.terms_and_conditions);
        }
    }, [currencies, proforma, number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (proformaLoading) {
            return;
        }
        if (proformaNumber == "" || customerId == null || currencyConversionRate <= 0) {
            toast.error("Please fill and check all fields.");
            return;
        }
        if (shippingAddress1 === "" || shippingCountry === "" || shippingState === "") {
            toast.error("Please select shipping details.");
            return;
        }
        if (items.some((item) => item.item_name === '')) {
            toast.error("Item name cannot be empty.");
            return;
        }
        if (items.some((item) => item.unit === '')) {
            toast.error("Unit cannot be empty.");
            return;
        }
        if (items.some((item) => item.qty <= 0)) {
            toast.error("Quantity should be greater than 0.");
            return;
        }
        if (items.some((item) => item.rate <= 0)) {
            toast.error("Rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.discount < 0)) {
            toast.error("Discount should be greater than or equal to 0.");
            return;
        }
        const data = {
            customer_id: customerId,
            pi_number: proformaNumber,
            pi_date: proformaDate,
            due_date: validTill,
            reference: reference === "" ? null : reference,
            subject: subject === "" ? null : subject,
            terms_and_conditions: termsAndConditions === "" ? null : termsAndConditions,
            is_set_default_tnc_customer: isSetDefaultTncCustomer,
            is_set_default_tnc_client: isSetDefaultTncClient,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
            shipping_address_line_1: shippingAddress1,
            shipping_address_line_2: shippingAddress2 === "" ? null : shippingAddress2,
            shipping_address_line_3: shippingAddress3 === "" ? null : shippingAddress3,
            shipping_state: shippingState,
            shipping_country: shippingCountry,
        }
        if (isAdd) {
            dispatch(createProforma(data, navigate));
        }
        else {
            dispatch(updateProforma(window.location.pathname.split('/')[3], data, navigate));
        }
    }
    return (
        <>
            <div className='create__proforma__header'>
                <div className='create__proforma__header--left'>
                    <img src={backButton} alt='back' className='create__proforma__header--back-btn' onClick={() => navigate("/proforma")} />
                    <h1 className='create__proforma__header--title'> Proformas List </h1>
                </div>
                <div className='create__proforma__header--right'>
                    <a className='create__proforma__header--btn1'>Download</a>
                    <a className='create__proforma__header--btn2'>Share</a>
                </div>
            </div>
            <div className="proforma__container">
                <div className="create__proforma--main">
                    <div className="create__proforma--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__proforma--head'>Proforma</h1>
                    </div>
                    <form>
                        <ProformaLayoutP1 proformaNumber={proformaNumber} setProformaNumber={setProformaNumber}
                            proformaDate={proformaDate} setProformaDate={setProformaDate} validTill={validTill} setValidTill={setValidTill}
                            reference={reference} setReference={setReference}
                            customerName={customerName} setCustomerName={setCustomerName}
                            customerId={customerId} setCustomerId={setCustomerId}
                            currency={currency} setCurrency={setCurrency} currencyId={currencyId} setCurrencyId={setCurrencyId}
                            currencyConversionRate={currencyConversionRate} setCurrencyConversionRate={setCurrencyConversionRate}
                            subject={subject} setSubject={setSubject}
                            shippingAddress1={shippingAddress1} setShippingAddress1={setShippingAddress1}
                            shippingAddress2={shippingAddress2} setShippingAddress2={setShippingAddress2}
                            shippingAddress3={shippingAddress3} setShippingAddress3={setShippingAddress3}
                            shippingCountry={shippingCountry} setShippingCountry={setShippingCountry}
                            shippingState={shippingState} setShippingState={setShippingState}
                            termsAndConditions={termsAndConditions} setTermsAndConditions={setTermsAndConditions}
                        />
                        <ProformaLayoutP2 items={items} setItems={setItems} currency={currency}
                            termsAndConditions={termsAndConditions} setTermsAndConditions={setTermsAndConditions}
                            isSetDefaultTncCustomer={isSetDefaultTncCustomer} setIsSetDefaultTncCustomer={setIsSetDefaultTncCustomer}
                            isSetDefaultTncClient={isSetDefaultTncClient} setIsSetDefaultTncClient={setIsSetDefaultTncClient}
                        />
                        <div className='proforma__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    proformaLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="proforma__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='proforma__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.2rem", fontWeight: "600", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProformaLayout;