import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './Reducers/User';
import { onboardingReducer } from './Reducers/Onboarding';
import { customerReducer } from './Reducers/Customer';
import { estimateReducer } from './Reducers/Estimate';
import { unitReducer } from './Reducers/Unit';

const store = configureStore({
    reducer: {
        // Add reducers here
        userReducer: userReducer,
        onboardingReducer: onboardingReducer,
        customerReducer: customerReducer,
        estimateReducer: estimateReducer,
        unitReducer: unitReducer,
    },
});

export default store;