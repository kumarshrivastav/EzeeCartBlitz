import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
export const userRegister = (data) => api.post("/api/user/register", data);
export const userLogin = (data) => api.post("/api/user/login", data);
export const logoutuser = () => api.get("/api/user/logout");
export const updateprofile = (userId, data) =>
  api.put(`/api/user/updateprofile/${userId}`, data);
export const currentpwdstatus = (userId, data) =>
  api.post(`/api/user/currentpwdstatus/${userId}`, data);
export const addProduct = (userId, data) =>
  api.post(`/api/product/addproduct/${userId}`, data);
export const getProducts = () => api.get("/api/product/getproducts");
export const singleProduct = (productId) =>
  api.get(`/api/product/singleproduct/${productId}`);
export const similarProductsFromServer = (queryParams) =>
  api.get(`/api/product/similarproducts?${queryParams}`);
export const updateProduct = (userId, productId, formData) =>
  api.post(`/api/product/updateproduct/${userId}/${productId}`, formData);
