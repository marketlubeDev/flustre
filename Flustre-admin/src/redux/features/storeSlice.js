import { createSlice } from "@reduxjs/toolkit";

export const storeSlice = createSlice({
  name: "store",
  initialState: {
    store: null,
  },
  reducers: {
    setStore: (state, action) => {
      state.store = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStore } = storeSlice.actions;

export default storeSlice.reducer;
