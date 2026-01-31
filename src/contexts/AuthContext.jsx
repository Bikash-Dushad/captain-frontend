import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { fetchData } from "../api/apiService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("captainToken");
    setToken(storedToken);
  }, []);

  const fetchCaptainProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetchData("captain/api/captain/captainProfile");
      if (response?.responseCode === 200) {
        setCaptain(response.data);
      } else {
        console.log("error in fetch captain profile context ");
        setCaptain(null);
      }
    } catch (error) {
      console.log("error in fetch captain profile context ", error);
      setCaptain(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCaptainProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchCaptainProfile]);

  const value = useMemo(
    () => ({
      captain,
      setCaptain,
      loading,
      isAuthenticated: !!token,
      isRegistered: captain?.isRegistered || false,
      fetchCaptainProfile,
      setToken: (newToken) => {
        localStorage.setItem("captainToken", newToken);
        setToken(newToken);
      },
    }),
    [captain, loading, token, fetchCaptainProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
