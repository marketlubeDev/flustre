import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkStore } from "../../sevices/storeApis";

function StoreProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    checkStore()
      .then((res) => {
        return children;
      })
      .catch((err) => {
        navigate("/");
        toast.error("You are not authorized to access this page please login");
      });
  }, []);
  return children;
}

export default StoreProtectedRoute;
