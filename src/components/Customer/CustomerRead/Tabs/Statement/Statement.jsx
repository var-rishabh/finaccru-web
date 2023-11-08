import { useEffect, useState } from 'react';
import PdfDownload from "../../../../../Shared/PdfDownload/PdfDownload";
import moment from 'moment';

import { ArrowRightOutlined } from '@ant-design/icons';
import logo from "../../../../../assets/Icons/cropped_logo.svg"
import { useDispatch, useSelector } from 'react-redux';
import { readCustomerStatment, getCustomerDetails } from '../../../../../Actions/Customer';

import StatementHead from './Parts/StatementHead';
import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../../../Styles/ReadStatementHead';
import StatementSummary from './Parts/StatementSummary';
import { pdfStyle as summaryPdfStyle, styles as summaryStyles } from '../../../../../Styles/ReadStatementSummary';
import StatementTable from './Parts/StatementTable';
import { pdfStyle as tablePdfStyle, styles as tableStyles } from '../../../../../Styles/ReadStatementTable';

const CustomerStatement = ({ customer_id }) => {
    const dispatch = useDispatch();

    const { customerStatement, loading, error } = useSelector(state => state.customerReducer);
    const { user } = useSelector(state => state.userReducer);
    const { customer } = useSelector(state => state.customerReducer);
    const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState( moment().endOf('month').format("YYYY-MM-DD"));

    useEffect(() => {
        dispatch(getCustomerDetails(customer_id));
    }, [dispatch, customer_id])

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(readCustomerStatment(customer_id, {
                from_date: startDate,
                to_date: endDate
            }));
        }
    }, [dispatch, customer_id, startDate, endDate]);

    const contents = [
        {
            component: StatementHead,
            height: 120,
            props: {
                styles: headPdfStyle,
                user: user?.clientInfo,
                customer: customer
            }
        },
        {
            component: StatementSummary,
            height: 120,
            props: {
                styles: summaryPdfStyle,
                start_date: startDate,
                end_date: endDate,
                opening_balance: customerStatement?.opening_balance,
                invoiced_amount: customerStatement?.invoiced_amount,
                amount_received: customerStatement?.amount_received,
                exchange_gain: customerStatement?.exchange_gain,
                balance_due: customerStatement?.balance_due,
            }
        },
        {
            component: StatementTable,
            height: ((customerStatement?.transactions || []).length * 50) + 100,
            props: {
                styles: tablePdfStyle,
                transactions: customerStatement?.transactions
            }
        }
    ];


    return (
        <div className="read__customer--statements">
            <div className='read__customer--statements-header'>
                <div className='read__customer--statements--header-dates'>
                    <input type="date"
                        name='startDate'
                        placeholder='Start Date'
                        defaultValue={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <ArrowRightOutlined />
                    <input type="date"
                        name='endDate'
                        placeholder='End Date'
                        defaultValue={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className='read__customer--statements-header-download-btn'>
                    <PdfDownload contents={contents} heading={""} />
                </div>
            </div>
            <div className="read__customer-statement-container">
                <div className="read__customer-statement-main">
                    <div className="read__customer-statement-top">
                        <img style={{ width: "9rem" }} src={logo} alt="logo" />
                    </div>
                    <StatementHead styles={headStyles}
                        customer={customer} user={user?.clientInfo}
                    />
                    {
                        startDate && endDate && (
                            <>
                                <StatementSummary styles={summaryStyles}
                                    start_date={startDate} end_date={endDate}
                                    opening_balance={customerStatement?.opening_balance}
                                    invoiced_amount={customerStatement?.invoiced_amount}
                                    amount_received={customerStatement?.amount_received}
                                    credit_notes={customerStatement?.credit_notes}
                                    balance_due={customerStatement?.balance_due}
                                />
                                <StatementTable styles={tableStyles} transactions={customerStatement?.transactions} />
                            </>
                        )
                    }
                    <div className="read__customer-statement-footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='read__customer-statement-footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerStatement;
