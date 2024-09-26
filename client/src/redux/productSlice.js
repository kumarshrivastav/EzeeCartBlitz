import { createSlice } from "@reduxjs/toolkit";
import data from "../data.js";
import { uniq, sortBy, cloneDeep } from "lodash";
import stringSimilarity from "string-similarity-js";
const categories = uniq(data.map((product) => product.category)).sort();
const DEFAULT_CATEGORY = "All";
const initialState = {
  products: [],
  originalProducts: [],
  loading: false,
  error: null,
  productsFromSearch: data,
  categories: [DEFAULT_CATEGORY, ...categories],
  selectedCategory: DEFAULT_CATEGORY,
  singleProduct: {},
  searchTerm: "",
  similarProducts: [],
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProductToStoreStart: (state) => {
      state.loading = true;
    },
    allProductsFromDB:(state,action)=>{
      console.log(action.payload)
      state.products=action.payload
    },
    addProductToStoreSuccess: (state, action) => {
      state.loading = false;
      console.log(action)
      state.originalProducts.push(action?.payload);
      state.error = null;
    },
    addProductToStoreFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProductToStore:(state,action)=>{
      const {productId,product}=action.payload
      // const updatedProduct=state.products.find((product)=>product?._id===productId)
      console.log(action.payload)
      const index=state.products.findIndex((product)=>product?._id===productId)
      state.products.splice(index,1)
      state.products[index]=product
    },
    setSearchTerm: (state, action) => {
      const { payload: searchTerm } = action;
      state.searchTerm = searchTerm;
      state.productsFromSearch = state.products;
      if (state.searchTerm.length > 0) {
        state.productsFromSearch.forEach((p) => {
          p.simScore = stringSimilarity(`${p.name} ${p.category}`, searchTerm);
        });
        state.productsFromSearch = sortBy(
          state.productsFromSearch,
          "simScore"
        ).reverse();
        // state.products.forEach((p)=>{
        //   p.simScore=stringSimilarity(`${p.name} ${p.category}`,searchTerm)
        // })
        // state.products=sortBy(state.products,"simScore").reverse();
      }
    },
    setDefaultProducts: (state) => {
      state.productsFromSearch = state.products;
      state.selectedCategory = DEFAULT_CATEGORY;
    },
    setSelectedCategory: (state, action) => {
      const { payload: selectedCategory } = action;
      state.searchTerm = "";
      state.selectedCategory = selectedCategory;
      state.productsFromSearch = state.products;
      if (state.selectedCategory === DEFAULT_CATEGORY) {
        state.productsFromSearch = state.products;
      } else {
        state.productsFromSearch = state.productsFromSearch.filter(
          (p) => p.category === state.selectedCategory
        );
      }
    },
    setSingleProduct: (state, action) => {
      const { payload: id } = action;
      console.log(id)
      state.singleProduct = state.products.find(
        (product) => product._id === id
      );
      console.log(state.singleProduct)
      state.similarProducts = state.products.filter(
        (product) =>
          product.category === state.singleProduct?.category &&
          product._id !== state.singleProduct?._id
      );
      console.log(state.similarProducts)
    },
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSingleProduct,
  setDefaultProducts,
  addProductToStoreStart,
  addProductToStoreFailure,
  addProductToStoreSuccess,
  updateProductToStore,
  allProductsFromDB
} = productSlice.actions;
export default productSlice.reducer;
