import { createSlice } from '@reduxjs/toolkit';

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    currentInterview: null,
    interviews: [],
    loading: false,
    error: null
  },
  reducers: {
    setCurrentInterview: (state, action) => {
      state.currentInterview = action.payload;
    },
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearInterview: (state) => {
      state.currentInterview = null;
      state.error = null;
    }
  }
});

export const { 
  setCurrentInterview, 
  setInterviews, 
  setLoading, 
  setError, 
  clearInterview 
} = interviewSlice.actions;

export default interviewSlice.reducer;
