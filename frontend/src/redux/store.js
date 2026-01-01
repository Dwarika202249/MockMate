import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';
import creditsReducer from './slices/creditsSlice';

export const store = configureStore({
  reducer: {
    interview: interviewReducer,
    credits: creditsReducer
  }
});

export default store;
