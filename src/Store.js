import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './Reducers/User';
import { onboardingReducer } from './Reducers/Onboarding';
import { customerReducer } from './Reducers/Customer';
import { estimateReducer } from './Reducers/Estimate';
import { unitReducer } from './Reducers/Unit';
import { proformaReducer } from './Reducers/Proforma';
import { taxInvoiceReducer } from './Reducers/TaxInvoice';
import { creditNoteReducer } from './Reducers/CreditNote';
import { paymentReducer } from './Reducers/Payment';
import { accountantReducer } from './Reducers/Accountant';
import { vendorReducer } from './Reducers/Vendor';
import { expenseReducer } from './Reducers/Expense';
import { purchaseOrderReducer } from './Reducers/PurchaseOrder';
import { billReducer } from './Reducers/Bill';
import { debitNoteReducer } from './Reducers/DebitNote';
import { billPaymentReducer } from './Reducers/BillPayment';
import { bankReducer } from './Reducers/Bank';
import { pdcReducer } from './Reducers/PDC';
import { chatReducer } from './Reducers/Chat';

const store = configureStore({
    reducer: {
        // Add reducers here
        userReducer: userReducer,
        onboardingReducer: onboardingReducer,
        customerReducer: customerReducer,
        estimateReducer: estimateReducer,
        unitReducer: unitReducer,
        proformaReducer: proformaReducer,
        taxInvoiceReducer: taxInvoiceReducer,
        creditNoteReducer: creditNoteReducer,
        paymentReducer: paymentReducer,
        accountantReducer: accountantReducer,
        vendorReducer: vendorReducer,
        expenseReducer: expenseReducer,
        purchaseOrderReducer: purchaseOrderReducer,
        billReducer: billReducer,
        debitNoteReducer: debitNoteReducer,
        billPaymentReducer: billPaymentReducer,
        bankReducer: bankReducer,
        pdcReducer: pdcReducer,
        chatReducer: chatReducer,
    },
});

export default store;