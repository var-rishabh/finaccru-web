import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateExpectedDeliveryDate, getVendorDetails, getVendorInfiniteScroll } from '../../../../Actions/Vendor';
import { getVendorShippingAddressList } from '../../../../Actions/Vendor';

import VendorInfiniteScrollSelect from '../../../Vendor/VendorInfiniteScrollSelect/VendorInfiniteScrollSelect';
import AddVendorModal from '../../../Vendor/AddVendorModal/AddVendorModal';
import AddVendorShippingAddress from '../../../Vendor/AddVendorShippingAddress/AddVendorShippingAddress';

import "../../../../Styles/Layout/LayoutP1.css";
import "../../../../Styles/PurchaseLayoutSelectP1.css";
import { Select, Input } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment/moment';

const BillLayoutP1 = ({
    billNumber, setBillNumber,
    billDate, setBillDate, paymentTermId, setPaymentTermId,
    vendorName, setVendorName, vendorId, setVendorId,
    currency, setCurrency, currencyId, setCurrencyId,
    currencyConversionRate, setCurrencyConversionRate,
    subject, setSubject, shippingAddress1, setShippingAddress1,
    shippingAddress2, setShippingAddress2, shippingAddress3, setShippingAddress3,
    shippingState, setShippingState, shippingCountry, setShippingCountry,
}) => {
    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }
    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { bill } = useSelector(state => state.billReducer)
    const { loading: vendorLoading, vendorsInf, totalVendors, vendor, paymentTerms, paymentTermsLoading, expectedDeliveryDate } = useSelector(state => state.vendorReducer);

    const [currentVendorPage, setCurrentVendorPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingId, setShippingId] = useState(null);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [shippingLabel, setShippingLabel] = useState(null);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getVendorInfiniteScroll(1, true));
        setCurrentVendorPage(1);
    }, [dispatch]);

    useEffect(() => {
        if (vendorId) {
            dispatch(getVendorDetails(vendorId));
            dispatch(getVendorShippingAddressList(vendorId));
        }
    }, [vendorId, dispatch]);

    const showModal = () => {
        setIsModalOpen(true);
        vendorId('addVendor');
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

    const handlePaymentTermChange = (value) => {
        setPaymentTermId(value);
        dispatch(calculateExpectedDeliveryDate(billDate, value));
    }

    useEffect(() => {
        if (paymentTermId === null) return;
        dispatch(calculateExpectedDeliveryDate(billDate, paymentTermId));
    }, [dispatch, billDate, paymentTermId]);

    const { shippingAddresses } = useSelector(state => state.vendorReducer);

    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const [vendorKeyword, setVendorKeyword] = useState(null);

    useEffect(() => {
        if (vendorKeyword === null) return;
        dispatch(getVendorInfiniteScroll(1, true, vendorKeyword));
        setCurrentVendorPage(1);
    }, [vendorKeyword, dispatch]);

    const onChangeVendor = (value) => {
        if (value.vendor_id === 'addVendor') {
            showModal();
            return;
        }
        setVendorId(value.vendor_id);
        const vendorSelected = vendorsInf.find((vendor) => {
            return vendor.vendor_id === value.vendor_id;
        });
        setVendorName(vendorSelected.vendor_name);
        dispatch(getVendorDetails(value.vendor_id));
        dispatch(getVendorShippingAddressList(value.vendor_id));
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

    const handleVendorSubmit = (data) => {
        setIsModalOpen(false);
        dispatch(getVendorInfiniteScroll(1, true));
        setCurrentVendorPage(1);
        dispatch(getVendorDetails(data.vendor_id));
        setVendorId(data.vendor_id);
        setVendorName(data.vendor_name);
        dispatch(getVendorShippingAddressList(data.vendorId));
    }

    const handleAddVendorShippingAddressSubmit = (data) => {
        dispatch(getVendorShippingAddressList(vendorId));
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
        if (vendorLoading) return;
        if ((current - 1) * 20 > totalVendors) return;
        if (currentVendorPage >= current) return;
        dispatch(getVendorInfiniteScroll(current, false));
        setCurrentVendorPage((prev) => prev + 1);
    }

    return (
        <div className='layout__form--part1'>
            <div className='layout__form--part1-head'>
                <div className='layout__form--head-info1'>
                    <h3>Bill From</h3>
                    <span style={{ fontWeight: 500 }}>{user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}</span>
                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}</span>
                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2}</span>
                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3}</span>
                    <span>{user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state + ', ' + user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}</span>
                    <span>TRN: {user?.localInfo?.role ? client?.company_data?.trade_license_number : user?.clientInfo?.company_data?.trade_license_number}</span>
                </div>
                <div className='layout__form--head-info2'>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Bill Number</span>
                        <input
                            className='purchase__terms'
                            name="billNumber"
                            type="text"
                            value={billNumber}
                            onChange={(e) => {
                                const input = e.target.value
                                setBillNumber("BILL-" + input.substr("BILL-".length))
                            }}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Bill Date</span>
                        <input
                            className='purchase__terms'
                            type="date"
                            name='billDate'
                            value={billDate}
                            min="2023-01-01"
                            onChange={(e) => {
                                setBillDate(e.target.value)
                                dispatch(calculateExpectedDeliveryDate(billDate, paymentTermId));
                            }}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Payment Term</span>
                        <select
                            loading={paymentTermsLoading}
                            value={paymentTermId}
                            onChange={(e) => handlePaymentTermChange(e.target.value)}
                        >
                            <option disabled={true} value="">Select Payment Term</option>
                            {
                                paymentTerms?.map((term) => (
                                    <option key={term.term_id} value={term.term_id}>{term.description}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Expected Date</span>
                        <input
                            className='purchase__terms'
                            type="select"
                            name='expectedDate'
                            value={moment(expectedDeliveryDate).format('DD / MM / YYYY')}
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className='layout__form--part2-head'>
                <div className='layout__form--part2-head-customer'>
                    <h3 className='required__field'>Bill For</h3>
                    {
                        vendorName ?
                            <div className='layout__form--customer-data'>
                                <div className='layout__form--customer-data-info'>
                                    <span style={{ fontWeight: 500 }}>{vendorName}</span>
                                    {user?.localInfo?.role ?
                                        <>
                                            <span>{bill?.vendor?.billing_address_line_1}</span>
                                            {bill?.vendor?.billing_address_line_2 && <span>{bill?.vendor?.billing_address_line_2}</span>}
                                            {bill?.vendor?.billing_address_line_3 && <span>{bill?.vendor?.billing_address_line_3}</span>}
                                            {bill?.vendor?.billing_state && <span>{bill?.vendor?.billing_state + ', ' + bill?.vendor?.billing_country}</span>}
                                            {bill?.vendor?.trn && <span>TRN: {bill?.vendor?.trn}</span>}
                                        </>
                                        :
                                        <>
                                            <span>{vendor?.billing_address_line_1}</span>
                                            {vendor?.billing_address_line_2 && <span>{vendor?.billing_address_line_2}</span>}
                                            {vendor?.billing_address_line_3 && <span>{vendor?.billing_address_line_3}</span>}
                                            {vendor?.billing_state && <span>{vendor?.billing_state + ', ' + vendor?.billing_country}</span>}
                                            {vendor?.trn && <span>TRN: {vendor?.trn}</span>}
                                        </>
                                    }
                                </div>
                                {!user?.localInfo?.role && <CloseOutlined className='layout__for--anticon-close'
                                    onClick={() => {
                                        setVendorName(''); setVendorId(null); setShippingId(null);
                                        setShippingAddress1(null);
                                        setVendorKeyword("");
                                    }}
                                />}
                            </div>
                            : <VendorInfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeVendor} vendorKeyword={vendorKeyword} setVendorKeyword={setVendorKeyword} scrollFor="createPO" />

                    }
                    <AddVendorModal isModalOpen={isModalOpen} handleVendorSubmit={handleVendorSubmit} handleCancel={handleCancel} />
                </div>
                <div className='layout__form--part2-head-customer second-select'>
                    {
                        vendorId ?
                            <>
                                <h3 className='required__field'>Shipping Address</h3>
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
                                            {!user?.localInfo?.role && <CloseOutlined className='layout__for--anticon-close'
                                                onClick={() => {
                                                    setShippingId(null); setShippingAddress1(null);
                                                    setShippingAddress2(null); setShippingAddress3(null);
                                                    setShippingState(null); setShippingCountry(null);
                                                    setShippingLabel(null);
                                                    dispatch(getVendorShippingAddressList(vendorId))
                                                }}
                                            />}
                                        </div>
                                        : <Select
                                            // showSearch
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
                                }
                                <AddVendorShippingAddress isShippingModalOpen={isShippingModalOpen} handleAddVendorShippingAddressSubmit={handleAddVendorShippingAddressSubmit} handleShippingCancel={handleShippingCancel} vendorId={vendorId} />
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

export default BillLayoutP1;
