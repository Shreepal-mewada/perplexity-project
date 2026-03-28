import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';  
import chatReducer from '../features/chat/chat.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

// Expose store globally so async handlers can read fresh state after dispatches
// without stale closure issues (e.g. Dashboard's handleUploadFile)
if (typeof window !== 'undefined') {
  window.__REDUX_STORE__ = store;
}