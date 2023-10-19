import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './Reducers/User';
import { onboardingReducer } from './Reducers/Onboarding';
import { customerReducer } from './Reducers/Customer';
import { estimateReducer } from './Reducers/Estimate';
import { unitReducer } from './Reducers/Unit';
import { invoiceReducer } from './Reducers/Invoice';

const store = configureStore({
    reducer: {
        // Add reducers here
        userReducer: userReducer,
        onboardingReducer: onboardingReducer,
        customerReducer: customerReducer,
        estimateReducer: estimateReducer,
        unitReducer: unitReducer,
        invoiceReducer: invoiceReducer,
    },
});

export default store;