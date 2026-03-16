import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  handleRefresh as refreshApi,
} from "../services/auth.api";
import {
  setUser,
  setLoading,
  setError,
  setAccessToken,
  setMessage,
} from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const user = await register({ username, email, password });
      dispatch(setUser(user));
      dispatch(setMessage("Registration successful"));
      return user;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Registration failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const result = await login({ email, password });
      // backend should return { accessToken, user }
      dispatch(setAccessToken(result.accessToken));
      dispatch(setUser(result.user ?? result));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleRefresh() {
    try {
      dispatch(setLoading(true));
      const result = await refreshApi();
      dispatch(setAccessToken(result.accessToken));
       return result
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Refresh failed"));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetme() {
    try {
      dispatch(setLoading(true));
      const user = await getMe();
      dispatch(setUser(user));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to fetch user details",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleRefresh, handleGetme };
}
