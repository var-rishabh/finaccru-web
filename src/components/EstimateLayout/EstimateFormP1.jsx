import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AddCustomerModal from '../Customer/AddCustomerModal/AddCustomerModal'
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerDetails, getCustomerInfiniteScroll } from '../../Actions/Customer';
import InfiniteScrollSelect from './InfiniteScrollSelect';

import { Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const EstimateFormP1 = ({ estimateNumber, estimateDate, validTill, reference, customerName, customerId, currency, currencyId, currencyConversionRate, setEstimateNumber, setEstimateDate, setValidTill, setReference, setCustomerName, setCustomerId, setCurrency, setCurrencyId, setCurrencyConversionRate }) => {
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const { user } = useSelector(state => state.userReducer);
    const { loading: customerLoading, customersInf, totalCustomers, customer } = useSelector(state => state.customerReducer);
    const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
    }, [dispatch]);

    const showModal = () => {
        setIsModalOpen(true);
        setCurrencyId('addCustomer');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);

    const onChangeCustomer = (value) => {
        if (value.customer_id === 'addCustomer') {
            showModal();
            return;
        }
        setCustomerId(value.customer_id);
        const customer = customersInf.find((customer) => customer.customer_id === value.customer_id);
        setCustomerName(customer.customer_name);
        dispatch(getCustomerDetails(value.customer_id));
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
        if ((current-1) * 20 > totalCustomers) return;
        if (currentCustomerPage >= current) return;
        dispatch(getCustomerInfiniteScroll(current, false));
        setCurrentCustomerPage((prev) => prev + 1);
    }


    return (
        <div className='estimate__form--part1'>
            <div className='estimate__form--part1-head'>
                <div className='estimate__form--head-info1'>
                    <h3>Estimate From</h3>
                    <span>{user?.clientInfo?.company_data?.company_name}</span>
                    <span>{user?.clientInfo?.company_data?.address_line_1}</span>
                    <span>{user?.clientInfo?.company_data?.address_line_2}</span>
                    <span>{user?.clientInfo?.company_data?.address_line_3}</span>
                    <span>{user?.clientInfo?.company_data?.state + ', ' + user?.clientInfo?.company_data?.country}</span>
                    <span>TRN: {user?.clientInfo?.company_data?.trade_license_number}</span>
                </div>
                <div className='estimate__form--head-info2'>
                    <div className='estimate__form--head-info2-data'>
                        <span>Estimate Number</span>
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
                        <span>Estimate Date</span>
                        <input type="date"
                            name='estimateDate'
                            value={estimateDate}
                            min="2023-01-01"
                            onChange={(e) => setEstimateDate(e.target.value)}
                        />
                    </div>
                    <div className='estimate__form--head-info2-data'>
                        <span>Valid Till</span>
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
                <h3>Estimate For</h3>
                {
                    customerName ?
                        <>
                            <CloseOutlined className='estimate__for--anticon-close' onClick={() => { setCustomerName(''); setCustomerId(null) }} />
                            <div className='estimate__form--customer-data'>
                                <span>{customerName}</span>
                                <span>{customer?.shipping_address_line_1}</span>
                                <span>{customer?.shipping_address_line_2}</span>
                                <span>{customer?.shipping_address_line_3}</span>
                                <span>{customer?.shipping_state + ', ' + customer?.shipping_country}</span>
                                <span>TRN: {customer?.trn}</span>
                            </div>
                        </>
                        : <>
                            <InfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeCustomer} />
                        </>

                }
                <AddCustomerModal isModalOpen={isModalOpen} handleCustomerSubmit={handleCustomerSubmit} handleCancel={handleCancel} />
            </div>
            <div className='estimate__form--part2-head'>
                <h3>Select Currency</h3>
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