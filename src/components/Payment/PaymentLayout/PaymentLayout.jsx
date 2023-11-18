import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ToWords } from 'to-words';
import moment from 'moment';
import { Select, Input } from 'antd';
const { TextArea } = Input;
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';

import "./PaymentLayout.css";

import { getCurrency } from '../../../Actions/Onboarding';
import { createPayments, getPaymentsDetails, getNewPaymentsNumber, updatePayments } from '../../../Actions/Payment';
import { getCustomerDetails, getCustomerInfiniteScroll, getShippingAddressList } from '../../../Actions/Customer';
import { readOpenTaxInvoicesForCustomer } from '../../../Actions/TaxInvoice';

import CustomerInfiniteScrollSelect from '../../Customer/CustomerInfiniteScrollSelect/CustomerInfiniteScrollSelect';
import AddCustomerModal from '../../Customer/AddCustomerModal/AddCustomerModal';

import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import { readAccountantClient } from '../../../Actions/Accountant';

const PaymentLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [receiptNumber, setReceiptNumber] = useState('');
    const [receiptDate, setReceiptDate] = useState(moment().format('YYYY-MM-DD'));
    const [customerId, setCustomerId] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [bankId, setBankId] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountInWords, setTotalAmountInWords] = useState(null);
    const [reference, setReference] = useState(null);
    const [subject, setSubject] = useState(null);
    const [termsAndConditions, setTermsAndConditions] = useState(null);
    const [invoiceList, setInvoiceList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerKeyword, setCustomerKeyword] = useState(null);


    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading: paymentLoading, payment, number } = useSelector(state => state.paymentReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const { loading: customerLoading, customersInf, totalCustomers, customer } = useSelector(state => state.customerReducer);
    const { loading: taxLoading, openTaxInvoices } = useSelector(state => state.taxInvoiceReducer);


    const type = user?.localInfo?.role ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const receipt_id = user?.localInfo?.role ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role ? window.location.pathname.split('/')[2] : 0;
    const isAdd = type === 'create';

    const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
    const [currency, setCurrency] = useState('AED');

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCurrency());
            dispatch(getPaymentsDetails(receipt_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(getNewPaymentsNumber());
        }
    }, [dispatch, type, receipt_id, client_id]);

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCustomerDetails(payment?.customer?.customer_id));
            dispatch(readOpenTaxInvoicesForCustomer(payment?.customer?.customer_id, payment?.currency_id, user?.localInfo?.role));
        }
    }, [dispatch, payment]);

    useEffect(() => {
        if (type === 'edit') {
            setReceiptNumber(payment?.receipt_number);
            setReceiptDate(moment(payment?.receipt_date).format('YYYY-MM-DD'));
            setCustomerId(payment?.customer?.customer_id);
            setCustomerName(payment?.customer?.customer_name);
            setCurrencyId(payment?.currency_id);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === payment?.currency_id)?.currency_abv : 'AED');
            setCurrencyConversionRate(payment?.currency_conversion_rate);
            setBankId(payment?.bank_id);
            setTotalAmount(payment?.total_amount);
            setTotalAmountInWords(toWords.convert(payment?.total_amount ?? 0));
            setReference(payment?.reference);
            setSubject(payment?.subject);
            setInvoiceList(payment?.invoice_mappings?.map((invoice) => invoice.invoice_id));
            setTermsAndConditions(payment?.terms_and_conditions);
        }
        if (type === 'create') {
            setReceiptNumber(number);
        }
    }, [currencies, payment, number, openTaxInvoices]);

    const toWords = new ToWords({
        localeCode: 'en-US',
        converterOptions: {
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
        }
    });

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
        dispatch(readOpenTaxInvoicesForCustomer(customerId, value));
    }

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    const showModal = () => {
        setIsModalOpen(true);
        customerId('addCustomer');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (paymentLoading) {
            return;
        }
        if (receiptNumber == "" || receiptDate == null || customerId == null || currencyConversionRate <= 0 || totalAmount < 0 || bankId == null) {
            toast.error("Please fill and check all fields.");
            return;
        }
        const data = {
            customer_id: customerId,
            receipt_number: receiptNumber,
            receipt_date: receiptDate,
            invoice_list: invoiceList.length > 0 ? invoiceList : null,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            bank_id: bankId,
            total_amount: totalAmount,
            reference: reference == null ? "" : reference,
            subject: subject == null ? "" : subject,
            terms_and_conditions: termsAndConditions == null ? "" : termsAndConditions,
        }
        if (isAdd) {
            dispatch(createPayments(data, navigate));
        }
        else {
            dispatch(updatePayments(receipt_id, data, navigate, user?.localInfo?.role));
        }
    }

    const handleCustomerSubmit = (data) => {
        setIsModalOpen(false);
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
        dispatch(getCustomerDetails(data.customer_id));
        setCustomerId(data.customer_id);
        setCustomerName(data.customer_name);
        dispatch(readOpenTaxInvoicesForCustomer(data.customer_id, currencyId));
    }

    useEffect(() => {
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
    }, [dispatch]);

    useEffect(() => {
        if (customerKeyword === null) return;
        dispatch(getCustomerInfiniteScroll(1, true, customerKeyword));
        setCurrentCustomerPage(1);
    }, [customerKeyword, dispatch]);

    const onChangeCustomer = (value) => {
        if (value.customer_id === 'addCustomer') {
            showModal();
            return;
        }
        setCustomerId(value.customer_id);
        const customerSelected = customersInf.find((customer) => {
            return customer.customer_id === value.customer_id;
        });
        setCustomerName(customerSelected.customer_name);
        dispatch(getCustomerDetails(value.customer_id));
        dispatch(getShippingAddressList(value.customer_id));
        dispatch(readOpenTaxInvoicesForCustomer(value.customer_id, currencyId));
    }

    const addPage = (current) => {
        if (customerLoading) return;
        if ((current - 1) * 20 > totalCustomers) return;
        if (currentCustomerPage >= current) return;
        dispatch(getCustomerInfiniteScroll(current, false));
        setCurrentCustomerPage((prev) => prev + 1);
    }

    return (
        <>
            <div className='create__payment__header'>
                <div className='create__payment__header--left'>
                    <img src={backButton} alt='back' className='create__payment__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role ? `/clients/${client_id}` : "/payment"}`)} />
                    <h1 className='create__payment__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Payments List'}
                    </h1>
                </div>
            </div>
            <div className="payment__container">
                <div className="create__payment--main">
                    <div className="create__payment--top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                        <h1 className='create__payment--head'>Receipt</h1>
                    </div>
                    <form>
                        <div className='payment__form--part1'>
                            <div className='payment__form--part1-head'>
                                <div className='payment__form--head-info1'>
                                    <h3>Receipt From</h3>
                                    <span style={{ fontWeight: 500 }}>{user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}</span>
                                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}</span>
                                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2}</span>
                                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3}</span>
                                    <span>{user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state + ', ' + user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}</span>
                                    <span>TRN: {user?.localInfo?.role ? client?.company_data?.trade_license_number : user?.clientInfo?.company_data?.trade_license_number}</span>
                                </div>
                                <div className='payment__form--head-info2'>
                                    <div className='payment__form--head-info2-data'>
                                        <span className='required__field'>Receipt Number</span>
                                        <input
                                            name="receiptNumber"
                                            type="text"
                                            value={receiptNumber}
                                            onChange={(e) => {
                                                const input = e.target.value
                                                setReceiptNumber("RC-" + input.substr("RC-".length))
                                            }}
                                            {...user?.localInfo?.role && { disabled: true }}
                                        />
                                    </div>
                                    <div className='payment__form--head-info2-data'>
                                        <span className='required__field'>Receipt Date</span>
                                        <input type="date"
                                            name='receiptDate'
                                            value={receiptDate}
                                            defaultValue={receiptDate}
                                            onChange={(e) => setReceiptDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='payment__form--part2-head'>
                                <div className='payment__form--part2-head-customer'>
                                    <h3 className='required__field'>Receipt For</h3>
                                    {
                                        customerName ?
                                            <div className='payment__form--customer-data'>
                                                <div className='payment__form--customer-data-info'>
                                                    <span style={{ fontWeight: 500 }}>{customerName}</span>
                                                    {user?.localInfo?.role ?
                                                        <>
                                                            <span>{payment?.customer?.billing_address_line_1}</span>
                                                            {payment?.customer?.billing_address_line_2 && <span>{payment?.customer?.billing_address_line_2}</span>}
                                                            {payment?.customer?.billing_address_line_3 && <span>{payment?.customer?.billing_address_line_3}</span>}
                                                            {payment?.customer?.billing_state && <span>{payment?.customer?.billing_state + ', ' + payment?.customer?.billing_country}</span>}
                                                            {payment?.customer?.trn && <span>TRN: {payment?.customer?.trn}</span>}
                                                        </>
                                                        :
                                                        <>
                                                            <span>{customer?.billing_address_line_1}</span>
                                                            {customer?.billing_address_line_2 && <span>{customer?.billing_address_line_2}</span>}
                                                            {customer?.billing_address_line_3 && <span>{customer?.billing_address_line_3}</span>}
                                                            {customer?.billing_state && <span>{customer?.billing_state + ', ' + customer?.billing_country}</span>}
                                                            {customer?.trn && <span>TRN: {customer?.trn}</span>}
                                                        </>
                                                    }
                                                </div>
                                                {!user?.localInfo?.role && <CloseOutlined className='payment__for--anticon-close'
                                                    onClick={() => {
                                                        setCustomerName(''); setCustomerId(null);
                                                    }}
                                                />}
                                            </div>
                                            :
                                            <CustomerInfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeCustomer} customerKeyword={customerKeyword} setCustomerKeyword={setCustomerKeyword} />
                                    }
                                    <AddCustomerModal openingModal={true} isModalOpen={isModalOpen} handleCustomerSubmit={handleCustomerSubmit} handleCancel={handleCancel} />
                                </div>
                                <div className='payment__form--part2-head-customer second-select'>
                                    {
                                        customerId ?
                                            <>
                                                <h3 className='required__field'>Open Invoices</h3>
                                                <div className='payment__table--customer-data'>
                                                    <div className='payment__table--customer-data-head'>
                                                        <div>
                                                            <span style={{ fontWeight: 500 }}>Invoice Number</span>
                                                        </div>
                                                        <span style={{ fontWeight: 500 }}>Balance Due</span>
                                                    </div>
                                                    <div className='payment__table--customer-data-inof-head'>
                                                        {
                                                            openTaxInvoices?.length > 0 ?
                                                                taxLoading ? <LoadingOutlined /> :
                                                                    openTaxInvoices?.map((invoice) => (
                                                                        <div className='payment__table--customer-data-info' key={invoice?.invoice_id}>
                                                                            <div>
                                                                                <input
                                                                                    className='margin-right-07'
                                                                                    type="checkbox"
                                                                                    checked={invoiceList?.find((invoiceId) => invoiceId === invoice?.invoice_id) ? true : false}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.checked) {
                                                                                            setInvoiceList((prev) => prev?.concat(invoice?.invoice_id));
                                                                                        }
                                                                                        else {
                                                                                            setInvoiceList((prev) => prev.filter((invoiceId) => invoiceId !== invoice?.invoice_id));
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <span>{invoice?.invoice_number}</span>
                                                                            </div>
                                                                            <span>
                                                                                {currencies?.find((currency) => currency.currency_id === invoice?.currency_id)?.currency_abv} &nbsp;
                                                                                {invoice?.balance_due}
                                                                            </span>
                                                                        </div>
                                                                    )) :
                                                                <span className='no_data_present'>No open invoices</span>
                                                        }
                                                    </div>
                                                </div>
                                            </> : <></>
                                    }
                                </div>
                            </div>
                            <div className='payment__form--part3-head'>
                                <h3 className='required__field'>Select Currency</h3>
                                <div className='payment__form--currency'>
                                    <div className='payment__form--select-currency'>
                                        <Select
                                            showSearch
                                            defaultValue="AED"
                                            optionFilterProp='children'
                                            value={currency}
                                            onChange={onChangeCurrency}
                                            filterOption={filterOption}
                                            options={currencies?.map((currency) => ({ value: currency.currency_id, label: currency.currency_abv }))}
                                            loading={currencyLoading}
                                        />
                                    </div>
                                    <div className='payment__form--currency-conversion'>
                                        <span>1</span>
                                        <span>{currency} =</span>
                                        <input
                                            type="number"
                                            value={currencyConversionRate}
                                            onChange={(e) => {
                                                const valid = e.target.value.match(/^\d*\.?\d{0,4}$/);
                                                if (valid) {
                                                    setCurrencyConversionRate(e.target.value)
                                                }
                                            }}
                                        />
                                        <span>AED</span>
                                    </div>
                                </div>
                            </div>
                            <div className='payment__form--part4-head-split'>
                                <div className='payment__form--part4-head receipt-amount1'>
                                    <h3 className='required__field'>Amount Received</h3>
                                    <Input
                                        placeholder="Amount Received"
                                        className='payment__form--part4-head-input'
                                        value={totalAmount}
                                        onChange={(e) => {
                                            const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                            if (valid) {
                                                setTotalAmount(e.target.value);
                                                if (e.target.value == '') setTotalAmountInWords(null);
                                                setTotalAmountInWords(toWords.convert(e.target.value));
                                            }
                                        }}
                                    />
                                </div>
                                <div className='payment__form--part4-head receipt-amount2'>
                                    <h3>Amount Received (in words)</h3>
                                    <TextArea
                                        placeholder="Amount Received (in words)"
                                        rows={1}
                                        value={totalAmountInWords}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className='payment__form--part4-head'>
                                <h3 className='bottom-padding-05 required__field'>Payment Method</h3>
                                <Select
                                    defaultValue={bankId}
                                    value={bankId}
                                    placeholder='Select Payment Method'
                                    onChange={(e) => setBankId(e)}
                                    options={[
                                        { value: 0, label: 'Cash' },
                                        { value: user?.clientInfo?.primary_bank?.bank_id, label: user?.clientInfo?.primary_bank?.bank_name },
                                        ...(user?.clientInfo?.other_bank_accounts?.map((bank) => ({ value: bank.bank_id, label: bank.bank_name })) ?? [])
                                    ]}
                                    disabled={user?.localInfo?.role ? true : false}
                                />
                            </div>
                            <div className='payment__form--part4-head bottom-margin-3'>
                                <h3>Subject</h3>
                                <TextArea
                                    placeholder="Subject"
                                    rows={1}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='payment__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    paymentLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="payment__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='payment__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.2rem", fontWeight: "600", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentLayout;
