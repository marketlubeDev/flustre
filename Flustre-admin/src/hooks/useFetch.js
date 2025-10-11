import { useState, useEffect } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { toast } from "react-toastify";

export const useFetch = (url, options , resPath) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url, options);
      setData(resPath ? response.data[resPath] : response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return [data, loading, error, fetchData];
};
