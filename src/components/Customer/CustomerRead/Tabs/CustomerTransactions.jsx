import { Collapse } from 'antd';

const items = [
    {
        key: '1',
        label: 'Estimates',
        children: <p>Estimates</p>,
    },
    {
        key: '2',
        label: 'Proforma Invoices',
        children: <p>Proforma Invoices</p>,
    },
    {
        key: '3',
        label: 'Tax Invoices',
        children: <p>Tax Invoices</p>,
    },
    {
        key: '4',
        label: 'Payments',
        children: <p>Payments</p>,
    },
    {
        key: '5',
        label: 'Credit Notes',
        children: <p>Credit Notes</p>,
    },
];

const CustomerTransactions = () => {
    return (
        <div className="read__customer--transaction">
            {
                items?.map((item, index) => (
                    <div className='read__customer--transaction-collapse' key={index}>
                        <Collapse
                            items={[item]}
                            defaultActiveKey={['1']}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default CustomerTransactions;
