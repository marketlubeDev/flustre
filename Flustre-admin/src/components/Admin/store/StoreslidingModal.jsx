import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { addStore, updateStore } from "../../../sevices/storeApis";
import { toast } from "react-toastify";

const StoreSlidingModal = ({
  isOpen,
  onClose,
  editData = null,
  setRefetch,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState({
    storeName: "",
    storeNumber: "",
    email: "",
    login_phoneNumber: "",
    password: "",
    confirmPassword: "",
    locality: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    activeStatus: true,
  });

  const [errors, setErrors] = useState({
    storeName: "",
    storeNumber: "",
    email: "",
    login_phoneNumber: "",
    password: "",
    confirmPassword: "",
    locality: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (editData) {
      setValues({
        storeName: editData.store_name || "",
        storeNumber: editData.store_number || "",
        email: editData.email || "",
        login_phoneNumber: editData.login_number || "",
        password: editData.password || "",
        confirmPassword: editData.password || "",
        locality: editData?.address?.area || "",
        city: editData?.address?.city || "",
        district: editData?.address?.district || "",
        state: editData?.address?.state || "",
        pincode: editData?.address?.pincode || "",
        activeStatus: editData?.activeStatus !== undefined ? editData.activeStatus : true,
      });
    } else {
      // Reset form when opening in create mode
      setValues({
        storeName: "",
        storeNumber: "",
        email: "",
        login_phoneNumber: "",
        password: "",
        confirmPassword: "",
        locality: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        activeStatus: true,
      });
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Reset errors when modal opens/closes
    setErrors({
      storeName: "",
      storeNumber: "",
      email: "",
      login_phoneNumber: "",
      password: "",
      confirmPassword: "",
      locality: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    });
  }, [editData, isOpen]);

  // Validate email format
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate phone number format (10 digits)
  const validatePhoneNumber = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
  };

  // Validate store number format (10 digits)
  const validateStoreNumber = (storeNumber) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(storeNumber));
  };

  // Validate pincode format (6 digits)
  const validatePincode = (pincode) => {
    const re = /^[0-9]{6}$/;
    return re.test(String(pincode));
  };

  // Validate password
  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    return re.test(String(password));
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Store Name validation
    if (!values?.storeName?.toString().trim()) {
      newErrors.storeName = "Store name is required";
      isValid = false;
    } else if (values.storeName.toString().trim().length < 3) {
      newErrors.storeName = "Store name must be at least 3 characters";
      isValid = false;
    } else {
      newErrors.storeName = "";
    }

    // Store Number validation
    if (!values?.storeNumber?.toString().trim()) {
      newErrors.storeNumber = "Store number is required";
      isValid = false;
    } else if (!validateStoreNumber(values.storeNumber.toString().trim())) {
      newErrors.storeNumber = "Please enter a valid 10-digit store number";
      isValid = false;
    } else {
      newErrors.storeNumber = "";
    }

    // Email validation
    if (!values?.email?.toString().trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(values.email.toString().trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    // Phone Number validation
    if (!values?.login_phoneNumber?.toString().trim()) {
      newErrors.login_phoneNumber = "Phone number is required";
      isValid = false;
    } else if (
      !validatePhoneNumber(values.login_phoneNumber.toString().trim())
    ) {
      newErrors.login_phoneNumber =
        "Please enter a valid 10-digit phone number";
      isValid = false;
    } else {
      newErrors.login_phoneNumber = "";
    }

    // Password validation (only for new stores or if password is changed)
    if (!editData || (editData && values?.password !== editData?.password) || editData?.password !== editData?.confirmPassword) {
      if (!values?.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (!validatePassword(values?.password.toString())) {
        newErrors.password =
          "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character";
        isValid = false;
      } else {
        newErrors.password = "";
      }

      // Confirm Password validation
      if (!values?.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (
        values?.password?.toString() !== values?.confirmPassword?.toString()
      ) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      } else {
        newErrors.confirmPassword = "";
      }
    } else {
      newErrors.password = "";
      newErrors.confirmPassword = "";
    }

    // Address validation
    if (!values?.locality?.toString().trim()) {
      newErrors.locality = "Locality is required";
      isValid = false;
    } else {
      newErrors.locality = "";
    }

    if (!values?.city?.toString().trim()) {
      newErrors.city = "City is required";
      isValid = false;
    } else {
      newErrors.city = "";
    }

    if (!values?.district?.toString().trim()) {
      newErrors.district = "District is required";
      isValid = false;
    } else {
      newErrors.district = "";
    }

    if (!values?.state?.toString().trim()) {
      newErrors.state = "State is required";
      isValid = false;
    } else {
      newErrors.state = "";
    }

    if (!values?.pincode?.toString().trim()) {
      newErrors.pincode = "Pincode is required";
      isValid = false;
    } else if (!validatePincode(values.pincode.toString().trim())) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
      isValid = false;
    } else {
      newErrors.pincode = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const formData = {
        store_name: values.storeName,
        store_number: values.storeNumber,
        email: values.email,
        login_number: values.login_phoneNumber,
        password: values.password,
        address: {
          area: values.locality,
          city: values.city,
          district: values.district,
          state: values.state,
          pincode: values.pincode,
        },
        activeStatus: values.activeStatus,
      };

      if (editData) {
        const response = await updateStore(formData, editData._id);

        if (response?.success) {
          setRefetch((prev) => !prev);
          toast.success(response?.message || "Store updated successfully");
          onClose();
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      } else {
        const response = await addStore(formData);

        if (response?.success) {
          setRefetch((prev) => !prev);
          toast.success(response?.message || "Store created successfully");
          onClose();
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

 

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-[500px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="p-6 h-full overflow-y-auto pb-24">
          <h2 className="text-xl font-semibold mb-2">
            {editData ? "Edit store" : "Add store"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {editData ? "Update store details" : "Create a new store entry"}
          </p>

          <form className="space-y-6 mb-20">
            <div>
              <p className="font-medium mb-4">STORE DETAILS</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Store name</label>
                  <input
                    type="text"
                    placeholder="e.g. Northlux Official Outlet"
                    className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                      errors.storeName ? "border-red-500" : ""
                    }`}
                    value={values.storeName}
                    onChange={(e) =>
                      setValues({ ...values, storeName: e.target.value })
                    }
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.storeName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Store Number</label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="9999 555 666"
                        className={`w-full p-2 border rounded-r focus:outline-none focus:border-[#259960] ${
                          errors.storeNumber ? "border-red-500" : ""
                        }`}
                        value={values.storeNumber}
                        onChange={(e) =>
                          setValues({ ...values, storeNumber: e.target.value })
                        }
                      />
                    </div>
                    {errors.storeNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.storeNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email address</label>
                    <input
                      type="email"
                      placeholder="e.g. storename@gmail.com"
                      className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      value={values.email}
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-4">LOGIN CREDENTIALS</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Phone number</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="9999 555 666"
                      className={`w-full p-2 border rounded-r focus:outline-none focus:border-[#259960] ${
                        errors.login_phoneNumber ? "border-red-500" : ""
                      }`}
                      value={values.login_phoneNumber}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          login_phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  {errors.login_phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.login_phoneNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        value={values.password}
                        onChange={(e) =>
                          setValues({ ...values, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5 text-gray-400"
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        value={values.confirmPassword}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 top-2.5 text-gray-400"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-4">ADDRESS</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Locality/area</label>
                    <input
                      type="text"
                      placeholder="e.g. Vylle"
                      className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                        errors.locality ? "border-red-500" : ""
                      }`}
                      value={values.locality}
                      onChange={(e) =>
                        setValues({ ...values, locality: e.target.value })
                      }
                    />
                    {errors.locality && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.locality}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Kochi"
                      className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                        errors.city ? "border-red-500" : ""
                      }`}
                      value={values.city}
                      onChange={(e) =>
                        setValues({ ...values, city: e.target.value })
                      }
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">District</label>
                    <input
                      type="text"
                      placeholder="e.g. Ernakulam"
                      className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                        errors.district ? "border-red-500" : ""
                      }`}
                      value={values.district}
                      onChange={(e) =>
                        setValues({ ...values, district: e.target.value })
                      }
                    />
                    {errors.district && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.district}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Kerala"
                      className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                        errors.state ? "border-red-500" : ""
                      }`}
                      value={values.state}
                      onChange={(e) =>
                        setValues({ ...values, state: e.target.value })
                      }
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 682 019"
                    className={`w-full p-2 border rounded focus:outline-none focus:border-[#259960] ${
                      errors.pincode ? "border-red-500" : ""
                    }`}
                    value={values.pincode}
                    onChange={(e) =>
                      setValues({ ...values, pincode: e.target.value })
                    }
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex justify-end gap-4 shadow-lg">
          <div className="flex items-center gap-2 mr-auto">
            <span className="text-sm font-medium text-gray-700">Active Status:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={values.activeStatus}
                onChange={(e) => setValues({ ...values, activeStatus: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-[#259960] text-white rounded hover:bg-[#1e7a4c]"
            onClick={handleSubmit}
          >
            {editData ? "Update store" : "Create store"}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default StoreSlidingModal;
