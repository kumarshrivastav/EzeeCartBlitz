import React, { useEffect, useState } from "react";
import Products from "../components/Products/Products";
import { useDispatch, useSelector } from "react-redux";
import { allProductsFromDB, setDefaultProducts } from "../redux/productSlice";
import { getProducts } from "../http/networkRequest";
import toast from "react-hot-toast";
// import {v4 as uuid} from "uuid"
const Home = () => {
  const dispatch=useDispatch()
  const [allProducts,setAllProducts]=useState([])
  const {products,searchTerm,productsFromSearch,selectedCategory} = useSelector((state) => state.products);
  useEffect(()=>{
    const getAllProducts=async()=>{
      try {
        const {data}=await getProducts()
        setAllProducts(data)
        dispatch(allProductsFromDB(data))
        console.log(data)
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
      }
    }
    getAllProducts()
  },[])
  return <Products data={products} />;
};

export default Home;
