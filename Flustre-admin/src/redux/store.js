import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storeReducer from "./features/storeSlice";
import adminUtilitiesReducer from "./features/AdminUtilities";
import productCreationReducer from "./features/productCreationSlice";

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["store", "adminUtilities"],
};

const persistedReducer = persistReducer(persistConfig, storeReducer);
const persistedAdminUtilitiesReducer = persistReducer(
  persistConfig,
  adminUtilitiesReducer
);

const store = configureStore({
  reducer: {
    store: persistedReducer,
    adminUtilities: persistedAdminUtilitiesReducer,
    productCreation: productCreationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
