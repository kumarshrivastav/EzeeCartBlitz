import React from "react";
import { Button,List } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { productIncrementDecrement } from "../../redux/cartSlice";
const CartItem = ({ product,freq }) => {
  const {cartProductsFreq}=useSelector(state=>state.cart)
  const dispatch=useDispatch()
  const handleDecrement=()=>{
    dispatch(productIncrementDecrement({symbol:"-1",product}))
  }
  const handleIncrement=()=>{
    dispatch(productIncrementDecrement({symbol:"+1",product}))
  }
  return (
        <List.Item className="p-1 mb-2">
          <div className="flex justify-between my-2 items-center">
            <h1 className="text-sm font-semibold lg:text-xl text-white font-serif">{product.name}&nbsp;({product.price})</h1>
            <Button.Group className="flex items-center lg:h-10">
              <Button onClick={handleDecrement}>-</Button>
              <Button>{freq}</Button>
              <Button onClick={handleIncrement}>+</Button>
            </Button.Group>
          </div>
          <p className="font-serif text-[12px] text-justify text-gray-300 line-clamp-2">{product.description}</p>
        </List.Item>
        
  );
};

export default CartItem;
