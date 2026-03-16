import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    error: null,
    accessToken: null,
    message : null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;    
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
      setMessage(state, action) {
      state.message = action.payload;
    }

  },
}); 

export const { setUser, setLoading, setError, setAccessToken, setMessage } = authSlice.actions;
export default authSlice.reducer;

