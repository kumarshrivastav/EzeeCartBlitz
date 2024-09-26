import React, { useEffect, useState } from "react";
import Products from "../components/Products/Products";
import { useDispatch, useSelector } from "react-redux";
import { allProductsFromDB, setDefaultProducts } from "../redux/productSlice";
import { getProducts } from "../http/networkRequest";
// import {v4 as uuid} from "uuid"
const Home = () => {
  const dispatch=useDispatch()
  const [allProducts,setAllProducts]=useState([])
  const {products,searchTerm,productsFromSearch,selectedCategory} = useSelector((state) => state.products);
  console.log(products)
  console.log(searchTerm)
  useEffect(()=>{
    const getAllProducts=async()=>{
      try {
        if(products?.length!==0){
          if(searchTerm?.length>0  || selectedCategory!=="All"){
            setAllProducts(productsFromSearch)
          }else{
            setAllProducts(products)
          }
          console.log('product from store')
        }else{
          const {data}=await getProducts()
          console.log(data)
          console.log('products from db')
          setAllProducts(data)
          dispatch(allProductsFromDB(data))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getAllProducts()
    // dispatch(setDefaultProducts())
  },[products,searchTerm,productsFromSearch,selectedCategory])
  return <Products data={allProducts} />;
};

export default Home;
