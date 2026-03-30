import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  handleRefresh as refreshApi,
  logoutUser,
} from "../services/auth.api";
import {
  setUser,
  setLoading,
  setError,
  setAccessToken,
  setMessage,
  clearAuthState,
} from "../auth.slice";
import { resetChatState } from "../../chat/chat.slice";

export function useAuth() {
  const dispatch = useDispatch();

  const handleRegister = useCallback(
    async ({ username, email, password }) => {
      try {
        dispatch(setLoading(true));
        const user = await register({ username, email, password });
        dispatch(setUser(user));
        dispatch(setMessage("Registration successful"));
        return user;
      } catch (error) {
        dispatch(
          setError(error.response?.data?.message || "Registration failed")
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        dispatch(setLoading(true));
        const result = await login({ email, password });
        dispatch(setAccessToken(result.accessToken));
        dispatch(setUser(result.user ?? result));
      } catch (error) {
        dispatch(setError(error.response?.data?.message || "Login failed"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleRefresh = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const result = await refreshApi();
      dispatch(setAccessToken(result.accessToken));
      return result;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Refresh failed"));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetme = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const user = await getMe();
      if (user) {
        dispatch(setUser(user));
      }
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to fetch user details"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await logoutUser();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // 🔒 SECURITY FIX: Clear ALL state on logout to prevent data leakage
      dispatch(clearAuthState());
      dispatch(resetChatState());
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    handleRegister,
    handleLogin,
    handleRefresh,
    handleGetme,
    handleLogout,
  };
}
