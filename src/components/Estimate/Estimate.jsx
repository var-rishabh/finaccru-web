import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';
import "./Estimate.css"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEstimate, downloadEstimateList, getEstimateList } from '../../Actions/Estimate';
import { useEffect, useState } from 'react';
import estimateColumns from '../../Columns/Estimate';
import TableCard from '../../Shared/TableCard/TableCard';

const Estimate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading, estimates } = useSelector(state => state.estimateReducer);
    
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    useEffect(() => {
        dispatch(getEstimateList());
    }, [dispatch]);
    

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getEstimateList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getEstimateList());
        }
    }, [searchText]);

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

    // Table Columns
    const columns = estimateColumns(showModal, showConvertModal, navigate);

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
            <div className='table'>
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={estimates} getList={getEstimateList} searchText={searchText} />
            </div>
        </>
    )
}

export default Estimate;
