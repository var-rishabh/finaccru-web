import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import moment from 'moment';
import { createTaxInvoice, getTaxInvoiceDetails, getNewTaxInvoiceNumber, updateTaxInvoice } from '../../../Actions/TaxInvoice';
import { getCurrency } from '../../../Actions/Onboarding';
import { getCustomerDetails } from '../../../Actions/Customer';
import { getEstimateDetails } from '../../../Actions/Estimate';
import { getProformaDetails } from '../../../Actions/Proforma';
import { readOpenCreditNotesForCustomer } from '../../../Actions/CreditNote';
import { readOpenPaymentsForCustomer } from '../../../Actions/Payment';
import { readAccountantClient } from '../../../Actions/Accountant';

import TaxInvoiceLayoutP1 from './TaxInvoiceLayoutP1/TaxInvoiceLayoutP1';
import TaxInvoiceLayoutP2 from './TaxInvoiceLayoutP2/TaxInvoiceLayoutP2';

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"

const TaxInvoiceLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [taxInvoiceNumber, setTaxInvoiceNumber] = useState('');
    const [taxInvoiceDate, setTaxInvoiceDate] = useState(moment().format('YYYY-MM-DD'));
    const [validTill, setValidTill] = useState(moment().format('YYYY-MM-DD'));
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
    const [attachmentUrl, setAttachmentUrl] = useState(null);
    const [paymentReceivedValue, setPaymentReceivedValue] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [paymentList, setPaymentList] = useState([]);
    const [creditNoteList, setCreditNoteList] = useState([]);

    const setPaymentOptionsNull = () => {
        setPaymentReceivedValue(2);
        setBankId(null);
        setPaymentList([]);
        setCreditNoteList([]);
    }

    const { user } = useSelector(state => state.userReducer);

    const type = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[6] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const ti_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;
    const isAdd = type === 'create';

    const { loading: taxInvoiceLoading, taxInvoice, number } = useSelector(state => state.taxInvoiceReducer);
    const { estimate } = useSelector(state => state.estimateReducer);
    const { proforma } = useSelector(state => state.proformaReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);
    const { customer } = useSelector(state => state.customerReducer);

    const searchParams = new URLSearchParams(window.location.search);
    const file = searchParams.get('file');
    const convert = searchParams.get('convert');
    const reference_id = searchParams.get('reference_id');
    const referenceName = searchParams.get('reference');
    const location = useLocation();

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCurrency());
            dispatch(getTaxInvoiceDetails(ti_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(getNewTaxInvoiceNumber());
            if (convert) {
                if (referenceName == 'estimate') {
                    dispatch(getEstimateDetails(reference_id));
                }
                if (referenceName == 'proforma') {
                    dispatch(getProformaDetails(reference_id));
                }
            }
        }
    }, [dispatch, file, convert, reference_id, referenceName, ti_id, type, user?.localInfo?.role, client_id]);

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCustomerDetails(taxInvoice?.customer?.customer_id));
            dispatch(readOpenCreditNotesForCustomer(taxInvoice?.customer?.customer_id, taxInvoice?.currency_id, user?.localInfo?.role, client_id));
            dispatch(readOpenPaymentsForCustomer(taxInvoice?.customer?.customer_id, taxInvoice?.currency_id, user?.localInfo?.role, client_id));
        }
    }, [dispatch, taxInvoice?.customer?.customer_id, taxInvoice?.currency_id, type, user?.localInfo?.role, client_id]);

    useEffect(() => {
        if (customerId === null && !user?.clientInfo?.terms_and_conditions) { setTermsAndConditions(''); return; }
        setTermsAndConditions(customer?.terms_and_conditions ? customer?.terms_and_conditions : termsAndConditions);
    }, [customer, customerId, termsAndConditions, user?.clientInfo?.terms_and_conditions]);

    useEffect(() => {
        if (customerId !== null && currencyId !== null) {
            if (user?.localInfo?.role) {
                return;
            }
            dispatch(readOpenCreditNotesForCustomer(customerId, currencyId));
            dispatch(readOpenPaymentsForCustomer(customerId, currencyId));
        }
    }, [dispatch, customerId, currencyId, user?.localInfo?.role]);

    useEffect(() => {
        if (type === 'edit') {
            setTaxInvoiceNumber(taxInvoice?.ti_number);
            setTaxInvoiceDate(moment(taxInvoice?.ti_date).format('YYYY-MM-DD'));
            setValidTill(moment(taxInvoice?.due_date).format('YYYY-MM-DD'));
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
            setPaymentReceivedValue(taxInvoice?.payment === null ? 2 : 1);
            setBankId(taxInvoice?.payment !== null ? taxInvoice?.payment?.bank_id : null);
            setPaymentList(taxInvoice?.payment !== null ? taxInvoice?.linked_receipts?.map((receipt) => (receipt.receipt_id)) : []);
            setCreditNoteList(taxInvoice?.payment !== null ? taxInvoice?.linked_credit_notes?.map((creditNote) => (creditNote.cn_id)) : []);
        }
        if (type === 'create') {
            setTaxInvoiceNumber(number);
            setTermsAndConditions(user?.clientInfo?.terms_and_conditions);
            if (file) {
                setCurrencyConversionRate(location.state?.currency_conversion_rate);
                setCurrencyId(location.state?.currency_id);
                setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === location.state?.currency_id)?.currency_abv : 'AED');
                setItems(location.state?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
                setReference(location.state?.reference);
                setSubject(location.state?.subject);
                setTermsAndConditions(location.state?.terms_and_conditions);
                setTaxInvoiceDate(location.state?.ti_date);
                setValidTill(location.state?.due_date);
                setTaxInvoiceNumber(location.state?.ti_number);
                setCustomerId(location.state?.customer?.customer_id);
                setCustomerName(location.state?.customer?.customer_name);
                setShippingAddress1(location.state?.customer?.shipping_address_line_1);
                setShippingAddress2(location.state?.customer?.shipping_address_line_2);
                setShippingAddress3(location.state?.customer?.shipping_address_line_3);
                setShippingCountry(location.state?.customer?.shipping_country);
                setShippingState(location.state?.customer?.shipping_state);
            }
            if (convert) {
                if (referenceName == 'estimate') {
                    setCurrencyConversionRate(estimate?.currency_conversion_rate);
                    setCurrencyId(estimate?.currency_id);
                    setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === estimate?.currency_id)?.currency_abv : 'AED');
                    setItems(estimate?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
                    setReference(estimate?.estimate_number);
                    setSubject(estimate?.subject);
                    setTermsAndConditions(estimate?.terms_and_conditions);
                    setCustomerId(estimate?.customer?.customer_id);
                    setCustomerName(estimate?.customer?.customer_name);
                    setShippingAddress1(estimate?.customer?.shipping_address_line_1);
                    setShippingAddress2(estimate?.customer?.shipping_address_line_2);
                    setShippingAddress3(estimate?.customer?.shipping_address_line_3);
                    setShippingCountry(estimate?.customer?.shipping_country);
                    setShippingState(estimate?.customer?.shipping_state);
                }
                if (referenceName == 'proforma') {
                    setCurrencyConversionRate(proforma?.currency_conversion_rate);
                    setCurrencyId(proforma?.currency_id);
                    setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv : 'AED');
                    setItems(proforma?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
                    setReference(proforma?.pi_number);
                    setSubject(proforma?.subject);
                    setTermsAndConditions(proforma?.terms_and_conditions);
                    setCustomerId(proforma?.customer?.customer_id);
                    setCustomerName(proforma?.customer?.customer_name);
                    setShippingAddress1(proforma?.customer?.shipping_address_line_1);
                    setShippingAddress2(proforma?.customer?.shipping_address_line_2);
                    setShippingAddress3(proforma?.customer?.shipping_address_line_3);
                    setShippingCountry(proforma?.customer?.shipping_country);
                    setShippingState(proforma?.customer?.shipping_state);
                }
            }
        }
    }, [currencies, taxInvoice, number, estimate, proforma, convert, reference_id, referenceName, file, location.state, user?.clientInfo?.terms_and_conditions, currencyId, type]);

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
            attachment_url: attachmentUrl === "" ? null : attachmentUrl,
            payment: bankId === null ? null : {
                bank_id: bankId,
                payments_list: paymentList?.length === 0 ? [] : paymentList,
                credit_notes_list: creditNoteList?.length === 0 ? [] : creditNoteList,
            }
        }
        if (isAdd) {
            dispatch(createTaxInvoice(data, navigate));
        }
        else {
            dispatch(updateTaxInvoice(ti_id, data, navigate, user?.localInfo?.role));
        }
    }
    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/tax-invoice"}`)} />
                    <h1 className='layout__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Tax Invoices List'}
                    </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__layout--head'>Tax Invoice</h1>
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
                            convert={convert} setPaymentOptionsNull={setPaymentOptionsNull}
                        />
                        <TaxInvoiceLayoutP2 items={items} setItems={setItems} currency={currency} currencies={currencies}
                            termsAndConditions={termsAndConditions} setTermsAndConditions={setTermsAndConditions}
                            isSetDefaultTncCustomer={isSetDefaultTncCustomer} setIsSetDefaultTncCustomer={setIsSetDefaultTncCustomer}
                            isSetDefaultTncClient={isSetDefaultTncClient} setIsSetDefaultTncClient={setIsSetDefaultTncClient}
                            bankId={bankId} setBankId={setBankId} paymentList={paymentList} setPaymentList={setPaymentList}
                            creditNoteList={creditNoteList} setCreditNoteList={setCreditNoteList}
                            customerId={customerId} paymentReceivedValue={paymentReceivedValue} setPaymentReceivedValue={setPaymentReceivedValue}
                            setPaymentOptionsNull={setPaymentOptionsNull}
                        />
                        <div className='layout__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    taxInvoiceLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="layout__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='layout__footer--text'>
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
