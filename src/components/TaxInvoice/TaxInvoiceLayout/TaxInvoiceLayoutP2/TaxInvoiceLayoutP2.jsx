import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUnit } from '../../../../Actions/Unit';
import { getTaxRate } from '../../../../Actions/Onboarding';
import calculateTotalAmounts from '../../../../utils/calculateTotalAmounts';

import { PlusOutlined } from '@ant-design/icons';
import MinusIcon from '../../../../assets/Icons/minus.svg'
import { Input, Select, AutoComplete, Radio } from 'antd';
import { useParams } from 'react-router-dom';
const { TextArea } = Input;
const { Option } = Select;

const TaxInvoiceFormP2 = ({
    items, setItems, currency, currencies, termsAndConditions, setTermsAndConditions, bankId, paymentList, creditNoteList, customerId, paymentReceivedValue,
    isSetDefaultTncCustomer, setIsSetDefaultTncCustomer, isSetDefaultTncClient, setIsSetDefaultTncClient, setBankId, setPaymentList, setCreditNoteList, setPaymentReceivedValue
}) => {
    const { units, loading: unitLoading } = useSelector(state => state.unitReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);
    const { openPayments } = useSelector(state => state.paymentReducer);
    const { openCreditNotes } = useSelector(state => state.creditNoteReducer);
    const { client_id } = useParams();
    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const [showDescription, setShowDescription] = useState([]);

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [allUnits, setAllUnits] = useState([]);

    const onChangePaymentReceived = (e) => {
        setPaymentReceivedValue(e.target.value);
        setBankId(null);
        setPaymentList([]);
        setCreditNoteList([]);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUnit(user?.localInfo?.role, client_id));
        dispatch(getTaxRate());
    }, [dispatch, customerId]);

    useEffect(() => {
        setAllUnits(units);
    }, [units, unitLoading]);

    const handleUnitSearch = (value) => {
        let res = [];
        if (!value || value.indexOf('@') >= 0) {
            res = units;
        } else {
            res = units?.filter((unit) => unit.unit_name.toLowerCase().includes(value.toLowerCase()));
        }
        setAllUnits(res);
    };

    const handleInputChange = (index, key, value) => {
        const updatedItems = items?.map((item) => ({ ...item }));
        updatedItems[index][key] = value;
        setItems(updatedItems);
    };

    const handleAddDescription = (index, event) => {
        event.preventDefault();
        const updatedShowDescription = [...showDescription];
        updatedShowDescription[index] = true;
        setShowDescription(updatedShowDescription);
    };

    const handleRemoveDescription = (index, e) => {
        e.preventDefault();
        const updatedShowDescription = [...showDescription];
        updatedShowDescription[index] = false;
        setShowDescription(updatedShowDescription);
        const updatedItems = [...items];
        updatedItems[index].description = '';
        setItems(updatedItems);
    };

    const handleAddPerson = (event) => {
        event.preventDefault();
        setItems([...items, { item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
        setShowDescription([...showDescription, false]);
    };

    const handleRemovePerson = (index, event) => {
        event.preventDefault();
        const updatedItems = items.filter((_, i) => i !== index);
        const updatedShowDescription = showDescription.filter((_, i) => i !== index);
        setItems(updatedItems);
        setShowDescription(updatedShowDescription);
    };

    useEffect(() => {
        const amount = calculateTotalAmounts(items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
    }, [items, taxRates]);



    return (
        <>
            <div className='taxInvoice__items'>
                {items?.map((item, index) => (
                    <div className='taxInvoice__items--main' key={index}>
                        <div className='taxInvoice__items--whole-item'>
                            <div className='taxInvoice__items--itemName'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem' }}>Item Name</span> : <></>}
                                <Input
                                    type='text'
                                    placeholder='Item Name'
                                    value={item?.item_name}
                                    defaultValue={item?.item_name}
                                    style={{
                                        width: 110,
                                    }}
                                    onChange={(e) => handleInputChange(index, 'item_name', e.target.value)}
                                />
                            </div>
                            <div className='taxInvoice__items--unitSelect'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                <AutoComplete
                                    options={allUnits?.map((unit) => ({
                                        label: unit.unit_name,
                                        value: unit.unit_name,
                                    }))
                                    }
                                    style={{
                                        width: 100,
                                    }}
                                    value={item?.unit}
                                    defaultValue={item?.unit}
                                    onSearch={handleUnitSearch}
                                    onChange={(value) => handleInputChange(index, 'unit', value)}
                                    placeholder="Unit"
                                />
                            </div>
                            <div className='taxInvoice__items--number-item'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item?.qty}
                                    defaultValue={item?.qty}
                                    style={{
                                        width: 70
                                    }}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'qty', e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <div className='taxInvoice__items--number-item'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Rate"
                                    value={item?.rate}
                                    defaultValue={item?.rate}
                                    style={{
                                        width: 70
                                    }}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'rate', e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <div className='taxInvoice__items--discount'>
                                {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Discount</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Discount"
                                    value={item?.discount}
                                    defaultValue={item?.discount}
                                    style={{
                                        width: 100
                                    }}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(index, 'is_percentage_discount', value);
                                            }}
                                            defaultValue={item?.is_percentage_discount}
                                            value={item?.is_percentage_discount}
                                            style={{
                                                width: 40,
                                                padding: 0
                                            }}
                                        >
                                            <Option style={{ padding: '0.3rem 0rem 0.2rem 0.5rem' }} value={true}>%</Option>
                                            <Option style={{ padding: '0.5rem 0rem 0.2rem 0.7rem' }} value={false}>$</Option>
                                        </Select>
                                    }
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'discount', e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='taxInvoice__items--tax'>
                                {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Tax"
                                    value={itemTax[index]}
                                    defaultValue={itemTax[index]}
                                    disabled={true}
                                    className={item?.tax_id === 1 ? 'tax__select--standard' : 'tax__select--non-standard'}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(index, 'tax_id', value);
                                            }}
                                            defaultValue={item?.tax_id}
                                            value={item?.tax_id}
                                            loading={taxRateLoading}
                                        >
                                            {
                                                taxRates?.map((taxRate) => (
                                                    <Option key={taxRate.tax_rate_id} value={taxRate.tax_rate_id}>
                                                        {taxRate.tax_rate_name == 'Standard Rated (5%)' ? '(5%)' : taxRate.tax_rate_name}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    }
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'discount', e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='taxInvoice__items--amount'>
                                {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                <Input
                                    type='text'
                                    value={itemTotal[index] ? itemTotal[index] : 0}
                                    defaultValue={itemTotal[index] ? itemTotal[index] : 0}
                                    disabled={true}
                                    style={{
                                        width: 90
                                    }}
                                />
                            </div>
                            {items.length > 1 && (
                                <div className='taxInvoice__items--sr'>
                                    {index === 0 ? <span style={{ marginBottom: '1rem' }}>&nbsp;</span> : <></>}
                                    <div className='taxInvoice--cancel-icon'>
                                        <img src={MinusIcon} onClick={(e) => handleRemovePerson(index, e)} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='taxInvoice__items--description'>
                            {showDescription[index] || item?.description ? (
                                <>
                                    <div className='remove--description-btn'>
                                        <img src={MinusIcon} onClick={(e) => handleRemoveDescription(index, e)} />
                                        <div className='desc__box'>
                                            <span>Description</span>
                                            <input
                                                type="text"
                                                value={item?.description}
                                                defaultValue={item?.description}
                                                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='add--description-btn'>
                                    <button onClick={(e) => handleAddDescription(index, e)}>
                                        <PlusOutlined />
                                    </button>
                                    <span>Add Description</span>
                                </div>
                            )}
                        </div>
                        {index === items.length - 1 && (
                            <div className='add--item-btn'>
                                <button onClick={(e) => handleAddPerson(e)}>
                                    <PlusOutlined />
                                </button>
                                <span>Add New Item</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='taxInvoice--details'>
                <div className='taxInvoice--details--bank'>
                    <div className='taxInvoice--details--split'>
                        <div className='taxInvoice--details-left'>
                            <div className='taxInvoice--details-tnc'>
                                <h3>Add Terms and Conditions</h3>
                                <TextArea
                                    placeholder="Terms and Conditions"
                                    rows={5}
                                    value={termsAndConditions}
                                    onChange={(e) => setTermsAndConditions(e.target.value)}
                                />
                            </div>
                            <div style={{ marginTop: "1rem" }} className='taxInvoice--details__modal--checkbox'>
                                <input type="checkbox" value={isSetDefaultTncCustomer}
                                    checked={isSetDefaultTncCustomer}
                                    onChange={(e) => setIsSetDefaultTncCustomer(e.target.checked)}
                                    disabled={user?.localInfo?.role ? true : false}
                                />
                                <span
                                    style={{
                                        opacity: isSetDefaultTncCustomer ? '1' : '0.5'
                                    }}
                                >Save for this customer</span>
                            </div>
                            <div className='taxInvoice--details__modal--checkbox'>
                                <input type="checkbox" value={isSetDefaultTncClient}
                                    checked={isSetDefaultTncClient}
                                    onChange={(e) => setIsSetDefaultTncClient(e.target.checked)}
                                    disabled={user?.localInfo?.role ? true : false}
                                />
                                <span
                                    style={{
                                        opacity: isSetDefaultTncClient ? '1' : '0.5'
                                    }}
                                >Save for all customers</span>
                            </div>
                        </div>
                        <div className='taxInvoice--details-right'>
                            <div className='taxInvoice--details-right-head'>
                                <span>Sub Total</span>
                                <span>Discount</span>
                                <span>Tax</span>
                                <span>Total</span>
                            </div>
                            <div className='taxInvoice--details-right-info'>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(subTotal)}
                                </span>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(discount)}
                                </span>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(tax)}
                                </span>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='taxInvoice__payment'>
                <div className='taxInvoice__payment-options'>
                    <p>Payment Received?</p>
                    <Radio.Group onChange={onChangePaymentReceived} value={paymentReceivedValue} >
                        <Radio value={1}>Yes</Radio>
                        <Radio value={2}>No</Radio>
                    </Radio.Group>
                </div>
                {
                    paymentReceivedValue === 1 ?
                        <>
                            <div className='taxInvoice__payment-data'>
                                <div className='taxInvoice__payment-table'>
                                    <div className='taxInvoice__payments-table-head'>
                                        <p>Receipt Number</p>
                                        <p>Total Amount</p>
                                    </div>
                                    <div className='taxInvoice__payment-table--body'>
                                        {
                                            openPayments?.length > 0 && customerId !== null ? openPayments?.map((payment, index) => (
                                                <div key={index} className='taxInvoice__payment-table--data'>
                                                    <div className='taxInvoice__payment-table--checkdata'>
                                                        <input
                                                            className='margin-right-07'
                                                            type="checkbox"
                                                            checked={paymentList?.find((receiptId) => receiptId === payment?.receipt_id) ? true : false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setPaymentList((prev) => prev?.concat(payment?.receipt_id));
                                                                }
                                                                else {
                                                                    setPaymentList((prev) => prev.filter((receipt_id) => receipt_id !== payment?.receipt_id));
                                                                }
                                                            }}
                                                        />
                                                        <p>{payment?.receipt_number}</p>
                                                    </div>
                                                    <p>{currencies?.find((currency) => currency.currency_id === payment?.currency_id)?.currency_abv} {payment?.total_amount}</p>
                                                </div>
                                            )) : <p className='taxInvoice__payment-table-noData'>No Payments</p>
                                        }
                                    </div>
                                </div>
                                <div className='taxInvoice__payment-table'>
                                    <div className='taxInvoice__payments-table-head'>
                                        <p>CN Number</p>
                                        <p>Total Amount</p>
                                    </div>
                                    <div className='taxInvoice__payment-table--body'>
                                        {
                                            openCreditNotes?.length > 0 && customerId !== null ? openCreditNotes?.map((creditNote, index) => (
                                                <div key={index} className='taxInvoice__payment-table--data'>
                                                    <div className='taxInvoice__payment-table--checkdata'>
                                                        <input
                                                            className='margin-right-07'
                                                            type="checkbox"
                                                            checked={creditNoteList?.find((cnId) => cnId === creditNote?.cn_id) ? true : false}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setCreditNoteList((prev) => prev?.concat(creditNote?.cn_id));
                                                                }
                                                                else {
                                                                    setCreditNoteList((prev) => prev.filter((cn_id) => cn_id !== creditNote?.cn_id));
                                                                }
                                                            }}
                                                        />
                                                        <p>{creditNote?.cn_number}</p>
                                                    </div>
                                                    <p>{currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv} {creditNote?.total}</p>
                                                </div>
                                            )) : <p className='taxInvoice__payment-table-noData'>No Credit Notes</p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='taxInvoice__payment-select'>
                                <Select
                                    placeholder='Select Payment Method'
                                    value={bankId}
                                    onChange={(e) => setBankId(e)}
                                >
                                    <Option key="0" value="0">
                                        Cash
                                    </Option>
                                    <Option key={(user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_id} value={(user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_id}>
                                        {(user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_name}
                                    </Option>
                                    {
                                        (user?.localInfo?.role ? client : user?.clientInfo)?.other_bank_accounts?.map((bank) => (
                                            <Option key={bank.bank_id} value={bank.bank_id}>
                                                {bank.bank_name}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </div>
                        </> : ""
                }
            </div>
        </>
    )
}

export default TaxInvoiceFormP2;
