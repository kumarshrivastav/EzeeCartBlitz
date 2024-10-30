import React from "react";
import { Card, Button, List } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidV4 } from "uuid";
import CardNumber from "../components/Cart/CartNumber";
import CartItem from "../components/Cart/CartItem";
import Line from "../components/Single/Line";
import { cartBuyProducts } from "../redux/cartSlice";
const Cart = () => {
  const { cartProductsFreq } = useSelector((state) => state.cart);
  const nav = useNavigate();
  return cartProductsFreq.length === 0 ? (
    <Card className="w-72 lg:max-w-screen-sm mx-auto text-center mt-10 bg-slate-400">
      <h1 className="lg:text-2xl font-serif">
        No Product Available in Your Cart
      </h1>
      <Button
        gradientDuoTone={"tealToLime"}
        outline
        onClick={() => nav("/")}
        className="font-semibold font-serif"
      >
        Browse Products
      </Button>
    </Card>
  ) : (
    <div className="flex flex-col my-4 mx-2 md:mx-32">
      <h1 className="text-[16px] lg:text-xl font-serif font-semibold text-white text-center">
        Cart
      </h1>
      <List unstyled className="border-2 border-dashed my-3">
        {cartProductsFreq.map(({ freq, product }) => {
          return (
            <div key={uuidV4()} className="bg-white">
              {freq > 0 && (
                <>
                  <CartItem key={uuidV4()} product={product} freq={freq} />
                  <hr className="mt-0 border-dashed" />
                </>
              )}
            </div>
          );
        })}
      </List>
      <CardNumber />
    </div>
  );
};

export default Cart;
