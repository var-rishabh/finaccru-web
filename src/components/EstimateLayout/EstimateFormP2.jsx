import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUnit } from '../../Actions/Unit';
import { getTaxRate } from '../../Actions/Onboarding';

import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Input, Select, AutoComplete } from 'antd';
const { Option } = Select;

const EstimateFormP2 = ({ items, setItems }) => {
    const { user } = useSelector(state => state.userReducer);
    const { units, loading: unitLoading } = useSelector(state => state.unitReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);
    const [showDescription, setShowDescription] = useState([]);

    const [itemTotal, setItemTotal] = useState([]);
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

    // const handleRemoveDescription = (index) => {
    //     const updatedShowDescription = [...showDescription];
    //     updatedShowDescription[index] = false;
    //     setShowDescription(updatedShowDescription);
    //     const updatedItems = [...items];
    //     updatedItems[index].description = '';
    //     setItems(updatedItems);
    // };

    const handleAddPerson = (event) => {
        event.preventDefault();
        setItems([...items, { item_name: '', unit: '', qty: null, rate: null, discount: null, is_percentage_discount: true, tax_id: 1, description: null }]);
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
            const calculateFinalAmount = items?.map((item) => {
                const { qty, rate, discount, is_percentage_discount, tax_id } = item;
                let finalRate = 0;
                let overAllRate = 0;
                if (is_percentage_discount) {
                    finalRate = rate - (rate * discount / 100);
                    overAllRate = finalRate * qty;
                    discountAmount += (rate - finalRate) * qty;
                } else {
                    discountAmount += +discount;
                    overAllRate = rate * qty - discount;
                }
                subTotalAmount += rate * qty;
                let tax = 0;
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === tax_id);
                if (taxItem?.tax_percentage !== 0) {
                    tax = overAllRate * (taxItem?.tax_percentage / 100);
                    taxAmount += tax;
                }

                const finalAmount = parseFloat((overAllRate + tax).toFixed(2));
                return finalAmount;
            });

            setSubTotal(parseFloat(subTotalAmount.toFixed(2)));
            setDiscount(parseFloat(discountAmount.toFixed(2)));
            setTax(parseFloat(taxAmount.toFixed(2)));
            setTotal(parseFloat((subTotalAmount - discountAmount + taxAmount).toFixed(2)));

            return calculateFinalAmount;
        };

        const calculateTotalAmount = calculateTotalAmounts();
        setItemTotal(calculateTotalAmount);
    }, [items]);



    return (
        <>
            <div className='estimate__items'>
                {items?.map((item, index) => (
                    <div className='estimate__items--main' key={index}>
                        <div className='estimate__items--whole-item'>
                            <div className='estimate__items--sr'>
                                {index === 0 ? <span style={{ marginBottom: '1rem' }}>&nbsp;</span> : <></>}
                                <div>
                                    {items.length > 1 && (
                                        <CloseCircleOutlined onClick={(e) => handleRemovePerson(index, e)} />
                                    )}
                                </div>
                            </div>
                            <div className='estimate__items--itemName'>
                                {index === 0 ? <span style={{ marginBottom: '1rem' }}>Item Name</span> : <></>}
                                <Input
                                    type='text'
                                    placeholder='Item Name'
                                    value={item?.item_name}
                                    defaultValue={item?.item_name}
                                    style={{
                                        width: 130,
                                    }}
                                    onChange={(e) => handleInputChange(index, 'item_name', e.target.value)}
                                />
                            </div>
                            <div className='estimate__items--unitSelect'>
                                {index === 0 ? <span style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                <AutoComplete
                                    options={allUnits?.map((unit) => ({
                                        label: unit.unit_name,
                                        value: unit.unit_name,
                                    }))
                                    }
                                    style={{
                                        width: 120,
                                    }}
                                    value={item?.unit}
                                    defaultValue={item?.unit}
                                    onSearch={handleUnitSearch}
                                    onChange={(value) => handleInputChange(index, 'unit', value)}
                                    placeholder="Unit"
                                />
                            </div>
                            <div className='estimate__items--number-item'>
                                {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item?.qty}
                                    defaultValue={item?.qty}
                                    style={{
                                        width: 80
                                    }}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'qty', e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <div className='estimate__items--number-item'>
                                {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Rate"
                                    value={item?.rate}
                                    defaultValue={item?.rate}
                                    style={{
                                        width: 80
                                    }}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'rate', e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <div className='estimate__items--discount'>
                                {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Discount</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Discount"
                                    value={item?.discount}
                                    defaultValue={item?.discount}
                                    style={{
                                        width: 120
                                    }}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(index, 'is_percentage_discount', value);
                                            }}
                                            defaultValue={item?.is_percentage_discount}
                                            loading={unitLoading}
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
                            <div className='estimate__items--tax'>
                                {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                <Select
                                    onChange={(value) => {
                                        handleInputChange(index, 'tax_id', value);
                                    }}
                                    value={item?.tax_id}
                                    defaultValue={item?.tax_id}
                                    loading={taxRateLoading}
                                    style={{
                                        width: 170
                                    }}
                                >
                                    {
                                        taxRates?.map((taxRate) => (
                                            <Option key={taxRate.tax_rate_id} value={taxRate.tax_rate_id}>{taxRate.tax_rate_name}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className='estimate__items--amount'>
                                {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                <Input
                                    type='text'
                                    value={itemTotal[index]}
                                    defaultValue={itemTotal[index]}
                                    disabled={true}
                                    style={{
                                        width: 100
                                    }}
                                />
                            </div>
                        </div>
                        <div className='estimate__items--description'>
                            {showDescription[index] || item?.description ? (
                                <div className='desc__box'>
                                    <span>Description</span>
                                    <input
                                        type="text"
                                        value={item?.description}
                                        defaultValue={item?.description}
                                        onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                    />
                                </div>
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
            <div className='estimate--details'>
                <div className='estimate--details--bank'>
                    <div className='estimte--details--bank-heading'>Bank Details</div>
                    <div className='estimate--details--split'>
                        <div className='estimate--details-left'>
                            <div className='estimate--details-left-head'>
                                <span>Bank Name</span>
                                <span>Account Number</span>
                                <span>Account Name</span>
                                <span>IBAN (AED Acc)</span>
                                <span>IBAN (USD Acc)</span>
                            </div>
                            <div className='estimate--details-left-info'>
                                <span>{user?.clientInfo?.primary_bank?.bank_name}</span>
                                <span>{user?.clientInfo?.primary_bank?.account_number}</span>
                                <span>{user?.clientInfo?.primary_bank?.account_holder_name}</span>
                                <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                                <span>{user?.clientInfo?.primary_bank?.iban_number}</span>
                            </div>
                        </div>
                        <div className='estimate--details-right'>
                            <div className='estimate--details-right-head'>
                                <span>Sub Total</span>
                                <span>Discount</span>
                                <span>Tax</span>
                                <span>Total</span>
                            </div>
                            <div className='estimate--details-right-info'>
                                <span>{subTotal}</span>
                                <span>{discount}</span>
                                <span>{tax}</span>
                                <span>{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EstimateFormP2;