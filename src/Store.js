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
    },
});

export default store;