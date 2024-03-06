import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerDetails, getCustomerInfiniteScroll, getShippingAddressList } from '../../../../Actions/Customer';
import CustomerInfiniteScrollSelect from '../../../Customer/CustomerInfiniteScrollSelect/CustomerInfiniteScrollSelect';
import AddCustomerModal from '../../../Customer/AddCustomerModal/AddCustomerModal';
import AddShippingAddress from '../../../Customer/AddShippingAddress/AddShippingAddress';

import "../../../../Styles/Layout/LayoutP1.css";
import { Select, Input } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { CloseOutlined } from '@ant-design/icons';

const TaxInvoiceFormP1 = ({
    taxInvoiceNumber, taxInvoiceDate, validTill, reference, subject, customerName, customerId, currency, currencyId, currencyConversionRate, shippingAddress1, shippingAddress2, shippingAddress3, shippingState, shippingCountry,
    setTaxInvoiceNumber, setTaxInvoiceDate, setValidTill, setReference, setSubject, setCustomerName, setCustomerId, setCurrency, setCurrencyId, setCurrencyConversionRate, setShippingAddress1, setShippingAddress2, setShippingAddress3, setShippingState, setShippingCountry,
    termsAndConditions, setTermsAndConditions, convert, setPaymentOptionsNull, extracted,
    sameAsBillingAddress, setSameAsBillingAddress
}) => {
    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);

    const { taxInvoice } = useSelector(state => state.taxInvoiceReducer);
    const { loading: customerLoading, customersInf, totalCustomers, customer } = useSelector(state => state.customerReducer);
    const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingId, setShippingId] = useState(null);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [shippingLabel, setShippingLabel] = useState(null);
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCustomerInfiniteScroll(1, true, "", user?.localInfo?.role, client_id));
        setCurrentCustomerPage(1);
    }, [dispatch]);

    useEffect(() => {
        if (customerId) {
            dispatch(getCustomerDetails(customerId, user?.localInfo?.role));
            dispatch(getShippingAddressList(customerId, user?.localInfo?.role, client_id));
        }
    }, [customerId, dispatch]);

    const showModal = () => {
        setIsModalOpen(true);
        customerId('addCustomer');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showShippingModal = () => {
        setIsShippingModalOpen(true);
    };
    const handleShippingCancel = () => {
        setIsShippingModalOpen(false);
    };

    const { shippingAddresses } = useSelector(state => state.customerReducer);

    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const [customerKeyword, setCustomerKeyword] = useState(null);

    useEffect(() => {
        if (customerKeyword === null) return;
        dispatch(getCustomerInfiniteScroll(1, true, customerKeyword, user?.localInfo?.role, client_id));
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
        dispatch(getShippingAddressList(value.customer_id, user?.localInfo?.role, client_id));
        setPaymentOptionsNull();
        setTermsAndConditions(customer?.terms_and_conditions ? customer?.terms_and_conditions : termsAndConditions);
    }

    const onChangeShipping = (value) => {
        if (value === 'addShippingAddress') {
            showShippingModal();
            return;
        }
        setShippingId(value);
        setShippingAddress1(shippingAddresses?.find((address) => address.shipping_address_id === value)?.address_line_1);
        setShippingAddress2(shippingAddresses?.find((address) => address.shipping_address_id === value)?.address_line_2);
        setShippingAddress3(shippingAddresses?.find((address) => address.shipping_address_id === value)?.address_line_3);
        setShippingState(shippingAddresses?.find((address) => address.shipping_address_id === value)?.state);
        setShippingCountry(shippingAddresses?.find((address) => address.shipping_address_id === value)?.country);
        setShippingLabel(shippingAddresses?.find((address) => address.shipping_address_id === value)?.label);
    }

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
    }

    const handleCustomerSubmit = (data) => {
        setIsModalOpen(false);
        dispatch(getCustomerInfiniteScroll(1, true, "", user?.localInfo?.role, client_id));
        setCurrentCustomerPage(1);
        dispatch(getCustomerDetails(data.customer_id));
        setCustomerId(data.customer_id);
        setCustomerName(data.customer_name);
    }

    const handleAddShippingAddressSubmit = (data) => {
        dispatch(getShippingAddressList(customerId, user?.localInfo?.role, client_id));
        setShippingLabel(data.label);
        setShippingId(data.shipping_address_id);
        setShippingAddress1(data.address_line_1);
        setShippingAddress2(data.address_line_2);
        setShippingAddress3(data.address_line_3);
        setShippingState(data.state);
        setShippingCountry(data.country);
        setIsShippingModalOpen(false);
    }

    const addPage = (current) => {
        if (customerLoading) return;
        if ((current - 1) * 20 > totalCustomers) return;
        if (currentCustomerPage >= current) return;
        dispatch(getCustomerInfiniteScroll(current, false, "", user?.localInfo?.role, client_id));
        setCurrentCustomerPage((prev) => prev + 1);
    }


    return (
        <div className='layout__form--part1'>
            <div className='layout__form--part1-head'>
                <div className='layout__form--head-info1'>
                    {/* <h3>Tax Invoice From</h3> */}
                    <span style={{ fontWeight: 500 }}>{user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}</span>
                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}</span>
                    {
                        user?.localInfo?.role ?
                            <>
                                {client?.company_data?.address_line_2 && <span>{client?.company_data?.address_line_2}</span>}
                                {client?.company_data?.address_line_3 && <span>{client?.company_data?.address_line_3}</span>}
                            </> :
                            <>
                                {user?.clientInfo?.company_data?.address_line_2 && <span>{user?.clientInfo?.company_data?.address_line_2}</span>}
                                {user?.clientInfo?.company_data?.address_line_3 && <span>{user?.clientInfo?.company_data?.address_line_3}</span>}
                            </>
                    }
                    <span>{user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state}{', '} {user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}</span>
                    {
                        user?.localInfo?.role ?
                            <>
                                {client?.company_data?.vat_trn && <span>VAT TRN: {client?.company_data?.vat_trn}</span>}
                                {client?.company_data?.corporate_tax_trn && <span>Corporate Tax TRN: {client?.company_data?.corporate_tax_trn}</span>}
                            </> :
                            <>
                                {user?.clientInfo?.company_data?.vat_trn && <span>VAT TRN: {user?.clientInfo?.company_data?.vat_trn}</span>}
                                {user?.clientInfo?.company_data?.corporate_tax_trn && <span>Corporate Tax TRN: {user?.clientInfo?.company_data?.corporate_tax_trn}</span>}
                            </>
                    }
                </div>
                <div className='layout__form--head-info2'>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Tax Invoice Number</span>
                        <input
                            name="taxInvoiceNumber"
                            type="text"
                            value={taxInvoiceNumber}
                            onChange={(e) => {
                                const input = e.target.value
                                setTaxInvoiceNumber("INV-" + input.substr("INV-".length))
                            }}
                            {...user?.localInfo?.role && !extracted && { disabled: true }}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Tax Invoice Date</span>
                        <input type="date"
                            name='taxInvoiceDate'
                            value={taxInvoiceDate}
                            min="2023-01-01"
                            onChange={(e) => setTaxInvoiceDate(e.target.value)}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Due Date</span>
                        <input type="date"
                            name='validTill'
                            value={validTill}
                            min={taxInvoiceDate}
                            onChange={(e) => setValidTill(e.target.value)}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span>Reference</span>
                        <input type="text" name='reference' value={reference} onChange={(e) => setReference(e.target.value)} disabled={convert} />
                    </div>
                </div>
            </div>
            <div className='layout__form--part2-head'>
                <div className='layout__form--part2-head-customer'>
                    <h3 className='required__field'>Billing Address</h3>
                    {
                        customerName ?
                            <div className='layout__form--customer-data'>
                                <div className='layout__form--customer-data-info'>
                                    <span style={{ fontWeight: 500 }}>{customerName}</span>
                                    {(user?.localInfo?.role && !extracted) ?
                                        <>
                                            <span>{taxInvoice?.customer?.billing_address_line_1}</span>
                                            {taxInvoice?.customer?.billing_address_line_2 && <span>{taxInvoice?.customer?.billing_address_line_2}</span>}
                                            {taxInvoice?.customer?.billing_address_line_3 && <span>{taxInvoice?.customer?.billing_address_line_3}</span>}
                                            {taxInvoice?.customer?.billing_state && <span>{taxInvoice?.customer?.billing_state + ', ' + taxInvoice?.customer?.billing_country}</span>}
                                            {taxInvoice?.customer?.trn && <span>VAT TRN: {taxInvoice?.customer?.trn}</span>}
                                        </>
                                        :
                                        <>
                                            <span>{customer?.billing_address_line_1}</span>
                                            {customer?.billing_address_line_2 && <span>{customer?.billing_address_line_2}</span>}
                                            {customer?.billing_address_line_3 && <span>{customer?.billing_address_line_3}</span>}
                                            {customer?.billing_state && <span>{customer?.billing_state + ', ' + customer?.billing_country}</span>}
                                            {customer?.trn && <span>VAT TRN: {customer?.trn}</span>}
                                        </>
                                    }
                                </div>
                                {(!user?.localInfo?.role || extracted) && <CloseOutlined className='taxInvoice__for--anticon-close'
                                    onClick={() => {
                                        setCustomerName(''); setCustomerId(null); setShippingId(null);
                                        setShippingAddress1(null);
                                        setShippingAddress2(null);
                                        setShippingAddress3(null);
                                        setShippingState(null);
                                        setShippingCountry(null);
                                        setShippingLabel(null);
                                        setSameAsBillingAddress(false);
                                    }}
                                />}
                            </div>
                            : <>
                                <CustomerInfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeCustomer} customerKeyword={customerKeyword} setCustomerKeyword={setCustomerKeyword} />
                            </>

                    }
                    <AddCustomerModal openingModal={true} isModalOpen={isModalOpen} handleCustomerSubmit={handleCustomerSubmit} handleCancel={handleCancel} />
                </div>
                <div className='layout__form--part2-head-customer second-select'>
                    {
                        customerId ?
                            <>
                                <h3 className='required__field'>Shipping Address</h3>
                                {
                                    shippingAddress1 === null ?
                                        <div style={{ marginTop: "1rem" }} className='layout--details__modal--checkbox'>
                                            <input type="checkbox"
                                                value={sameAsBillingAddress}
                                                checked={sameAsBillingAddress}
                                                onChange={(e) => setSameAsBillingAddress(e.target.checked)}
                                            />
                                            <span
                                                style={{
                                                    opacity: sameAsBillingAddress ? '1' : '0.5'
                                                }}
                                            >
                                                Use Same as Billing Address</span>
                                        </div> : ""
                                }
                                {
                                    shippingId || shippingAddress1 ?
                                        <div className='layout__form--customer-data'>
                                            <div className='layout__form--customer-data-info'>
                                                {shippingLabel && <span style={{ fontWeight: 500 }}>{shippingLabel}</span>}
                                                <span>{shippingAddress1}</span>
                                                {shippingAddress2 && <span>{shippingAddress2}</span>}
                                                {shippingAddress3 && <span>{shippingAddress3}</span>}
                                                <span>{shippingState + ', ' + shippingCountry}</span>

                                            </div>
                                            {(!user?.localInfo?.role || extracted) &&
                                                <CloseOutlined
                                                    className='taxInvoice__for--anticon-close'
                                                    onClick={() => {
                                                        setShippingId(null); setShippingAddress1(null);
                                                        setShippingAddress2(null); setShippingAddress3(null);
                                                        setShippingState(null); setShippingCountry(null);
                                                        setShippingLabel(null);
                                                        setSameAsBillingAddress(false);
                                                        dispatch(getShippingAddressList(customerId, user?.localInfo?.role, client_id));
                                                    }}
                                                />}
                                        </div>
                                        : <>
                                            <Select
                                                // showSearch
                                                disabled={sameAsBillingAddress}
                                                placeholder='Select Shipping Address'
                                                optionFilterProp='children'
                                                value={shippingId}
                                                onChange={onChangeShipping}
                                            >
                                                <Option style={{ fontWeight: 600 }} key="addShippingAddress" value="addShippingAddress">
                                                    Add Shipping Address
                                                </Option>
                                                {
                                                    shippingAddresses?.map((address) => (
                                                        <Option key={address.shipping_address_id} value={address.shipping_address_id}>
                                                            <div style={{ whiteSpace: 'initial' }}>
                                                                {address.label ? address.label + ": " : ""} {address.address_line_1}, {address.address_line_2 ? address.address_line_2 + ", " : ""} {address.address_line_3 ? address.address_line_3 + ", " : ""} {address.state}, {address.country}
                                                            </div>
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        </>
                                }
                                <AddShippingAddress isShippingModalOpen={isShippingModalOpen} handleAddShippingAddressSubmit={handleAddShippingAddressSubmit} handleShippingCancel={handleShippingCancel} customerId={customerId} />
                            </> : <></>

                    }
                </div>
            </div>
            <div className='layout__form--part3-head'>
                <h3 className='required__field'>Select Currency</h3>
                <div className='layout__form--currency'>
                    <div className='layout__form--select-currency'>
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
                    <div className='layout__form--currency-conversion'>
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
            <div className='layout__form--part4-head'>
                <h3>Subject</h3>
                <TextArea
                    placeholder="Subject"
                    rows={1}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
        </div>
    )
}

export default TaxInvoiceFormP1;
