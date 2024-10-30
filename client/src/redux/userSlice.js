import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  user: null,
  error: null,
  customerInfo: {},
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoginStart: (state, action) => {
      state.loading = true;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
    removeCustomerInfo: (state, action) => {
      state.customerInfo = null;
    },
    userLoginFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    userLogoutStart: (state, action) => {
      state.loading = true;
    },
    userLogoutSuccess: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    userLogoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    userUpdateSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    userUpdateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  userLoginStart,
  userLoginSuccess,
  userLoginFailure,
  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,
  userUpdateFailure,
  userUpdateStart,
  userUpdateSuccess,
  setCustomerInfo,
  removeCustomerInfo,
} = userSlice.actions;

export default userSlice.reducer;
