import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProformaDetails, markProformaSent, markProformaVoid } from '../../../Actions/Proforma';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import Loader from '../../Loader/Loader';

import '../../../Styles/Read.css';
import backButton from "../../../assets/Icons/back.svg"

import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';

// Read Parts
import ReadHead from '../../../Shared/ReadHead/ReadHead';
import { styles as headStyles } from '../../../Styles/ReadHead';
import ReadFor from '../../../Shared/ReadFor/ReadFor';
import { styles as forStyles } from '../../../Styles/ReadFor';
import ReadMeta from '../../../Shared/ReadMeta/ReadMeta';
import { styles as metaStyles } from '../../../Styles/ReadMeta';
import LineItem from '../../../Shared/LineItem/LineItem';
import { styles as lineItemStyles } from '../../../Styles/LineItem';
import ReadBank from '../../../Shared/ReadBank/ReadBank';
import { styles as bankStyles } from '../../../Styles/ReadBank';
import ReadTax from '../../../Shared/ReadTax/ReadTax';
import { styles as taxStyles } from '../../../Styles/ReadTax';
import calculateTotalAmounts from '../../../utils/calculateTotalAmounts';
import ReadContent from '../../../utils/ReadContent';
import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';
// import { setChatDocument } from '../../../Actions/Chat';

const ProformaReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const pi_id = window.location.pathname.split('/')[3];
    const { loading, proforma } = useSelector(state => state.proformaReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [groupedItems, setGroupedItems] = useState([]);

    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const { currencies } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getProformaDetails(pi_id));
    }, [dispatch, pi_id]);

    useEffect(() => {
        const amount = calculateTotalAmounts(proforma?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
    }, [proforma, taxRates]);

    useEffect(() => {
        const groupedByTaxId = proforma?.line_items?.reduce((acc, item, index) => {
            const existingGroup = acc.find((group) => group.tax_id === item.tax_id);
            if (existingGroup) {
                existingGroup.taxable_amount += (itemTotal?.at(index) - itemTax?.at(index));
                existingGroup.tax_amount += (itemTax?.at(index));
                existingGroup.total_amount += (itemTotal?.at(index));
            } else {
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === item.tax_id);
                acc.push({
                    tax_id: item.tax_id,
                    tax_rate_name: taxItem.tax_rate_name,
                    taxable_amount: (itemTotal?.at(index) - itemTax?.at(index)),
                    tax_amount: (itemTax?.at(index)),
                    total_amount: (itemTotal?.at(index)),
                });
            }
            return acc;
        }, []);

        setGroupedItems(groupedByTaxId);
    }, [itemTotal, itemTax, proforma, taxRates]);

    // useEffect(() => {
    //     dispatch(setChatDocument({ id: proforma?.pi_id, number: proforma?.pi_number}));
    //     return () => {
    //         dispatch({ type: "RemoveChatDocument" });
    //     }
    // }, [dispatch, proforma]);

    const contents = ReadContent("Proforma", proforma, user, currencies, taxRates, itemTax, itemTotal, subTotal, discount, tax, total, groupedItems);

    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate("/proforma")} />
                    <h1 className='read__header--title'> Proformas List </h1>
                </div>
                <div className='read__header--right'>
                    {
                        proforma?.pi_status === "Draft" ? <>
                            <a className='read__header--btn1'
                                onClick={() => {
                                    dispatch(markProformaSent(window.location.pathname.split('/')[3]))
                                }}
                            >Mark as Sent</a>
                        </> : proforma?.pi_status === "Sent" ? <>
                            <a className='read__header--btn1'
                                onClick={() => {
                                    dispatch(markProformaVoid(window.location.pathname.split('/')[3]))
                                }}
                            >Mark as Void</a>
                        </> : ""
                    }
                    {
                        proforma?.pi_status === "Converted to TI" ? "" :
                            proforma?.pi_status === "Void" ? "" :
                                <a className='read__header--btn1' onClick={() => navigate(`/proforma/edit/${proforma?.pi_id}`)}>Edit</a>
                    }
                    <PdfDownload contents={contents} heading={"Proforma"} />
                </div>
            </div>
            <div className="read__container">
                {loading ? <Loader /> :
                    <div className="read--main" id="read--main">
                        <ViewHeader title={"Proforma"} />
                        <ReadHead
                            title={"Proforma"}
                            styles={headStyles}
                            address_line_1={user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.clientInfo?.company_data?.company_name}
                            country={user?.clientInfo?.company_data?.country}
                            state={user?.clientInfo?.company_data?.state}
                            trade_license_number={user?.clientInfo?.company_data?.trade_license_number}
                            number={proforma?.pi_number}
                            date={proforma?.pi_date}
                            valid_till={proforma?.valid_till}
                            reference={proforma?.reference}
                        />
                        <ReadFor
                            title={"Proforma"}
                            styles={forStyles}
                            customer_name={proforma?.customer?.customer_name}
                            billing_address_line_1={proforma?.customer?.billing_address_line_1}
                            billing_address_line_2={proforma?.customer?.billing_address_line_2}
                            billing_address_line_3={proforma?.customer?.billing_address_line_3}
                            billing_state={proforma?.customer?.billing_state}
                            billing_country={proforma?.customer?.billing_country}
                            shipping_address_line_1={proforma?.customer?.shipping_address_line_1}
                            shipping_address_line_2={proforma?.customer?.shipping_address_line_2}
                            shipping_address_line_3={proforma?.customer?.shipping_address_line_3}
                            shipping_state={proforma?.customer?.shipping_state}
                            shipping_country={proforma?.customer?.shipping_country}
                            trn={proforma?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            currency_conversion_rate={proforma?.currency_conversion_rate}
                            subject={proforma?.subject}
                        />
                        <div className='read__items'>
                            {proforma?.line_items?.map((item, index) => (
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <ReadBank
                            styles={bankStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax
                            styles={taxStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === proforma?.currency_id)?.currency_abv}
                            currency_conversion_rate={proforma?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={proforma?.terms_and_conditions}
                        />
                        <ViewFooter />
                    </div>
                }
            </div>
        </>
    )
}

export default ProformaReadLayout;
