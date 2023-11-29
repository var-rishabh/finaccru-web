import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

export default function billColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Bill Date',
            dataIndex: 'bill_date',
            key: 'bill_date',
            width: 120
        },
        {
            title: 'Bill Number',
            dataIndex: 'bill_number',
            key: 'bill_number',
            width: 130
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            width: 120
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];
    
    if (!navigate || !showModal) {
        return columns;
    } else {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons">
                    <div className="action__button" onClick={() => navigate(`/bill/view/${record.bill_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Converted" ? "" :
                            record?.status === "Void" ?
                                <div className="action__button" onClick={() => showModal(record)}>
                                    <Tooltip title="Delete" color='red' placement="bottom">
                                        <img src={deleteIcon} alt="deleteIcon" />
                                    </Tooltip>
                                </div>
                                :
                                <>
                                    <div className="action__button">
                                        <Tooltip title="Convert" color='green' placement="bottom" onClick={() => navigate(`/bill/create?convert=true&reference=bill&reference_id=${record.bill_id}`)}>
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => navigate(`/bill/edit/${record.bill_id}`)} >
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
    }
    return columns;
}