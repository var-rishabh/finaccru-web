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
import performaColumns from '../../Columns/Proforma';

const Proforma = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading, proformas } = useSelector(state => state.proformaReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});


    useEffect(() => {
        dispatch(getProformaList());
    }, [dispatch]);

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getProformaList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getProformaList());
        }
    }, [searchText]);

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


    const columns = performaColumns(showModal, navigate)
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
