import React from "react";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { cartBuyProducts } from "../../redux/cartSlice";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
const CartBuyButton = () => {
  const { user } = useSelector((state) => state.users);

  const nav = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const handleBuyProducts = () => {
    dispatch(cartBuyProducts());
    nav("/");
    alert("Your cart products shipping successfully!");
    // window.location.reload()
  };
  const handleSignInProducts = () => {
    nav("/login", { state: { from: location.pathname } });
  };
  return (
    <>
      {user ? (
        <Button
          outline
          gradientDuoTone={"tealToLime"}
          className="w-full"
          onClick={handleBuyProducts}
          
        >
          <span className="text-sm lg:text-lg font-serif font-semibold">Buy</span>
        </Button>
      ) : (
        <Button
          outline
          gradientDuoTone={"tealToLime"}
          className="w-full"
          onClick={handleSignInProducts}
        >
          <span className="lg:text-lg font-serif font-semibold text-sm">
            Sign In to Buy
          </span>
        </Button>
      )}
    </>
  );
};

export default CartBuyButton;
