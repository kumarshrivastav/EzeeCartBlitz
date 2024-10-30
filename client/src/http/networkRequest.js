import axios from "axios";
export const userRegister = (data) => axios.post("/api/user/register", data);
export const userLogin = (data) => axios.post("/api/user/login", data);
export const logoutuser = () => axios.get("/api/user/logout");
export const updateprofile = (userId, data) =>
  axios.put(`/api/user/updateprofile/${userId}`, data);
export const currentpwdstatus = (userId, data) =>
  axios.post(`/api/user/currentpwdstatus/${userId}`, data);
export const addProduct = (userId, data) =>
  axios.post(`/api/product/addproduct/${userId}`, data);
export const getProducts = () => axios.get("/api/product/getproducts");
export const singleProduct = (productId) =>
  axios.get(`/api/product/singleproduct/${productId}`);
export const similarProductsFromServer = (queryParams) =>
  axios.get(`/api/product/similarproducts?${queryParams}`);
export const updateProduct = (userId, productId, formData) =>
  axios.post(`/api/product/updateproduct/${userId}/${productId}`, formData);
// export const createCheckoutSession = (userId, customerInfo, cartItems) =>
//   axios.post(`/api/product/create-checkout-session/${userId}`, {
//     products: cartItems,
//     customerInfo,
//   });
export const checkout_payment_intent = (userId, customerInfo, products) =>
  axios.post(`/api/product/create-payment-intent/${userId}`, {
    products,
    customerInfo,
  });
export const resetPasswordByGmail = (email, data) =>
  axios.put(`/api/user/resetpasswordbygmail/${email}`, data);
export const passwordResetLink = (email) =>
  axios.post(`/api/user/passwordresetlink/${email}`);
export const deleteProductById = (productId) =>
  axios.delete(`/api/product/delete-product-by-id/${productId}`);
export const productOnSearchTerm = (urlParams) =>
  axios.get(`/api/product/productbysearch?${urlParams}`);
export const productOnSelect = (urlParams) =>
  axios.get(`/api/product/productbyselect?${urlParams}`);
