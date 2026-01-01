import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CreditsService from '../../services/CreditsService';

// Async thunks
export const fetchCredits = createAsyncThunk(
  'credits/fetchCredits',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CreditsService.getCredits();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credits');
    }
  }
);

export const checkCredits = createAsyncThunk(
  'credits/checkCredits',
  async (required, { rejectWithValue }) => {
    try {
      const data = await CreditsService.checkCredits(required);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check credits');
    }
  }
);

const creditsSlice = createSlice({
  name: 'credits',
  initialState: {
    balance: 100,
    events: [],
    grantedAt: null,
    loading: false,
    error: null,
    showLowBalanceWarning: false
  },
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
      state.showLowBalanceWarning = action.payload <= 10;
    },
    dismissLowBalanceWarning: (state) => {
      state.showLowBalanceWarning = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch credits
      .addCase(fetchCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.events = action.payload.events;
        state.grantedAt = action.payload.grantedAt;
        state.showLowBalanceWarning = action.payload.balance <= 10;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check credits
      .addCase(checkCredits.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(checkCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setBalance, dismissLowBalanceWarning } = creditsSlice.actions;
export default creditsSlice.reducer;
