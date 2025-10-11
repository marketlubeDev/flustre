import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../sevices/adminApis";
import { toast } from "react-toastify";
import Logo from "../../../public/logo/souqalmart-logo-name.svg";
function LoginComponent() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onlogin = async () => {
    const { email, password } = values;
    if (!email || !password) {
      return toast.error("All fields are required");
    }

    setIsLoading(true);
    try {
      const res = await adminLogin({ email, password });
      toast.success(res?.data?.message);
      localStorage.setItem("adminToken", res?.data?.token);
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      onlogin();
    }
  };

  return (
    <div className="h-screen flex items-center w-full">
      <div className="w-1/2 bg-[var(--color-primary)] h-full hidden md:flex  items-center justify-center">
        <img
          src={
            "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/sukalmart/Logo/souqalmart-logo-white.svg"
          }
          alt="logo image"
          className="w-[20rem]"
        />
      </div>
      <div className="w-full md:w-1/2 flex justify-center p-3 md:p-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome Back!
            </h1>
            <form className="space-y-4 md:space-y-6" onKeyDown={handleKeyPress}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  onChange={onChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={onChange}
                  disabled={isLoading}
                />
              </div>
              {/* <div className="flex items-center justify-center">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div> */}

              <button
                type="button"
                className={`text-white w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary)] font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={onlogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
