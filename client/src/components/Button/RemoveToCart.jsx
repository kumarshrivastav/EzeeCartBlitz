import React from "react";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { toggleToAddAndRemoveItem } from "../../redux/cartSlice";
const RemoveToCart = ({product}) => {
  const dispatch = useDispatch();
  const handleClick = () => {   
    dispatch(toggleToAddAndRemoveItem(product));
  };
  return (
    <Button outline gradientDuoTone={"redToYellow"}  onClick={handleClick} className="w-full font-serif">
      Remove From Cart
    </Button>
  );
};

export default RemoveToCart;
