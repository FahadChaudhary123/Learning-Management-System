import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // ✅ enable cookies/session tokens
});
console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

export const setAuthToken = (token) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;
