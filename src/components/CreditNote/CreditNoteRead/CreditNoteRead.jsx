import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { getCreditNoteDetails, markCreditNoteVoid, submitCreditNoteForApproval, approveCreditNote } from '../../../Actions/CreditNote';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import { readAccountantClient } from '../../../Actions/Accountant';

import Loader from '../../Loader/Loader';

// Styles
import '../../../Styles/Read.css';

// Assets
import backButton from "../../../assets/Icons/back.svg";

// Pdf Download Button
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
import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';

// Functions
import calculateTotalAmounts from '../../../utils/calculateTotalAmounts';
import ReadContent from '../../../utils/ReadContent';
import DueAmountCard from '../../../Shared/DueAmountCard/DueAmountCard';

const CreditNoteReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading, creditNote } = useSelector(state => state.creditNoteReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);

    const cn_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;
    
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
        dispatch(getCreditNoteDetails(cn_id, user?.localInfo?.role));
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, cn_id, client_id, user?.localInfo?.role]);

    useEffect(() => {
        const amount = calculateTotalAmounts(creditNote?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
    }, [creditNote, taxRates]);

    useEffect(() => {
        const groupedByTaxId = creditNote?.line_items?.reduce((acc, item, index) => {
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
    }, [itemTotal, itemTax, creditNote, taxRates]);

    const [clientData, setClientData] = useState({});
    useEffect(() => {
        if (user?.localInfo?.role) {
            setClientData({ clientInfo: client });
        } else {
            setClientData(user);
        }
    }, [user, client]);
    const contents = ReadContent("Credit Note", creditNote, clientData, currencies, taxRates, itemTax, itemTotal, subTotal, discount, tax, total, groupedItems);

    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/credit-note"}`)} />
                    <h1 className='read__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Credit Notes List'}
                    </h1>
                </div>
                <div className='read__header--right'>
                    {
                        user?.localInfo?.role ?
                            <>
                                <a className='read__header--btn1'
                                    onClick={() => {
                                        navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/credit-note/edit/${creditNote?.cn_id}`)
                                    }}
                                >
                                    Edit
                                </a>
                                <a className='read__header--btn2'
                                    onClick={() => {
                                        dispatch(approveCreditNote(cn_id, user?.localInfo?.role, client_id))
                                    }}
                                >
                                    Approve
                                </a>
                            </> :
                            creditNote?.cn_status === "Draft" ?
                                <>
                                    <a className='read__header--btn1'
                                        onClick={() => {
                                            dispatch(submitCreditNoteForApproval(cn_id))
                                        }}
                                    >
                                        Submit for Approval
                                    </a>
                                    <a className='read__header--btn1'
                                        onClick={() => {
                                            dispatch(markCreditNoteVoid(cn_id))
                                        }}
                                    >
                                        Mark as Void
                                    </a>
                                </>
                                : creditNote?.cn_status === "Pending Approval" ?
                                    <a className='read__header--btn1'
                                        onClick={() => {
                                            dispatch(markCreditNoteVoid(cn_id))
                                        }}
                                    >
                                        Mark as Void
                                    </a> : ""
                    }
                    {
                        user?.localInfo?.role ? "" :
                            creditNote?.cn_status === "Void" ? "" :
                                creditNote?.cn_status === "Approved" ? "" :
                                    <a className='read__header--btn1'
                                        onClick={() => {
                                            navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/credit-note/edit/${creditNote?.cn_id}`)
                                        }}
                                    >
                                        Edit
                                    </a>
                    }
                    <PdfDownload contents={contents} heading={"Credit Note"} />
                </div>
            </div>
            <div className="read__container">
                {loading ? <Loader /> :
                    <div className="read--main" id="read--main">
                        <ViewHeader title={"Credit Note"} />
                        <ReadHead
                            title={"Credit Note"}
                            styles={headStyles}
                            address_line_1={user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}
                            country={user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}
                            state={user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state}
                            trade_license_number={user?.localInfo?.role ? client?.company_data?.trade_license_number : user?.clientInfo?.company_data?.trade_license_number}
                            number={creditNote?.cn_number}
                            date={creditNote?.cn_date}
                            due_date={creditNote?.due_date}
                            reference={creditNote?.reference}
                        />
                        <ReadFor
                            title={"Credit Note"}
                            styles={forStyles}
                            customer_name={creditNote?.customer?.customer_name}
                            billing_address_line_1={creditNote?.customer?.billing_address_line_1}
                            billing_address_line_2={creditNote?.customer?.billing_address_line_2}
                            billing_address_line_3={creditNote?.customer?.billing_address_line_3}
                            billing_state={creditNote?.customer?.billing_state}
                            billing_country={creditNote?.customer?.billing_country}
                            shipping_address_line_1={creditNote?.customer?.shipping_address_line_1}
                            shipping_address_line_2={creditNote?.customer?.shipping_address_line_2}
                            shipping_address_line_3={creditNote?.customer?.shipping_address_line_3}
                            shipping_state={creditNote?.customer?.shipping_state}
                            shipping_country={creditNote?.customer?.shipping_country}
                            trn={creditNote?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                            currency_conversion_rate={creditNote?.currency_conversion_rate}
                            subject={creditNote?.subject}
                        />
                        <div className='read__items'>
                            {creditNote?.line_items?.map((item, index) => (
                                <LineItem
                                    styles={lineItemStyles}
                                    key={index}
                                    index={index}
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
                            currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                            primary_bank={user?.clientInfo?.primary_bank}
                            other_bank_accounts={user?.clientInfo?.other_bank_accounts}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax
                            styles={taxStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                            currency_conversion_rate={creditNote?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={creditNote?.terms_and_conditions}
                        />
                        <ViewFooter />
                    </div>
                }
            </div>
            <DueAmountCard title={"Credit Note"} due_amount={creditNote?.remaining_balance}
                currency_abv={currencies?.find((currency) => currency.currency_id === creditNote?.currency_id)?.currency_abv}
                linked_item1={creditNote?.invoice_mappings} linked_item2={[]}
            />
        </>
    )
}

export default CreditNoteReadLayout;
