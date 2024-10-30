import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
  cartProductsFreq: [],
};

export const cartSlice = createSlice({
  initialState,
  name: "cart",
  reducers: {
    toggleToAddAndRemoveItem: (state, action) => {
      let index = state.cartItems.findIndex(
        (product) => product._id === action.payload._id
      );
      state.cartItems.splice(index, 1);
      if (state.cartProductsFreq.length > 0) {
        let index = state.cartProductsFreq.findIndex(
          ({ product }) => product?._id === action.payload?._id
        );
        state.cartProductsFreq.splice(index, 1);
      }
    },
    toggelToRemoveAndAddItem: (state, action) => {
      let freq = 1,
        product = action.payload;
      state.cartProductsFreq.push({ freq, product });
      state.cartItems.push(action.payload);
    },
    productIncrementDecrement: (state, action) => {
      const { symbol, product } = action.payload;
      if (symbol === "+1") {
        state.cartProductsFreq = state.cartProductsFreq.map(
          ({ freq, product: p }) => {
            if (p?._id === product?._id) {
              state.cartItems?.push(product);
              freq += 1;
              return { freq, product: p };
            }
            return { freq, product: p };
          }
        );
      } else {
        state.cartProductsFreq = state.cartProductsFreq.map(
          ({ freq, product: p }) => {
            if (p?._id === product?._id) {
              let index = state.cartItems?.findIndex(
                (p) => p._id === product?._id
              );
              state.cartItems?.splice(index, 1);
              freq -= 1;
              return { freq, product: p };
            }
            return { freq, product: p };
          }
        );
      }
      state.cartProductsFreq = state.cartProductsFreq.filter(
        ({ freq }) => freq !== 0
      );
    },
    cartBuyProducts: (state) => {
      state.cartProductsFreq = [];
      state.cartItems = [];
      window.localStorage.removeItem("cart");
    },
  },
});

export const {
  toggelToRemoveAndAddItem,
  toggleToAddAndRemoveItem,
  productIncrementDecrement,
  cartBuyProducts,
} = cartSlice.actions;
export default cartSlice.reducer;
