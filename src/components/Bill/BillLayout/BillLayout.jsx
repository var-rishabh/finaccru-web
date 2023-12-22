import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import moment from 'moment';
import { getCurrency } from '../../../Actions/Onboarding';
import { getVendorDetails, calculateExpectedDeliveryDate, readPaymentTerms } from '../../../Actions/Vendor';
import { createBill, getBillDetails, getNewBillNumber, updateBill } from '../../../Actions/Bill';
import { readOpenDebitNotesForVendor } from '../../../Actions/DebitNote';
import { readOpenBillPaymentsForVendor } from '../../../Actions/BillPayment';
import { getPurchaseOrderDetails } from '../../../Actions/PurchaseOrder';
import { readAccountantClient } from '../../../Actions/Accountant';

import BillLayoutP1 from './BillLayoutP1/BillLayoutP1';
import BillLayoutP2 from './BillLayoutP2/BillLayoutP2';

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";


const BillLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
    dispatch({ type: "ClearExpectedDeliveryDate" });
    }, [dispatch]);
    // Clearing the expected delivery date from the store

    const [billNumber, setBillNumber] = useState('');
    const [billDate, setBillDate] = useState(moment().format('YYYY-MM-DD'));
    const [paymentTermId, setPaymentTermId] = useState('');

    const [currency, setCurrency] = useState('AED');
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [subject, setSubject] = useState(null);
    const [reference, setReference] = useState(null);

    const [vendorId, setVendorId] = useState(null);
    const [vendorName, setVendorName] = useState('');

    const [items, setItems] = useState([{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
    const [notes, setNotes] = useState(null);
    const [attachmentUrl, setAttachmentUrl] = useState(null);

    const [paymentReceivedValue, setPaymentReceivedValue] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [paymentList, setPaymentList] = useState([]);
    const [debitNoteList, setDebitNoteList] = useState([]);

    const [shippingAddress1, setShippingAddress1] = useState('');
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingState, setShippingState] = useState('');

    const { user } = useSelector(state => state.userReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);
    const { loading: billLoading, bill, number } = useSelector(state => state.billReducer);
    const { purchaseOrder } = useSelector(state => state.purchaseOrderReducer);

    const type = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[6] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const bill_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const isAdd = type === 'create';

    const searchParams = new URLSearchParams(window.location.search);
    const file = searchParams.get('file');
    const convert = searchParams.get('convert');
    const reference_id = searchParams.get('reference_id');
    const referenceName = searchParams.get('reference');
    const location = useLocation();

    const setPaymentOptionsNull = () => {
        setPaymentReceivedValue(null);
        setBankId(null);
        setPaymentList([]);
        setDebitNoteList([]);
    }

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getBillDetails(bill_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }

        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getNewBillNumber());
            if (convert) {
                dispatch(getPurchaseOrderDetails(reference_id));
            }
        }
        
    }, [dispatch, client_id, user?.localInfo?.role, bill_id, convert, reference_id]);
    useEffect(() => {
        if (vendorId !== null && currencyId !== null) {
            if (user?.localInfo?.role) {
                return;
            }
            dispatch(readOpenDebitNotesForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
            dispatch(readOpenBillPaymentsForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
        }
    }, [dispatch, vendorId, currencyId, user?.localInfo?.role]);
    
    useEffect(() => {
        if (type === 'edit') {
            dispatch(getVendorDetails(bill?.vendor?.vendor_id));
            dispatch(readOpenDebitNotesForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
            dispatch(readOpenBillPaymentsForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
        }
    }, [dispatch, bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id]);

    useEffect(() => {
        if (type === 'edit') {
            setBillNumber(bill?.bill_number);
            setBillDate(moment(bill?.bill_date).format('YYYY-MM-DD'));
            setReference(bill?.reference);
            setVendorName(bill?.vendor?.vendor_name);
            setVendorId(bill?.vendor?.vendor_id);
            setCurrencyId(bill?.currency_id);
            setPaymentTermId(bill?.payment_term_id);
            setCurrencyConversionRate(bill?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === bill?.currency_id)?.currency_abv : 'AED');
            setItems(bill?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(bill?.vendor?.shipping_address_line_1);
            setShippingAddress2(bill?.vendor?.shipping_address_line_2);
            setShippingAddress3(bill?.vendor?.shipping_address_line_3);
            setShippingCountry(bill?.vendor?.shipping_country);
            setShippingState(bill?.vendor?.shipping_state);
            setSubject(bill?.subject);
            setNotes(bill?.notes);

            if (bill?.linked_payments != [] || bill?.linked_debit_notes != [] > 0) {
                setPaymentReceivedValue(1);
                setPaymentList(bill?.linked_payments != [] > 0 ? bill?.linked_payments?.map((payment) => (payment.payment_id)) : []);
                setDebitNoteList(bill?.linked_debit_notes != [] > 0 ? bill?.linked_debit_notes?.map((debitNote) => (debitNote.dn_id)) : []);
            } else {
                setPaymentReceivedValue(null);
            }
            // setBankId(bill?.payment !== null ? bill?.payment?.bank_id : null);
            
            dispatch(calculateExpectedDeliveryDate(billDate, paymentTermId))
        }
        if (type === 'create') {
            setBillNumber(number);
            if (file) {
                setCurrencyConversionRate(location.state?.currency_conversion_rate);
                setCurrencyId(location.state?.currency_id);
                setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === location.state?.currency_id)?.currency_abv : 'AED');
                setItems(location.state?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
                setReference(location.state?.reference);
                setSubject(location.state?.subject);
                setBillDate(location.state?.bill_date);
                setBillNumber(location.state?.bill_number);
                setVendorId(location.state?.vendor?.vendor_id);
                setVendorName(location.state?.vendor?.vendor_name);
                setShippingAddress1(location.state?.vendor?.shipping_address_line_1);
                setShippingAddress2(location.state?.vendor?.shipping_address_line_2);
                setShippingAddress3(location.state?.vendor?.shipping_address_line_3);
                setShippingCountry(location.state?.vendor?.shipping_country);
                setShippingState(location.state?.vendor?.shipping_state);
            }
            if (convert) {
                if (referenceName == 'purchase-order') {
                    setVendorId(purchaseOrder?.vendor?.vendor_id);
                    setVendorName(purchaseOrder?.vendor?.vendor_name);
                    setCurrencyId(purchaseOrder?.currency_id);
                    setCurrencyConversionRate(purchaseOrder?.currency_conversion_rate);
                    setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === purchaseOrder?.currency_id)?.currency_abv : 'AED');
                    setItems(purchaseOrder?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
                    setReference(purchaseOrder?.po_number);
                    setSubject(purchaseOrder?.subject);
                    setPaymentTermId(purchaseOrder?.payment_term_id);
                    setShippingAddress1(purchaseOrder?.vendor?.shipping_address_line_1);
                    setShippingAddress2(purchaseOrder?.vendor?.shipping_address_line_2);
                    setShippingAddress3(purchaseOrder?.vendor?.shipping_address_line_3);
                    setShippingCountry(purchaseOrder?.vendor?.shipping_country);
                    setShippingState(purchaseOrder?.vendor?.shipping_state);
                    setNotes(purchaseOrder?.notes);
                    dispatch(calculateExpectedDeliveryDate(billDate, purchaseOrder?.payment_term_id))
                }
            }
        }
    }, [dispatch, currencies, bill, number, file, convert, referenceName, location.state, purchaseOrder]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (billLoading) {
            return;
        }
        if (billNumber == "" || vendorId == null || paymentTermId == '') {
            toast.error("Please fill and check all fields.");
            return;
        }
        if (currencyConversionRate <= 0) {
            toast.error("Currency conversion rate should be greater than 0.");
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
            vendor_id: vendorId,
            bill_number: billNumber,
            bill_date: billDate,
            payment_term_id: paymentTermId,
            subject: subject === "" ? null : subject,
            reference: reference === "" ? null : reference,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
            shipping_address_line_1: shippingAddress1,
            shipping_address_line_2: shippingAddress2 === "" ? null : shippingAddress2,
            shipping_address_line_3: shippingAddress3 === "" ? null : shippingAddress3,
            shipping_state: shippingState,
            shipping_country: shippingCountry,
            notes: notes === "" ? null : notes,
            attachment_url: attachmentUrl === "" ? null : attachmentUrl,
            payment: bankId === null ? null : {
                bank_id: bankId,
                payments_list: paymentList?.length === 0 ? [] : paymentList,
                debit_notes_list: debitNoteList?.length === 0 ? [] : debitNoteList,
            }
        }
        if (isAdd) {
            dispatch(createBill(data, navigate));
        }
        else {
            dispatch(updateBill(bill_id, data, navigate, user?.localInfo?.role));
        }
    }

    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/bill"}`)} />
                    <h1 className='layout__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Bills List'}
                    </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__layout--head'>Bill</h1>
                    </div>
                    <form>
                        <BillLayoutP1
                            billNumber={billNumber} setBillNumber={setBillNumber}
                            billDate={billDate} setBillDate={setBillDate}
                            paymentTermId={paymentTermId} setPaymentTermId={setPaymentTermId}
                            vendorName={vendorName} setVendorName={setVendorName}
                            vendorId={vendorId} setVendorId={setVendorId}
                            currency={currency} setCurrency={setCurrency} currencyId={currencyId} setCurrencyId={setCurrencyId}
                            currencyConversionRate={currencyConversionRate} setCurrencyConversionRate={setCurrencyConversionRate}
                            subject={subject} setSubject={setSubject}
                            reference={reference} setReference={setReference}
                            shippingAddress1={shippingAddress1} setShippingAddress1={setShippingAddress1}
                            shippingAddress2={shippingAddress2} setShippingAddress2={setShippingAddress2}
                            shippingAddress3={shippingAddress3} setShippingAddress3={setShippingAddress3}
                            shippingCountry={shippingCountry} setShippingCountry={setShippingCountry}
                            shippingState={shippingState} setShippingState={setShippingState}
                        />
                        <BillLayoutP2
                            currency={currency} currencies={currencies} items={items} setItems={setItems}
                            notes={notes} setNotes={setNotes}
                            bankId={bankId} setBankId={setBankId}
                            paymentList={paymentList} setPaymentList={setPaymentList}
                            debitNoteList={debitNoteList} setDebitNoteList={setDebitNoteList}
                            vendorId={vendorId}
                            paymentReceivedValue={paymentReceivedValue} setPaymentReceivedValue={setPaymentReceivedValue}
                            setPaymentOptionsNull={setPaymentOptionsNull}
                        />
                        <div className='layout__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    billLoading ? <LoadingOutlined /> : "Submit"
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

export default BillLayout;
