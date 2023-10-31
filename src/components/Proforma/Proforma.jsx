import { Modal, Input, Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import convertIcon from '../../assets/Icons/convertIcon.svg';
import editIcon from '../../assets/Icons/editIcon.svg';
import deleteIcon from '../../assets/Icons/deleteIcon.svg';
import errorIcon from '../../assets/Icons/error.svg';
import "./Proforma.css"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProforma, downloadProformaList, getProformaList } from '../../Actions/Proforma';
import { useEffect, useState } from 'react';

const Proforma = () => {
    const dispatch = useDispatch();
    const { error, loading, proformas } = useSelector(state => state.proformaReducer);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getProformaList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});
    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteProforma(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getProformaList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getProformaList());
        }
    }, [searchText]);

    const columns = [
        {
            title: 'PI Date',
            dataIndex: 'pi_date',
            key: 'pi_date',
            width: 120
        },
        {
            title: 'PI Number',
            dataIndex: 'pi_number',
            key: 'pi_number',
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
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'right',
            render: (text, record) => (
                <>
                    <div className="action__buttons proforma-invoices">
                        <div className="action__button" onClick={() => navigate(`/proforma/view/${record.pi_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.status === "Converted to TI" ? "" :
                                record?.status === "Void" ?
                                    <>
                                        <div className="action__button" onClick={() => showModal(record)}>
                                            <Tooltip title="Delete" color='red' placement="bottom">
                                                <img src={deleteIcon} alt="deleteIcon" />
                                            </Tooltip>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="action__button">
                                            <Tooltip title="Convert to TI" color='green' placement="bottom" onClick={() => navigate(`/tax-invoice/create?convert=true&reference=proforma&reference_id=${record.pi_id}`)}>
                                                <img src={convertIcon} alt="convertIcon" />
                                            </Tooltip>
                                        </div>
                                        <div className="action__button" onClick={() => window.location.href = `/proforma/edit/${record.pi_id}`} >
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

                </>
            ),
        }
    ];
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
                className='proforma__list--delete--modal'
            >
                <div className='proforma__delete--modal'>
                    <img src={errorIcon} alt="error" />
                    <h1>Are you sure you?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.pi_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='proforma__header'>
                <div className='proforma__header--left'>
                    <h1 className='proforma__header--title'> Proformas </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='proforma__header--right'>
                    <a className='proforma__header--btn1' onClick={() => dispatch(downloadProformaList())}>Download</a>
                    <a onClick={() => navigate("/proforma/create")} className='proforma__header--btn2'>Create Proforma</a>
                </div>
            </div>
            <div className="table">
                <Table
                    columns={columns}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,
                        total: proformas?.total_items,
                        defaultCurrent: 1,
                        showSizeChanger: false,
                    }}
                    sticky={true}
                    sortDirections={['descend', 'ascend']}
                    scroll={{ y: 550 }}
                    loading={loading}
                    dataSource={proformas?.items}
                    onChange={(pagination) => {
                        searchText.length > 2 ? dispatch(getProformaList(pagination.current, searchText)) : dispatch(getProformaList(pagination.current));
                    }}
                />
            </div>
        </>
    )
}

export default Proforma;
