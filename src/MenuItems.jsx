import dashboard from './assets/dashboardIcons/dashboard.svg';
import customer from './assets/dashboardIcons/customer.svg';
import estimate from './assets/dashboardIcons/estimate.svg';
import proforma from './assets/dashboardIcons/proforma.svg';

import Dashboard from './components/Dashboard/Dashboard';
import Customer from './components/Customer/Customer';
import Estimate from './components/Estimate/Estimate';
import EstimateLayout from './components/Estimate/EstimateLayout/EstimateLayout';
import EstimateRead from './components/Estimate/EstimateRead/EstimateRead'
import Proforma from './components/Proforma/Proforma';
import ProformaLayout from './components/Proforma/ProformaLayout/ProformaLayout';
import ProformaRead from './components/Proforma/ProformaRead/ProformaRead';
import TaxInvoice from './components/TaxInvoice/TaxInvoice';
import TaxInvoiceLayout from './components/TaxInvoice/TaxInvoiceLayout/TaxInvoiceLayout';
import TaxInvoiceRead from './components/TaxInvoice/TaxInvoiceRead/TaxInvoiceRead';
import CreditNote from './components/CreditNote/CreditNote';
import CreditNoteLayout from './components/CreditNote/CreditNoteLayout/CreditNoteLayout';
import CreditNoteRead from './components/CreditNote/CreditNoteRead/CreditNoteRead';

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
    getItem('Proforma', <img src={proforma} />, <Proforma />, <ProformaLayout />, <ProformaRead />),
    getItem('Tax Invoice', <img src={estimate} />, <TaxInvoice />, <TaxInvoiceLayout />, <TaxInvoiceRead />),
    getItem('Credit Note', <img src={estimate} />, <CreditNote />, <CreditNoteLayout />, <CreditNoteRead />),
    getItem('Payments', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Vendors', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Expenses', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Bills', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Debits Notes', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('Banking', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('VAT', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('SOA', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
];

export default items;
