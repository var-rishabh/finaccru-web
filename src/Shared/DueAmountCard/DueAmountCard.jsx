import "./DueAmountCard.css"

const DueAmountCard = ({ title, due_amount, currency_abv, linked_item1, linked_item2 }) => {
    return (
        <div className="dueAmount__container">
            <div className="dueAmount__main">
                <h3 className="dueAmount__main--head">Balance Amount</h3>
                <h2 className="dueAmount__main--amount">{currency_abv} {due_amount}</h2>
                {
                    title === "Tax Invoice" ?
                        <>
                            <div className="dueAmount--table">
                                <div className="dueAmount--table-head">
                                    <div>Receipt Id</div>
                                    <div>Receipt Number</div>
                                    <div>Amount</div>
                                </div>
                                <div className="dueAmount--table-body">
                                    {
                                        linked_item1?.length > 0 ? linked_item1?.map((receipt, index) => {
                                            return (
                                                <div key={index} className="dueAmount--table--data">
                                                    <div>{receipt.receipt_id}</div>
                                                    <div>{receipt.receipt_number}</div>
                                                    <div>{receipt.amount}</div>
                                                </div>
                                            )
                                        }) :
                                            <span className="dueAmount--table-noData">No Receipt</span>
                                    }
                                </div>
                            </div>
                            <div className="dueAmount--table">
                                <div className="dueAmount--table-head">
                                    <div>Credit Note Id</div>
                                    <div>Credit Note Number</div>
                                    <div>Amount</div>
                                </div>
                                <div className="dueAmount--table-body">
                                    {
                                        linked_item2?.length > 0 ? linked_item2?.map((cn, index) => {
                                            return (
                                                <div key={index}>
                                                    <div>{cn.cn_id}</div>
                                                    <div>{cn.cn_number}</div>
                                                    <div>{cn.amount}</div>
                                                </div>
                                            )
                                        }) :
                                            <span className="dueAmount--table-noData">No Credit Notes</span>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="dueAmount--table">
                                <div className="dueAmount--table-head">
                                    <div>Invoice Id</div>
                                    <div>Invoice Number</div>
                                    <div>Amount</div>
                                </div>
                                <div className="dueAmount--table-body">
                                    {
                                        linked_item1?.length > 0 ? linked_item1?.map((invoice, index) => {
                                            return (
                                                <div key={index} className="dueAmount--table--data">
                                                    <div>{invoice.invoice_id}</div>
                                                    <div>{invoice.invoice_number}</div>
                                                    <div>{invoice.amount}</div>
                                                </div>
                                            )
                                        }) :
                                            <span className="dueAmount--table-noData">No Receipt</span>
                                    }
                                </div>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default DueAmountCard;
