import React from "react";
import { Avatar, Button, List } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidV4 } from "uuid";
import { productIncrementDecrement } from "../../redux/cartSlice";
const CartItem = ({ product, freq }) => {
  const { cartProductsFreq } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const handleDecrement = () => {
    dispatch(productIncrementDecrement({ symbol: "-1", product }));
  };
  const handleIncrement = () => {
    dispatch(productIncrementDecrement({ symbol: "+1", product }));
  };
  console.log(product);
  return (
    <List.Item className="p-1 mb-2">
      <div className="flex justify-between my-2 items-center">
        <div className="flex  justify-between items-center w-full">
          <div className="flex-1">
            <h1 className="text-[12px] font-semibold lg:text-xl text-black font-serif">
              {product.name}&nbsp;({product.price})
            </h1>
          </div>
          <div className="flex-1 flex justify-center gap-2">
            <Avatar.Group>
              {product?.images &&
                product?.images?.map((image) => (
                  <Avatar key={uuidV4()} img={image} rounded stacked />
                ))}
            </Avatar.Group>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex items-center">
              <button
                onClick={handleDecrement}
                className="px-2 py-1 bg-gray-200 rounded-l"
              >
                -
              </button>
              <div className="px-3 py-1 bg-white">{freq}</div>
              <button
                onClick={handleIncrement}
                className="px-2 py-1 bg-gray-200 rounded-r"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </List.Item>
  );
};

export default CartItem;
