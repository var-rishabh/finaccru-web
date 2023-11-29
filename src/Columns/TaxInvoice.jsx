import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import deleteIcon from '../assets/Icons/deleteIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import approveIcon from '../assets/Icons/approveIcon.svg';

export default function taxInvoiceColumns(showModal, navigate, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'TI Date',
            dataIndex: 'ti_date',
            key: 'ti_date',
            width: 120
        },
        {
            title: 'TI Number',
            dataIndex: 'ti_number',
            key: 'ti_number',
            width: 130
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Amount (excl. VAT)',
            dataIndex: 'total_amount_excl_tax',
            key: 'total_amount_excl_tax',
            align: 'right'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160
        },
    ];

    if (role === 0) {
        if (!navigate || !showModal) {
            return columns;
        } else {
            columns.push({
                title: 'Actions',
                key: 'actions',
                width: 120,
                align: 'right',
                render: (text, record) => (
                    <div className="action__buttons">
                        <div className="action__button" onClick={() => navigate(`/tax-invoice/view/${record.ti_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.status === "Approved" ? "" :
                                record?.status === "Void" ?
                                    <div className="action__button" onClick={() => { showModal(record) }}>
                                        <Tooltip title="Delete" color='red' placement="bottom">
                                            <img src={deleteIcon} alt="deleteIcon" />
                                        </Tooltip>
                                    </div>
                                    :
                                    <>
                                        <div className="action__button" onClick={() => navigate(`/tax-invoice/edit/${record.ti_id}`)} >
                                            <Tooltip title="Edit" color='blue' placement="bottom">
                                                <img src={editIcon} alt="editIcon" />
                                            </Tooltip>
                                        </div>
                                        <div className="action__button" onClick={() => { showModal(record) }}>
                                            <Tooltip title="Delete" color='red' placement="bottom">
                                                <img src={deleteIcon} alt="deleteIcon" />
                                            </Tooltip>
                                        </div>
                                    </>
                        }
                    </div>
                ),
            });
            return columns;
        }
    } else if (role === 1 || role === 2) {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 120,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons tax-invoices">
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/tax-invoice/view/${record.ti_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/tax-invoice/view/${record.ti_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Approved" ? "" :
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/tax-invoice/edit/${record.ti_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/tax-invoice/edit/${record.ti_id}`)} >
                                    <Tooltip title="Edit" color='blue' placement="bottom">
                                        <img src={editIcon} alt="editIcon" />
                                    </Tooltip>
                                </div>
                                <div className="action__button" onClick={() => { showModal(record) }}>
                                    <Tooltip title="Approve" color='green' placement="bottom">
                                        <img src={approveIcon} alt="approveIcon" />
                                    </Tooltip>
                                </div>
                            </>
                    }
                </div>
            ),
        });
        return columns;
    } else {
        return [];
    }
}