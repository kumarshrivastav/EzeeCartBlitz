import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Rating } from "flowbite-react";
import AddToCart from "../Button/AddToCart";
import RemoveToCart from "../Button/RemoveToCart";
import { useSelector } from "react-redux";
import {v4 as uuid} from "uuid"
// these four line for image sliding
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
// above four line for image sliding
const Product = ({ product }) => {
  const { addToCartButton, cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const imgPath = `/images/${product.id}.jpg`;
  // console.log(product)
  return (
    <div >
      <div className="flex flex-col justify-between mx-auto  bg-white h-[340px] w-80 rounded-lg p-1">
      <div>
      <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]} className="w-full h-full">
        {product?.images?.map((image) => (
          <SwiperSlide className="flex justify-items-center items-center" key={uuid()}>
            <img
              src={image}
              alt={product.name}
              className="h-32 w-full object-contain cursor-pointer mb-5"
              title={product.name}
              onClick={() => navigate(`/single/${product._id}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
        {/* <img
          src={product?.images[0]}
          alt={product.name}
          className="h-32 w-full object-contain cursor-pointer"
          title={product.name}
          onClick={() => navigate(`/single/${product._id}`)}
        /> */}
      </div>
      <div className="">
        <div className="p-1 flex flex-col gap-1 ">
    
          <p className="font-serif text-sm font-semibold">
            Name : {product?.name}
          </p>
          <span className="font-semibold text-sm font-serif">
            Product Price : &#8377;{product?.price}
          </span>
          <div className="flex flex-row">
            <span className="font-serif font-semibold text-sm">Product Rating :&nbsp;</span>
          {/* <div className="flex items-center gap-2 mt-2"> */}
                <Rating>
                  {
                    Array.from({length:5},(_,i)=>(
                      +product.rating>i ? (<Rating.Star key={i} filled={true}/>):(<Rating.Star key={i} filled={false}/>)
                    ))
                  }
                </Rating>
                
              {/* </div> */}
          </div>
          <p className="font-serif text-sm text-justify text-gray-500 line-clamp-2">
            Description : {product?.description}
          </p>
          
        </div>

      </div>
      <div className="mb-1">
            {cartItems.findIndex((item)=>item?._id===product?._id) === -1 ? (
              <AddToCart product={product} />
            ) : (
              <RemoveToCart product={product} />
            )}
          </div>
      </div>
    </div>
    // <Card className="h-96 w-72">
    //   <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]} className="w-full h-full">
    //     {product?.images?.map((image) => (
    //       <SwiperSlide className="flex justify-items-center items-center">
    //         <img
    //           src={image}
    //           alt={product.name}
    //           className="h-32 w-full object-contain cursor-pointer"
    //           title={product.name}
    //           onClick={() => navigate(`/single/${product._id}`)}
    //         />
    //       </SwiperSlide>
    //     ))}
    //   </Swiper>
    //   <h4 className="text-black text-sm font-semibold font-serif">
    //     {product.name}
    //   </h4>
    //   <h5 className="text-black font-bold text-sm font-sans">
    //     Price:&nbsp;<span>&#8377;&nbsp;{product.price}</span>
    //   </h5>
    //   <p className="text-sm text-gray-400 line-clamp-2 text-[14px] font-serif">
    //     <span className="font-semibold">Description : </span>
    //     {product.description}
    //   </p>
    //   {cartItems.indexOf(JSON.stringify(product)) === -1 ? (
    //     <AddToCart product={product} />
    //   ) : (
    //     <RemoveToCart product={product} />
    //   )}
    // </Card>
  );
};

export default Product;
