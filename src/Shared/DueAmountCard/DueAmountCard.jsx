import "./DueAmountCard.css"

const DueAmountCard = ({ title, due_amount, currency_abv, linked_item1, linked_item2 }) => {
    return (
        <div className="dueAmount__container">
            <div className="dueAmount__main">
                {
                    title === "Tax Invoice" ?
                        <h3 className="dueAmount__main--head">Amount Due</h3>
                        : <h3 className="dueAmount__main--head">Balance Amount</h3>
                }
                <h2 className="dueAmount__main--amount">{currency_abv} {due_amount}</h2>
                {
                    title === "Tax Invoice" ?
                        <>
                            {
                                linked_item1?.length > 0 ?
                                    <div className="dueAmount--table">
                                        <div className="dueAmount--table-head">
                                            <div className="dueAmount--table-head1">Receipt Id</div>
                                            <div className="dueAmount--table-head2">Receipt Number</div>
                                            <div className="dueAmount--table-head3">Amount</div>
                                        </div>
                                        <div className="dueAmount--table-body">
                                            {
                                                linked_item1?.length > 0 ? linked_item1?.map((receipt, index) => {
                                                    return (
                                                        <div key={index} className="dueAmount--table--data">
                                                            <div className="dueAmount--table-head1">{receipt.receipt_id}</div>
                                                            <div className="dueAmount--table-head2">{receipt.receipt_number}</div>
                                                            <div className="dueAmount--table-head3">{receipt.amount}</div>
                                                        </div>
                                                    )
                                                }) :
                                                    <span className="dueAmount--table-noData">No Receipt</span>
                                            }
                                        </div>
                                    </div> : ""
                            }
                            {
                                linked_item2?.length > 0 ?
                                    <div className="dueAmount--table">
                                        <div className="dueAmount--table-head">
                                            <div className="dueAmount--table-head1">Credit Note Id</div>
                                            <div className="dueAmount--table-head2">Credit Note Number</div>
                                            <div className="dueAmount--table-head3">Amount</div>
                                        </div>
                                        <div className="dueAmount--table-body">
                                            {
                                                linked_item2?.length > 0 ? linked_item2?.map((cn, index) => {
                                                    return (
                                                        <div key={index} className="dueAmount--table--data">
                                                            <div className="dueAmount--table-head1">{cn.cn_id}</div>
                                                            <div className="dueAmount--table-head2">{cn.cn_number}</div>
                                                            <div className="dueAmount--table-head3">{cn.amount}</div>
                                                        </div>
                                                    )
                                                }) :
                                                    <span className="dueAmount--table-noData">No Credit Notes</span>
                                            }
                                        </div>
                                    </div> : ""
                            }
                        </>
                        :
                        <>
                            {
                                linked_item1?.length > 0 ?
                                    <div className="dueAmount--table">
                                        <div className="dueAmount--table-head">
                                            <div className="dueAmount--table-head1">Invoice Id</div>
                                            <div className="dueAmount--table-head2">Invoice Number</div>
                                            <div className="dueAmount--table-head3">Amount</div>
                                        </div>
                                        <div className="dueAmount--table-body">
                                            {
                                                linked_item1?.length > 0 ? linked_item1?.map((invoice, index) => {
                                                    return (
                                                        <div key={index} className="dueAmount--table--data">
                                                            <div className="dueAmount--table-head1">{invoice.invoice_id}</div>
                                                            <div className="dueAmount--table-head2">{invoice.invoice_number}</div>
                                                            <div className="dueAmount--table-head3">{invoice.amount}</div>
                                                        </div>
                                                    )
                                                }) :
                                                    <span className="dueAmount--table-noData">No Receipt</span>
                                            }
                                        </div>
                                    </div>
                                    : ""
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default DueAmountCard;
