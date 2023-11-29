import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEstimateList } from '../../../../Actions/Estimate';
import { getProformaList } from '../../../../Actions/Proforma';
import { getTaxInvoiceList } from '../../../../Actions/TaxInvoice';
import { getPaymentsList } from '../../../../Actions/Payment';
import { getCreditNoteList } from '../../../../Actions/CreditNote';

import TableCard from '../../../../Shared/TableCard/TableCard';
import creditNoteColumns from '../../../../Columns/CreditNote';
import estimateColumns from '../../../../Columns/Estimate';
import performaColumns from '../../../../Columns/Proforma';
import paymentColumns from '../../../../Columns/Payment';
import taxInvoiceColumns from '../../../../Columns/TaxInvoice';

import { Collapse } from 'antd';

const VendorTransactions = ({ vendor_id }) => {
    const dispatch = useDispatch();
    const { loading: loadingEstimate, estimates } = useSelector((state) => state.estimateReducer);
    const { loading: loadingProforma, proformas } = useSelector((state) => state.proformaReducer);
    const { loading: loadingInvoice, taxInvoices } = useSelector((state) => state.taxInvoiceReducer);
    const { loading: loadingPayment, payments } = useSelector((state) => state.paymentReducer);
    const { loading: loadingCreditNote, creditNotes } = useSelector((state) => state.creditNoteReducer);
    useEffect(() => {
        dispatch(getEstimateList(1, "", vendor_id));
    }, [dispatch, vendor_id]);
    const items = [
        {
            key: "1",
            label: 'Purchase Orders',
            children: <TableCard columns={estimateColumns()} dispatch={dispatch} loading={loadingEstimate} items={estimates} getList={getEstimateList} vendor_id={vendor_id} />,
        },
        {
            key: "2",
            label: 'Bills',
            children: <TableCard columns={performaColumns()} dispatch={dispatch} loading={loadingProforma} items={proformas} getList={getProformaList} vendor_id={vendor_id} />,
        },
        {
            key: "3",
            label: 'Expense Bills',
            children: <TableCard columns={taxInvoiceColumns()} dispatch={dispatch} loading={loadingInvoice} items={taxInvoices} getList={getTaxInvoiceList} vendor_id={vendor_id} />,
        },
        {
            key: "4",
            label: 'Payments',
            children: <TableCard columns={paymentColumns()} dispatch={dispatch} loading={loadingPayment} items={payments} getList={getPaymentsList} vendor_id={vendor_id} />,
        },
        {
            key: "5",
            label: 'Debit Notes',
            children: <TableCard columns={creditNoteColumns()} dispatch={dispatch} loading={loadingCreditNote} items={creditNotes} getList={getCreditNoteList} vendor_id={vendor_id} />,
        },
    ];
    const handleCollapseChange = (keys) => {
        keys.forEach((key) => {
            if (key === "1") {
                dispatch(getEstimateList(1, "", vendor_id));
            }
            if (key === "2") {
                dispatch(getProformaList(1, "", vendor_id));
            }
            if (key === "3") {
                dispatch(getTaxInvoiceList(1, "", vendor_id));
            }
            if (key === "4") {
                dispatch(getPaymentsList(1, "", vendor_id));
            }
            if (key === "5") {
                dispatch(getCreditNoteList(1, "", vendor_id));
            }
        });
    };
    return (
        <div className="read__vendor--transaction">
            {
                items?.map((item, index) => (
                    <div className='read__vendor--transaction-collapse' key={index}>
                        <Collapse
                            items={[item]}
                            defaultActiveKey={["1"]}
                            onChange={handleCollapseChange}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default VendorTransactions;
