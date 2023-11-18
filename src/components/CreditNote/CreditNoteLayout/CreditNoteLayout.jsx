import CreditNoteLayoutP1 from './CreditNoteLayoutP1/CreditNoteLayoutP1';
import CreditNoteLayoutP2 from './CreditNoteLayoutP2/CreditNoteLayoutP2';
import { useNavigate } from 'react-router-dom';
import { createCreditNote, getCreditNoteDetails, getNewCreditNoteNumber, updateCreditNote } from '../../../Actions/CreditNote';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCurrency } from '../../../Actions/Onboarding';
import { toast } from 'react-toastify';
import moment from 'moment';

import "./CreditNoteLayout.css"
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import { getCustomerDetails } from '../../../Actions/Customer';
import { readAccountantClient } from '../../../Actions/Accountant';

const CreditNoteLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [creditNoteNumber, setCreditNoteNumber] = useState('');
    const [creditNoteDate, setCreditNoteDate] = useState(moment().format('YYYY-MM-DD'));
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

    const { user } = useSelector(state => state.userReducer);
    const { loading: creditNoteLoading, creditNote, number } = useSelector(state => state.creditNoteReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const { customer } = useSelector(state => state.customerReducer);


    const type = user?.localInfo?.role ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const cn_id = user?.localInfo?.role ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[5];
    const client_id = user?.localInfo?.role ? window.location.pathname.split('/')[2] : 0;
    const isAdd = type === 'create';
    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCurrency());
            dispatch(getCreditNoteDetails(cn_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(getNewCreditNoteNumber());
        }
    }, [dispatch]);

    useEffect(() => {
        if (type === 'edit') {
            if (user?.localInfo?.role) {
                return;
            }
            dispatch(getCustomerDetails(creditNote?.customer?.customer_id));
        }
    }, [dispatch, creditNote?.customer?.customer_id]);

    useEffect(() => {
        if (customerId === null && !user?.clientInfo?.terms_and_conditions) { setTermsAndConditions(''); return; }
        setTermsAndConditions(customer?.terms_and_conditions ? customer?.terms_and_conditions : termsAndConditions);
    }, [customer, customerId]);

    useEffect(() => {
        if (type === 'edit') {
            setCreditNoteNumber(creditNote?.cn_number);
            setCreditNoteDate(moment(creditNote?.cn_date).format('YYYY-MM-DD'));
            setValidTill(moment(creditNote?.due_date).format('YYYY-MM-DD'));
            setReference(creditNote?.reference);
            setCustomerName(creditNote?.customer?.customer_name);
            setCustomerId(creditNote?.customer?.customer_id);
            setCurrencyId(creditNote?.currency_id);
            setCurrencyConversionRate(creditNote?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv : 'AED');
            setItems(creditNote?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(creditNote?.customer?.shipping_address_line_1);
            setShippingAddress2(creditNote?.customer?.shipping_address_line_2);
            setShippingAddress3(creditNote?.customer?.shipping_address_line_3);
            setShippingCountry(creditNote?.customer?.shipping_country);
            setShippingState(creditNote?.customer?.shipping_state);
            setSubject(creditNote?.subject);
            setTermsAndConditions(creditNote?.terms_and_conditions);
            setIsSetDefaultTncCustomer(creditNote?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(creditNote?.is_set_default_tnc_client);
        }
        if (type === 'create') {
            setCreditNoteNumber(number);
            setTermsAndConditions(user?.clientInfo?.terms_and_conditions);
        }
    }, [currencies, creditNote, number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (creditNoteLoading) {
            return;
        }
        if (creditNoteNumber == "" || customerId == null || currencyConversionRate <= 0) {
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
            cn_number: creditNoteNumber,
            cn_date: creditNoteDate,
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
            dispatch(createCreditNote(data, navigate));
        }
        else {
            dispatch(updateCreditNote(cn_id, data, navigate, user?.localInfo?.role));
        }
    }
    return (
        <>
            <div className='create__creditNote__header'>
                <div className='create__creditNote__header--left'>
                    <img src={backButton} alt='back' className='create__creditNote__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role ? `/clients/${client_id}` : "/credit-note"}`)} />
                    <h1 className='create__creditNote__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Credit Notes List'}
                    </h1>
                </div>
                <div className='create__creditNote__header--right'>
                    <a className='create__creditNote__header--btn1'>Download</a>
                    <a className='create__creditNote__header--btn2'>Share</a>
                </div>
            </div>
            <div className="creditNote__container">
                <div className="create__creditNote--main">
                    <div className="create__creditNote--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__creditNote--head'>Credit Note</h1>
                    </div>
                    <form>
                        <CreditNoteLayoutP1 creditNoteNumber={creditNoteNumber} setCreditNoteNumber={setCreditNoteNumber}
                            creditNoteDate={creditNoteDate} setCreditNoteDate={setCreditNoteDate} validTill={validTill} setValidTill={setValidTill}
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
                        <CreditNoteLayoutP2 items={items} setItems={setItems} currency={currency}
                            termsAndConditions={termsAndConditions} setTermsAndConditions={setTermsAndConditions}
                            isSetDefaultTncCustomer={isSetDefaultTncCustomer} setIsSetDefaultTncCustomer={setIsSetDefaultTncCustomer}
                            isSetDefaultTncClient={isSetDefaultTncClient} setIsSetDefaultTncClient={setIsSetDefaultTncClient}
                        />
                        <div className='creditNote__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    creditNoteLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="creditNote__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='creditNote__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.2rem", fontWeight: "600", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreditNoteLayout;
