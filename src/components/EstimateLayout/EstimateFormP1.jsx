import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerDetails, getCustomerInfiniteScroll, getShippingAddressList } from '../../Actions/Customer';
import InfiniteScrollSelect from './InfiniteScrollSelect';
import AddCustomerModal from '../Customer/AddCustomerModal/AddCustomerModal';
import AddShippingAddress from '../Customer/AddShippingAddress/AddShippingAddress';

import { Select } from 'antd';
const { Option } = Select;
import GreenCross from '../../assets/Icons/greenCross.svg'

const EstimateFormP1 = ({
    estimateNumber, estimateDate, validTill, reference, subject, customerName, customerId, currency, currencyId, currencyConversionRate, shippingAddress1, shippingAddress2, shippingAddress3, shippingState, shippingCountry,
    setEstimateNumber, setEstimateDate, setValidTill, setReference, setSubject, setCustomerName, setCustomerId, setCurrency, setCurrencyId, setCurrencyConversionRate, setShippingAddress1, setShippingAddress2, setShippingAddress3, setShippingState, setShippingCountry
}) => {
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const { user } = useSelector(state => state.userReducer);
    const { loading: customerLoading, customersInf, totalCustomers, customer } = useSelector(state => state.customerReducer);
    const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingId, setShippingId] = useState(null);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
    }, [dispatch]);

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
        dispatch(getCustomerInfiniteScroll(1, true, customerKeyword));
        setCurrentCustomerPage(1);
    }, [customerKeyword]);

    const onChangeCustomer = (value) => {
        if (value.customer_id === 'addCustomer') {
            showModal();
            return;
        }
        setCustomerId(value.customer_id);
        const customer = customersInf.find((customer) => customer.customer_id === value.customer_id);
        setCustomerName(customer.customer_name);
        dispatch(getCustomerDetails(value.customer_id));
        dispatch(getShippingAddressList(value.customer_id));
    }

    const onChangeShipping = (value) => {
        if (value === 'addShippingAddress') {
            showShippingModal();
            return;
        }
        setShippingId(value);
        // const customer = customersInf.find((customer) => customer.customer_id === value.customer_id);
        // setCustomerName(customer.customer_name);
        // dispatch(getCustomerDetails(value.customer_id));
        // dispatch(getShippingAddressList(value.customer_id));
    }

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
    }

    const handleCustomerSubmit = (data) => {
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
        dispatch(getCustomerDetails(data.customer_id));
        setCustomerId(data.customer_id);
        setCustomerName(data.customer_name);
        setIsModalOpen(false);
    }

    const addPage = (current) => {
        if (customerLoading) return;
        if ((current - 1) * 20 > totalCustomers) return;
        if (currentCustomerPage >= current) return;
        dispatch(getCustomerInfiniteScroll(current, false));
        setCurrentCustomerPage((prev) => prev + 1);
    }


    return (
        <div className='estimate__form--part1'>
            <div className='estimate__form--part1-head'>
                <div className='estimate__form--head-info1'>
                    <h3>Estimate From</h3>
                    <span style={{ fontWeight: 500 }}>{user?.clientInfo?.company_data?.company_name}</span>
                    <span>{user?.clientInfo?.company_data?.address_line_1}</span>
                    <span>{user?.clientInfo?.company_data?.address_line_2}</span>
                    <span>{user?.clientInfo?.company_data?.address_line_3}</span>
                    <span>{user?.clientInfo?.company_data?.state + ', ' + user?.clientInfo?.company_data?.country}</span>
                    <span>TRN: {user?.clientInfo?.company_data?.trade_license_number}</span>
                </div>
                <div className='estimate__form--head-info2'>
                    <div className='estimate__form--head-info2-data'>
                        <span className='required__field'>Estimate Number</span>
                        <input
                            name="estimateNumber"
                            type="text"
                            value={estimateNumber}
                            onChange={(e) => {
                                const input = e.target.value
                                setEstimateNumber("EST-" + input.substr("EST-".length))
                            }}
                        />
                    </div>
                    <div className='estimate__form--head-info2-data'>
                        <span className='required__field'>Estimate Date</span>
                        <input type="date"
                            name='estimateDate'
                            value={estimateDate}
                            min="2023-01-01"
                            onChange={(e) => setEstimateDate(e.target.value)}
                        />
                    </div>
                    <div className='estimate__form--head-info2-data'>
                        <span className='required__field'>Valid Till</span>
                        <input type="date"
                            name='validTill'
                            value={validTill}
                            min={estimateDate}
                            onChange={(e) => setValidTill(e.target.value)}
                        />
                    </div>
                    <div className='estimate__form--head-info2-data'>
                        <span>Reference</span>
                        <input type="text" name='reference' value={reference} onChange={(e) => setReference(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className='estimate__form--part2-head'>
                <div className='estimate__form--part2-head-customer'>
                    <h3 className='required__field'>Estimate For</h3>
                    {
                        customerName ?
                            <div className='estimate__form--customer-data'>
                                <div className='estimate__form--customer-data-info'>
                                    <span style={{ fontWeight: 500 }}>{customerName}</span>
                                    <span>{customer?.billing_address_line_1}</span>
                                    {customer?.billing_address_line_2 && <span>{customer?.billing_address_line_2}</span>}
                                    {customer?.billing_address_line_3 && <span>{customer?.billing_address_line_3}</span>}
                                    <span>{customer?.billing_state + ', ' + customer?.billing_country}</span>
                                    {customer?.trn && <span>TRN: {customer?.trn}</span>}
                                </div>
                                <img src={GreenCross} alt='close' className='estimate__for--anticon-close' onClick={() => { setCustomerName(''); setCustomerId(null) }} />
                            </div>
                            : <>
                                <InfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeCustomer} customerKeyword={customerKeyword} setCustomerKeyword={setCustomerKeyword} />
                            </>

                    }
                    <AddCustomerModal openingModal={true} isModalOpen={isModalOpen} handleCustomerSubmit={handleCustomerSubmit} handleCancel={handleCancel} />
                </div>
                <div className='estimate__form--part2-head-customer second-select'>
                    {
                        customerId ?
                            <>
                                <h3 className='required__field'>Shipping Address</h3>
                                {
                                    shippingId ?
                                        <div className='estimate__form--customer-data'>
                                            <div className='estimate__form--customer-data-info'>
                                                <span style={{ fontWeight: 500 }}>{customerName}</span>
                                                <span>{customer?.billing_address_line_1}</span>
                                                {customer?.billing_address_line_2 && <span>{customer?.billing_address_line_2}</span>}
                                                {customer?.billing_address_line_3 && <span>{customer?.billing_address_line_3}</span>}
                                                <span>{customer?.billing_state + ', ' + customer?.billing_country}</span>
                                                {customer?.trn && <span>TRN: {customer?.trn}</span>}
                                            </div>
                                            <img src={GreenCross} alt='close' className='estimate__for--anticon-close' onClick={() => { setCustomerName(''); setCustomerId(null) }} />
                                        </div>
                                        : <>
                                            <Select
                                                showSearch
                                                placeholder='Select Shipping Address'
                                                optionFilterProp='children'
                                                value={shippingId}
                                                onChange={onChangeShipping}
                                                filterOption={filterOption}
                                            >
                                                <Option style={{ fontWeight: 600 }} key="addShippingAddress" value="addShippingAddress">
                                                    Add Shipping Address
                                                </Option>
                                                {
                                                    shippingAddresses?.map((address) => (
                                                        <Option style={{ fontWeight: 400, height: 'max-content' }} key={address.shipping_address_id} value={address.shipping_address_id}>
                                                            {address.address_line_1}, <br/> 
                                                            {address.address_line_2 ? address.address_line_2 + ", " : "" } {address.address_line_3 ? address.address_line_3 + ", " : ""}
                                                            {address.address_line_2 ? <br/> : ""}
                                                            {address.state}, {address.country}
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        </>
                                }
                                <AddShippingAddress isShippingModalOpen={isShippingModalOpen} handleCustomerSubmit={handleCustomerSubmit} handleShippingCancel={handleShippingCancel} />
                            </> : <></>

                    }
                </div>
            </div>
            <div className='estimate__form--part3-head'>
                <h3 className='required__field'>Select Currency</h3>
                <div className='estimate__form--currency'>
                    <div className='estimate__form--select-currency'>
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
                    <div className='estimate__form--currency-conversion'>
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
        </div>
    )
}

export default EstimateFormP1;