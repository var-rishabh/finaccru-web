import dashboard from './assets/dashboardIcons/dashboard.svg';
import Dashboard from './components/Dashboard/Dashboard';

import customer from './assets/dashboardIcons/customer.svg';
import Customer from './components/Customer/Customer';
import CustomerLayout from './components/Customer/CustomerLayout/CustomerLayout';
import CustomerRead from './components/Customer/CustomerRead/CustomerRead';

import estimate from './assets/dashboardIcons/estimate.svg';
import Estimate from './components/Estimate/Estimate';
import EstimateLayout from './components/Estimate/EstimateLayout/EstimateLayout';
import EstimateRead from './components/Estimate/EstimateRead/EstimateRead'

import proforma from './assets/dashboardIcons/proforma.svg';
import Proforma from './components/Proforma/Proforma';
import ProformaLayout from './components/Proforma/ProformaLayout/ProformaLayout';
import ProformaRead from './components/Proforma/ProformaRead/ProformaRead';

import TaxInvoice from './components/TaxInvoice/TaxInvoice';
import TaxInvoiceLayout from './components/TaxInvoice/TaxInvoiceLayout/TaxInvoiceLayout';
import TaxInvoiceRead from './components/TaxInvoice/TaxInvoiceRead/TaxInvoiceRead';

import CreditNote from './components/CreditNote/CreditNote';
import CreditNoteLayout from './components/CreditNote/CreditNoteLayout/CreditNoteLayout';
import CreditNoteRead from './components/CreditNote/CreditNoteRead/CreditNoteRead';

import Payment from './components/Payment/Payment';
import PaymentLayout from './components/Payment/PaymentLayout/PaymentLayout';
import PaymentRead from './components/Payment/PaymentRead/PaymentRead';

import Vendor from './components/Vendor/Vendor';
import VendorLayout from './components/Vendor/VendorLayout/VendorLayout';
import VendorRead from './components/Vendor/VendorRead/VendorRead';

import PurchaseOrder from './components/PurchaseOrder/PurchaseOrder';
import PurchaseOrderLayout from './components/PurchaseOrder/PurchaseOrderLayout/PurchaseOrderLayout';
import PurchaseOrderRead from './components/PurchaseOrder/PurchaseOrderRead/PurchaseOrderRead';

import Bill from './components/Bill/Bill';
import BillLayout from './components/Bill/BillLayout/BillLayout';
import BillRead from './components/Bill/BillRead/BillRead';

import DebitNote from './components/DebitNote/DebitNote';
import DebitNoteLayout from './components/DebitNote/DebitNoteLayout/DebitNoteLayout';
import DebitNoteRead from './components/DebitNote/DebitNoteRead/DebitNoteRead';

import Banking from './components/Banking/Banking';
import BankingLayout from './components/Banking/BankingLayout/BankingLayout';
import BankingRead from './components/Banking/BankingRead/BankingRead';

import Expense from './components/Expense/Expense';
import ExpenseLayout from './components/Expense/ExpenseLayout/ExpenseLayout';
import ExpenseRead from './components/Expense/ExpenseRead/ExpenseRead';

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
    getItem('Customer', <img src={customer} />, <Customer />, <CustomerLayout />, <CustomerRead />),
    getItem('Estimate', <img src={estimate} />, <Estimate />, <EstimateLayout />, <EstimateRead />),
    getItem('Proforma', <img src={proforma} />, <Proforma />, <ProformaLayout />, <ProformaRead />),
    getItem('Tax Invoice', <img src={estimate} />, <TaxInvoice />, <TaxInvoiceLayout />, <TaxInvoiceRead />),
    getItem('Credit Note', <img src={estimate} />, <CreditNote />, <CreditNoteLayout />, <CreditNoteRead />),
    getItem('Payment', <img src={estimate} />, <Payment />, <PaymentLayout />, <PaymentRead />),
    getItem('Vendor', <img src={estimate} />, <Vendor />, <VendorLayout />, <VendorRead />),
    getItem('Purchase Order', <img src={estimate} />, <PurchaseOrder />, <PurchaseOrderLayout />, <PurchaseOrderRead />),
    getItem('Bill', <img src={estimate} />, <Bill />, <BillLayout />, <BillRead />),
    getItem('Debit Note', <img src={estimate} />, <DebitNote />, <DebitNoteLayout />, <DebitNoteRead />),
    getItem('Expense', <img src={estimate} />, <Expense />, <ExpenseLayout />, <ExpenseRead />),
    getItem('Banking', <img src={estimate} />, <Banking />, <BankingLayout />, <BankingRead />),
    getItem('VAT', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
    getItem('SOA', <img src={estimate} />, <Dashboard />, <Dashboard />, <Dashboard />),
];

export default items;
