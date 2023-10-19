import dashboard from './assets/dashboardIcons/dashboard.svg';
import customer from './assets/dashboardIcons/customer.svg';
import estimate from './assets/dashboardIcons/estimate.svg';

import Dashboard from './components/Dashboard/Dashboard';
import Estimate from './components/Estimate/Estimate';
import EstimateLayout from './components/EstimateLayout/EstimateLayout';
import EstimateRead from './components/EstimateRead/EstimateRead'
import Customer from './components/Customer/Customer';
import Invoice from './components/Invoice/Invoice';

function getItem(label, icon, component, changecomponent, viewcomponent) {
    return {
        key: `/${label === 'Dashboard' ? '' : label.toLowerCase().split(' ').join('-')}`,
        icon,
        label,
        component,
        viewcomponent,
        changecomponent
    };
}

const items = [
    getItem('Dashboard', <img src={dashboard} />, <Dashboard />),
    getItem('Customer', <img src={customer} />, <Customer />, <Dashboard />, <Dashboard />),
    getItem('Estimate', <img src={estimate} />, <Estimate />, <EstimateLayout />, <EstimateRead />),
    getItem('Invoice', <img src={estimate} />, <Invoice />, <Dashboard />, <Dashboard />),
    getItem('Payments', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Credit Notes', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Vendors', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Expenses', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Bills', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Debits Notes', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Banking', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('VAT', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('SOA', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
];

export default items;
