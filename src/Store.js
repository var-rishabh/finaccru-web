import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './Reducers/User';
import { onboardingReducer } from './Reducers/Onboarding';

const store = configureStore({
    reducer: {
        // Add reducers here
        userReducer: userReducer,
        onboardingReducer: onboardingReducer,
    },
});

export default store;