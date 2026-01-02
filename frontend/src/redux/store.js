import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';
import creditsReducer from './slices/creditsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    credits: creditsReducer
  }
});

export default store;
