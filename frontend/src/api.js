import axios from "axios";

const envBaseUrl = import.meta.env.VITE_API_URL;
const hostedFallback = "https://taskmanangment-production-fcf1.up.railway.app/api";

const baseURL = envBaseUrl
  ? envBaseUrl.replace(/\/+$/g, "")
  : hostedFallback;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
