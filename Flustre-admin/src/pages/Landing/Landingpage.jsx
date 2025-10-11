import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import admin from "../../assets/admin.png";
import store from "../../assets/store.png";
import Logo from "../../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import {
  setStores,
  setBrands,
  setCategories,
} from "../../redux/features/AdminUtilities";
import { getStores } from "../../sevices/storeApis";
import { getAllBrands } from "../../sevices/brandApis";
import { getAllCategories } from "../../sevices/categoryApis";
import { toast } from "react-toastify";

const Landingpage = () => {
  const loggedInUser = useSelector((state) => state.store.store);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [storesRes, brandsRes, categoriesRes] = await Promise.all([
          getStores(),
          getAllBrands(),
          getAllCategories(),
        ]);
        dispatch(setStores(storesRes.stores));
        dispatch(setBrands(brandsRes.data.brands));
        dispatch(setCategories(categoriesRes.envelop.data));
      } catch (error) {
        toast.error("Failed to fetch initial data");
      }
    };

    fetchAllData();
  }, [dispatch]);

  // Separate useEffect to track store changes
  useEffect(() => {}, [loggedInUser]);

  const roles = [
    {
      id: "admin",
      title: "Login",
      icon: (
        <div className=" p-8">
          <img src={admin} alt="login" />
        </div>
      ),
    },
  ];

  const handleContinue = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
          <p className="text-gray-600">
            Select your role to access the tools and controls made just for you.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`
                relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                ${
                  selectedRole === role.id
                    ? "ring-2 ring-green-500 ring-offset-2 scale-105"
                    : "hover:bg-white hover:shadow-lg"
                }
              `}
            >
              <div className="flex flex-col items-center gap-4">
                {role.icon}
                <span className="text-lg font-medium">{role.title}</span>
              </div>
              {selectedRole === role.id && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-12">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all duration-300
              ${
                selectedRole
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
};

export default Landingpage;
