import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import cartSlice from "./cartSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./userSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    products: productReducer,
    cart: cartSlice,
    users: userSlice,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);
export default persistor;
