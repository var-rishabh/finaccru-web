import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';
import "./Payment.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePayments, downloadPaymentsList, getPaymentsList } from '../../Actions/Payment';
import { useEffect, useState } from 'react';
import paymentColumns from '../../Columns/Payment';
import TableCard from '../../Shared/TableCard/TableCard';

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, payments } = useSelector(state => state.paymentReducer);
    
    useEffect(() => {
        dispatch(getPaymentsList());
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
        dispatch(deletePayments(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getPaymentsList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getPaymentsList());
        }
    }, [searchText]);

    const columns = paymentColumns(showModal, navigate);
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
                className='payment__list--delete--modal'
            >
                <div className='payment__delete--modal'>
                    <img src={errorIcon} alt="error" />
                    <h1>Are you sure you?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.receipt_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='payment__header'>
                <div className='payment__header--left'>
                    <h1 className='payment__header--title'> Payments </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='payment__header--right'>
                    <a className='payment__header--btn1' onClick={() => dispatch(downloadPaymentsList())}>Download</a>
                    <a onClick={() => navigate("/payment/create")} className='payment__header--btn2'>Create Payment</a>
                </div>
            </div>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={payments} getList={getPaymentsList} searchText={searchText} />
            </div>
        </>
    )
}

export default Payment;
