import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get the current path to determine which token to use
    const path = window.location.pathname;
    let token;

    // Select token based on the path
    if (path.startsWith("/admin")) {
      token = localStorage.getItem("adminToken");
    } else if (path.startsWith("/store")) {
      token = localStorage.getItem("storeToken");
    } else {
      token = localStorage.getItem("userToken");
    }

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
