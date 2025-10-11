import React, { useEffect } from "react";
import { checkAdmin } from "../../sevices/adminApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    checkAdmin()
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

export default ProtectedRoute;
