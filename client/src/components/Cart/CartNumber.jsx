import React, { Fragment, useRef, useState } from "react";
import { Button, List } from "flowbite-react";
import { v4 as uuidV4 } from "uuid";
import { loadStripe } from "@stripe/stripe-js";
import CartBuyButton from "./CartBuyButton";
import { useSelector, useDispatch } from "react-redux";
import Checkout from "../Checkout/Checkout";
import { useNavigate } from "react-router-dom";
import { setCustomerInfo } from "../../redux/userSlice";
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const CartNumber = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(false);
  // const [customerInfo, setCustomerInfo] = useState({});
  const navigate = useNavigate();
  console.log(user?._id);
  const checkoutRef = useRef();
  const dispatch = useDispatch();
  var cartNumbers = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  };
  if (cartItems.length > 0) {
    for (let index = 0; index < cartItems.length; index++) {
      const product = cartItems[index];
      cartNumbers.subtotal += product.price;
    }
    cartNumbers.tax = (cartNumbers.subtotal * 18) / 100;
    cartNumbers.shipping = 40.0;
    cartNumbers.total = (
      cartNumbers.subtotal +
      cartNumbers.tax +
      cartNumbers.shipping
    ).toFixed(2);
  }

  // const items = [
  //   { title: "Subtotal", price: cartNumbers.subtotal },
  //   { title: "Shipping", price: cartNumbers.shipping },
  //   { title: "tax", price: cartNumbers.tax },
  //   { title: "Total (INR)", price: cartNumbers.total },
  // ];
  const handleMakePayment = async () => {
    var customerData;
    try {
      if (checkoutRef?.current && checkoutRef.current?.submitForm) {
        try {
          customerData = await checkoutRef.current.submitForm();
          console.log(customerData);
          setCustomerInfo(customerData);
          dispatch(setCustomerInfo(customerData));
          return navigate("/checkout-payment-intent");
        } catch (validationError) {
          return;
        }
      }
      const stripe = await stripePromise;
      console.log(customerData);
      const { data } = await checkout_payment_intent(
        user?._id,
        customerData,
        cartItems
      );
      console.log(data);
      const result = stripe.redirectToCheckout({ sessionId: data?.id });
      if (result?.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleButtonClick = async (e) => {
    if (checkoutRef?.current && checkoutRef.current?.submitForm) {
      setIsLoading(true);
      try {
        const customerData = await checkoutRef.current.submitForm(); // Ensure this returns a value
        setCustomerInfo(customerData);
        dispatch(setCustomerInfo(customerData));
        navigate("/checkout-payment-intent");
        setIsLoading(false);
      } catch (validationError) {
        setIsLoading(false);
        console.error("Validation Error:", validationError); // Log the error for debugging
        return;
      }
    }
  };
  return (
    <div
      className={`flex flex-col mx-auto w-full border-2 bg-white ${
        isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"
      }`}
    >
      <h1 className="text-center text-black font-serif my-2">Order Details</h1>
      <div className="m-1 flex flex-col gap-4">
        <div className="flex flex-row justify-between font-serif items-center">
          <span>Sub Total </span>
          <span>&#8377; {cartNumbers.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex flex-row justify-between font-serif items-center">
          <span>Tax </span>
          <span>&#8377; {cartNumbers.tax.toFixed(2)}</span>
        </div>
        <div className="flex flex-row justify-between font-serif items-center">
          <span>Shipping </span>
          <span>&#8377; {cartNumbers.shipping.toFixed(2)}</span>
        </div>
      </div>
      <Checkout ref={checkoutRef} />
      <div className="flex flex-col m-1 font-serif">
        <span className="text-center text-gray-500 text-sm my-2">
          Total Amount &#8377; {cartNumbers.total}
        </span>
        <Button
          onClick={handleButtonClick}
          className="bg-blue-800 rounded-none font-serif text-[16px]"
          type="submit"
        >
          Pay &#8377;{cartNumbers.total}
        </Button>
      </div>
    </div>
  );
};

export default CartNumber;
