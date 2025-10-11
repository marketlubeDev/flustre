import { createSlice } from "@reduxjs/toolkit";

export const adminUtilitiesSlice = createSlice({
  name: "adminUtilities",
  initialState: {
    stores: [],
    brands: [],
    categories: [],
  },
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStores, setBrands, setCategories } =
  adminUtilitiesSlice.actions;

export default adminUtilitiesSlice.reducer;
