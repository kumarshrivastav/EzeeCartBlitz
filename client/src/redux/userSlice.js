import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  user: null,
  error: null,
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
      state.loading = true
      state.error = null
    },
    userUpdateSuccess: (state, action) => {
      console.log(action.payload)
      state.loading = false
      state.user = action.payload
      state.error = null
    },
    userUpdateFailure: (state, action) => {
      state.loading = false
      state.error = action.payload

    }
  },
});

export const {
  userLoginStart,
  userLoginSuccess,
  userLoginFailure,
  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,
  userUpdateFailure, userUpdateStart, userUpdateSuccess
} = userSlice.actions;

export default userSlice.reducer