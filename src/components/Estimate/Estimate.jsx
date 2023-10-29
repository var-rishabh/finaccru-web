import { Modal, Input, Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import convertIcon from '../../assets/Icons/convertIcon.svg';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import "./Estimate.css"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEstimate, downloadEstimateList, getEstimateList } from '../../Actions/Estimate';
import { useEffect, useState } from 'react';

const Estimate = () => {
    const dispatch = useDispatch();
    const { error, loading, estimates } = useSelector(state => state.estimateReducer);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getEstimateList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showConvertModal = (record) => {
        setIsConvertModalOpen(true);
        setRecord(record);
    };
    const hideConvertModal = () => {
        setIsConvertModalOpen(false);
        setRecord({});
    };

    const handleDelete = (id) => {
        dispatch(deleteEstimate(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getEstimateList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getEstimateList());
        }
    }, [searchText]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'estimate_date',
            key: 'estimate_date',
            // sorter: (a, b) => {
            //     const dateA = new Date(a.estimate_date);
            //     const dateB = new Date(b.estimate_date);

            //     return dateA - dateB;
            // },
        },
        {
            title: 'Estimate No.',
            dataIndex: 'estimate_number',
            key: 'estimate_number',
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
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (text, record) => (
                <>
                    <div className="action__buttons estimate-invoice">
                        <div className="action__button" onClick={() => navigate(`/estimate/view/${record.estimate_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.status === "Converted to PI/TI" ? "" :
                                <>
                                    <div className="action__button">
                                        <Tooltip title="Convert to PI/TI" color='blue' placement="bottom" onClick={() => { showConvertModal(record)}}>
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div>
                                </>
                        }
                        <div className="action__button" onClick={() => window.location.href = `/estimate/edit/${record.estimate_id}`} >
                            <Tooltip title="Edit" color='blue' placement="bottom">
                                <img src={editIcon} alt="editIcon" />
                            </Tooltip>
                        </div>
                        <div className="action__button" onClick={() => showModal(record)}>
                            <Tooltip title="Delete" color='red' placement="bottom">
                                <img src={deleteIcon} alt="deleteIcon" />
                            </Tooltip>
                        </div>
                    </div>

                </>
            ),
        }
    ];
    return (
        <>
            <Modal
                open={isConvertModalOpen}
                onCancel={hideConvertModal}
                footer={null}
                width={300}
                className='estimate__list--delete--modal'
            >
                <div className='estimate__convert--modal'>
                    <div className="convert__modal__buttons">
                        <button id='confirm' onClick={() => navigate(`/proforma/create?convert=true&reference=estimate&reference_id=${record.estimate_id}`)}>Convert to PI</button>
                        <button id='confirm' onClick={() => navigate(`/tax-invoice/create?convert=true&reference=estimate&reference_id=${record.estimate_id}`)}>Convert to TI</button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
                className='estimate__list--delete--modal'
            >
                <div className='estimate__delete--modal'>
                    <img src={errorIcon} alt="error" />
                    <h1>Are you sure you?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.estimate_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='estimate__header'>
                <div className='estimate__header--left'>
                    <h1 className='estimate__header--title'> Estimates </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='estimate__header--right'>
                    <a className='estimate__header--btn1' onClick={() => dispatch(downloadEstimateList())}>Download</a>
                    <a onClick={() => navigate("/estimate/create")} className='estimate__header--btn2'>Create Estimate</a>
                </div>
            </div>
            <div className="table">
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: estimates?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={estimates?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getEstimateList(pagination.current, searchText)) : dispatch(getEstimateList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default Estimate;
