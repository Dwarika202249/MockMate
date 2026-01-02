import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setTokens, clearTokens, isTokenExpired, getToken } from '../../utils/api';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;
      setTokens(token, refreshToken);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Login failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (id_token, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/google', { id_token });
      const { token, refreshToken, user } = response.data;
      setTokens(token, refreshToken);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Google login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { token, refreshToken, user } = response.data;
      setTokens(token, refreshToken);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch user');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call server-side logout endpoint
      await api.post('/api/auth/logout').catch(() => {});
    } catch (error) {
      // Continue with client-side logout even if server call fails
    } finally {
      clearTokens();
    }
    return null;
  }
);

// Check and initialize auth state
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      clearTokens();
      return { isAuthenticated: false, user: null };
    }
    
    try {
      const response = await api.get('/api/auth/user');
      return { isAuthenticated: true, user: response.data };
    } catch (error) {
      clearTokens();
      return rejectWithValue('Session expired');
    }
  }
);

const initialState = {
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken() && !isTokenExpired(getToken()),
  loading: false,
  initializing: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoggedOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.initializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.initializing = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.initializing = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, setLoggedOut } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthInitializing = (state) => state.auth.initializing;

export default authSlice.reducer;
