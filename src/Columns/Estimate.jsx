import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

export default function estimateColumns(showModal, showConvertModal, navigate) {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'estimate_date',
            key: 'estimate_date',
            width: 120,
        },
        {
            title: 'Estimate No.',
            dataIndex: 'estimate_number',
            key: 'estimate_number',
            width: 130,
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
            align: 'right',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        
    ];
    if (!navigate || !showModal || !showConvertModal) {
        return columns;
    } else { 
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons estimate-invoice">
                    <div className="action__button" onClick={() => navigate(`/estimate/view/${record.estimate_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Converted to PI/TI" ? "" :
                            record?.status === "Void" ?
                                <div className="action__button" onClick={() => showModal(record)}>
                                    <Tooltip title="Delete" color='red' placement="bottom">
                                        <img src={deleteIcon} alt="deleteIcon" />
                                    </Tooltip>
                                </div>
                                :
                                <>
                                    <div className="action__button">
                                        <Tooltip title="Convert to PI/TI" color='blue' placement="bottom" onClick={() => { showConvertModal(record) }}>
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => navigate(`/estimate/edit/${record.estimate_id}`)} >
                                        <Tooltip title="Edit" color='blue' placement="bottom">
                                            <img src={editIcon} alt="editIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => showModal(record)}>
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
}