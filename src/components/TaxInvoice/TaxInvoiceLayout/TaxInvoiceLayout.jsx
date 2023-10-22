import TaxInvoiceLayoutP1 from './TaxInvoiceLayoutP1/TaxInvoiceLayoutP1';
import TaxInvoiceLayoutP2 from './TaxInvoiceLayoutP2/TaxInvoiceLayoutP2';
import { useNavigate } from 'react-router-dom';
import { createTaxInvoice, getTaxInvoiceDetails, getNewTaxInvoiceNumber, updateTaxInvoice } from '../../../Actions/TaxInvoice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCurrency } from '../../../Actions/Onboarding';
import { getDate } from '../../../utils/date';
import { toast } from 'react-toastify';

import "./TaxInvoiceLayout.css"
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import { getCustomerDetails } from '../../../Actions/Customer';

const TaxInvoiceLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [taxInvoiceNumber, setTaxInvoiceNumber] = useState('');
    const [taxInvoiceDate, setTaxInvoiceDate] = useState(getDate());
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
    const [paymentReceived, setPaymentReceived] = useState(null);
    const [attachmentUrl, setAttachmentUrl] = useState(null);

    const isAdd = window.location.pathname.split('/')[2] === 'create';
    const { user } = useSelector(state => state.userReducer);
    const { loading: taxInvoiceLoading, taxInvoice, number } = useSelector(state => state.taxInvoiceReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const { customer } = useSelector(state => state.customerReducer);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCurrency());
            dispatch(getTaxInvoiceDetails(window.location.pathname.split('/')[3]));
            // taxInvoice?.customer?.customer_id
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            dispatch(getCurrency());
            dispatch(getNewTaxInvoiceNumber());
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCustomerDetails(taxInvoice?.customer?.customer_id));
        }
    }, [dispatch, taxInvoice?.customer?.customer_id]);

    useEffect(() => {
        setTermsAndConditions(customer?.terms_and_conditions ? customer?.terms_and_conditions : termsAndConditions);
    }, [customer, termsAndConditions]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            setTaxInvoiceNumber(taxInvoice?.ti_number);
            setTaxInvoiceDate(taxInvoice?.ti_date);
            setValidTill(taxInvoice?.due_date);
            setReference(taxInvoice?.reference);
            setCustomerName(taxInvoice?.customer?.customer_name);
            setCustomerId(taxInvoice?.customer?.customer_id);
            setCurrencyId(taxInvoice?.currency_id);
            setCurrencyConversionRate(taxInvoice?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === taxInvoice?.currency_id)?.currency_abv : 'AED');
            setItems(taxInvoice?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(taxInvoice?.customer?.shipping_address_line_1);
            setShippingAddress2(taxInvoice?.customer?.shipping_address_line_2);
            setShippingAddress3(taxInvoice?.customer?.shipping_address_line_3);
            setShippingCountry(taxInvoice?.customer?.shipping_country);
            setShippingState(taxInvoice?.customer?.shipping_state);
            setSubject(taxInvoice?.subject);
            setTermsAndConditions(taxInvoice?.terms_and_conditions);
            setIsSetDefaultTncCustomer(taxInvoice?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(taxInvoice?.is_set_default_tnc_client);
            // set payment received later
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            setTaxInvoiceNumber(number);
            setTermsAndConditions(user?.clientInfo?.terms_and_conditions);
        }
    }, [currencies, taxInvoice, number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taxInvoiceLoading) {
            return;
        }
        if (taxInvoiceNumber == "" || customerId == null || currencyConversionRate <= 0) {
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
            ti_number: taxInvoiceNumber,
            ti_date: taxInvoiceDate,
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
            attachment_url: attachmentUrl === "" ? null : attachmentUrl
        }
        if (isAdd) {
            dispatch(createTaxInvoice(data, navigate));
        }
        else {
            dispatch(updateTaxInvoice(window.location.pathname.split('/')[3], data, navigate));
        }
    }
    return (
        <>
            <div className='create__taxInvoice__header'>
                <div className='create__taxInvoice__header--left'>
                    <img src={backButton} alt='back' className='create__taxInvoice__header--back-btn' onClick={() => navigate("/tax-invoice")} />
                    <h1 className='create__taxInvoice__header--title'> Tax Invoices List </h1>
                </div>
                <div className='create__taxInvoice__header--right'>
                    <a className='create__taxInvoice__header--btn1'>Download</a>
                    <a className='create__taxInvoice__header--btn2'>Share</a>
                </div>
            </div>
            <div className="taxInvoice__container">
                <div className="create__taxInvoice--main">
                    <div className="create__taxInvoice--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__taxInvoice--head'>Tax Invoice</h1>
                    </div>
                    <form>
                        <TaxInvoiceLayoutP1 taxInvoiceNumber={taxInvoiceNumber} setTaxInvoiceNumber={setTaxInvoiceNumber}
                            taxInvoiceDate={taxInvoiceDate} setTaxInvoiceDate={setTaxInvoiceDate} validTill={validTill} setValidTill={setValidTill}
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
                        <TaxInvoiceLayoutP2 items={items} setItems={setItems} currency={currency}
                            termsAndConditions={termsAndConditions} setTermsAndConditions={setTermsAndConditions}
                            isSetDefaultTncCustomer={isSetDefaultTncCustomer} setIsSetDefaultTncCustomer={setIsSetDefaultTncCustomer}
                            isSetDefaultTncClient={isSetDefaultTncClient} setIsSetDefaultTncClient={setIsSetDefaultTncClient}
                            paymentReceived={paymentReceived} setPaymentReceived={setPaymentReceived}
                        />
                        <div className='taxInvoice__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    taxInvoiceLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="taxInvoice__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='taxInvoice__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.2rem", fontWeight: "600", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaxInvoiceLayout;
