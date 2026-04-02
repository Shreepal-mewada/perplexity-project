import { createSlice } from "@reduxjs/toolkit";

const getStoredToken = (key) => {
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: getStoredToken("user") ? JSON.parse(getStoredToken("user")) : null,
    error: null,
    accessToken: getStoredToken("accessToken"),
    refreshToken: getStoredToken("refreshToken"),
    message: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      } catch {}
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("accessToken", action.payload);
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch {}
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("refreshToken", action.payload);
        } else {
          localStorage.removeItem("refreshToken");
        }
      } catch {}
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearAuthState(state) {
      state.user = null;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.message = null;
      state.loading = false;
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } catch {}
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  setAccessToken,
  setRefreshToken,
  setMessage,
  clearAuthState,
} = authSlice.actions;
export default authSlice.reducer;
