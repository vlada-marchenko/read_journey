import React, {
  useContext,
  useEffect,
  useState,
  createContext,
  useMemo,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  refreshToken,
  type LoginData,
  type RegisterData,
  type User,
} from "../api/auth";
import { useRef } from "react";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (payload: LoginData) => Promise<void>;
  register: (payload: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const initRef = useRef(false); // does not reset on re-render

  const saveTokens = (token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
  };

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true; // first time effect runs sets to true
    (async () => {
      try {
        const rt = localStorage.getItem("refreshToken");
        if (!rt) {
          setLoading(false);
          return;
        }
        const access = localStorage.getItem("token");

        if (access) {
          try {
            const me = await getCurrentUser();
            setUser(me);
            return;
          } catch {
            // access token might be expired -> fall through to refresh
          }
        }

        if (!rt) {
          clearTokens();
          setUser(null);
          return;
        }

        const refreshed = await refreshToken(); // backend return new access token and refresh token
        saveTokens(refreshed.token, refreshed.refreshToken); // save new tokens to localStorage
        const currentUser = await getCurrentUser(); // needs bearer and backend return user data
        setUser(currentUser); // put user data to state
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []); // Empty dependency array ensures this runs once on mount

  async function login(payload: LoginData) {
    const data = await loginUser(payload);
    saveTokens(data.token, data.refreshToken);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function register(payload: RegisterData) {
    const data = await registerUser(payload);
    saveTokens(data.token, data.refreshToken);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      clearTokens();
      setUser(null);
    }
  }

  async function refresh() {
    const data = await refreshToken();
    saveTokens(data.token, data.refreshToken);
  }

  const value = useMemo(
    //create a memoized value object that is passed to authContext
    () => ({
      // useMemo does not recreate the object unless one of its dependencies change
      user, // builds an object with user, token, loading, login, register, logout, refresh
      token,
      loading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
