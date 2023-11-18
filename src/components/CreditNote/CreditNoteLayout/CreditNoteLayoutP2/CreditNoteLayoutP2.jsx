import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUnit } from '../../../../Actions/Unit';
import { getTaxRate } from '../../../../Actions/Onboarding';

import { PlusOutlined } from '@ant-design/icons';
import MinusIcon from '../../../../assets/Icons/minus.svg'
import { Input, Select, AutoComplete } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const CreditNoteFormP2 = ({
    items, setItems, currency, termsAndConditions, setTermsAndConditions,
    isSetDefaultTncCustomer, setIsSetDefaultTncCustomer, isSetDefaultTncClient, setIsSetDefaultTncClient
}) => {
    const { units, loading: unitLoading } = useSelector(state => state.unitReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);
    // const { customer } = useSelector(state => state.customerReducer);
    const { user } = useSelector(state => state.userReducer);

    const [showDescription, setShowDescription] = useState([]);

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [allUnits, setAllUnits] = useState([]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUnit());
        dispatch(getTaxRate());
    }, [dispatch]);

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
        const calculateTotalAmounts = () => {
            let subTotalAmount = 0;
            let discountAmount = 0;
            let taxAmount = 0
            const calculatedTax = [];

            const calculateFinalAmount = items?.map((item) => {
                const { qty, rate, discount, is_percentage_discount, tax_id } = item;
                let finalRate = 0;
                let overAllRate = 0;
                if (is_percentage_discount) {
                    finalRate = rate - (rate * discount / 100);
                    overAllRate = finalRate * qty;
                    discountAmount += (rate - finalRate) * qty;
                } else {
                    discountAmount += ((+discount) * qty);
                    overAllRate = (rate - discount) * qty;
                }
                subTotalAmount += rate * qty;
                let tax = 0;
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === tax_id);
                if (taxItem?.tax_percentage !== 0) {
                    tax = overAllRate * (taxItem?.tax_percentage / 100);
                    taxAmount += tax;
                }
                calculatedTax.push(parseFloat(tax.toFixed(2)));

                const finalAmount = parseFloat((overAllRate + tax).toFixed(2));
                return finalAmount;
            });

            setSubTotal(parseFloat(subTotalAmount.toFixed(2)));
            setDiscount(parseFloat(discountAmount.toFixed(2)));
            setTax(parseFloat(taxAmount.toFixed(2)));
            setTotal(parseFloat((subTotalAmount - discountAmount + taxAmount).toFixed(2)));
            setItemTax(calculatedTax);

            return calculateFinalAmount;
        };

        const calculateTotalAmount = calculateTotalAmounts();
        setItemTotal(calculateTotalAmount);
    }, [items, taxRates]);



    return (
        <>
            <div className='creditNote__items'>
                {items?.map((item, index) => (
                    <div className='creditNote__items--main' key={index}>
                        <div className='creditNote__items--whole-item'>
                            <div className='creditNote__items--itemName'>
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
                            <div className='creditNote__items--unitSelect'>
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
                                    disabled={user?.localInfo?.role ? true : false}
                                />
                            </div>
                            <div className='creditNote__items--number-item'>
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
                            <div className='creditNote__items--number-item'>
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
                            <div className='creditNote__items--discount'>
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
                            <div className='creditNote__items--tax'>
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
                            <div className='creditNote__items--amount'>
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
                                <div className='creditNote__items--sr'>
                                    {index === 0 ? <span style={{ marginBottom: '1rem' }}>&nbsp;</span> : <></>}
                                    <div className='creditNote--cancel-icon'>
                                        <img src={MinusIcon} onClick={(e) => handleRemovePerson(index, e)} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='creditNote__items--description'>
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
            <div className='creditNote--details'>
                <div className='creditNote--details--bank'>
                    <div className='creditNote--details--split'>
                        <div className='creditNote--details-left'>
                            <div className='creditNote--details-tnc'>
                                <h3>Add Terms and Conditions</h3>
                                <TextArea
                                    placeholder="Terms and Conditions"
                                    rows={5}
                                    value={termsAndConditions}
                                    onChange={(e) => setTermsAndConditions(e.target.value)}
                                    disabled={user?.localInfo?.role ? true : false}
                                />
                            </div>
                            <div style={{ marginTop: "1rem" }} className='creditNote--details__modal--checkbox'>
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
                            <div className='creditNote--details__modal--checkbox'>
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
                        <div className='creditNote--details-right'>
                            <div className='creditNote--details-right-head'>
                                <span>Sub Total</span>
                                <span>Discount</span>
                                <span>Tax</span>
                                <span>Total</span>
                            </div>
                            <div className='creditNote--details-right-info'>
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
        </>
    )
}

export default CreditNoteFormP2;
