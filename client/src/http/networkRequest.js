import axios from "axios";
// const api = axios.create({
//   baseURL: "http://localhost:8000",
//   withCredentials: true,
// });
export const userRegister = (data) => axios.post("/api/user/register", data);
export const userLogin = (data) => axios.post("/api/user/login", data);
export const logoutuser = () => axios.get("/api/user/logout");
export const updateprofile = (userId, data) =>
  axios.put(`/api/user/updateprofile/${userId}`, data);
export const currentpwdstatus = (userId, data) =>
  axios.post(`/api/user/currentpwdstatus/${userId}`, data);
export const addProduct = (userId, data) =>
  axios.post(`/api/product/addproduct/${userId}`, data);
export const getProducts = () => api.get("/api/product/getproducts");
export const singleProduct = (productId) =>
  axios.get(`/api/product/singleproduct/${productId}`);
export const similarProductsFromServer = (queryParams) =>
  axios.get(`/api/product/similarproducts?${queryParams}`);
export const updateProduct = (userId, productId, formData) =>
  axios.post(`/api/product/updateproduct/${userId}/${productId}`, formData);
