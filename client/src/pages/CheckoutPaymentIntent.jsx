import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import { checkout_payment_intent } from '../http/networkRequest';
import { useSelector } from "react-redux";
// import CheckoutForm from './CheckOutForm';
import PaymentCompletePage from "./PaymentCompletePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { checkout_payment_intent } from "../http/networkRequest";
import CheckoutForm from "./CheckoutForm";
import useAuth from "../hooks/useAuth";
// import CheckoutForm from './CheckOutForm';
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);
const CheckoutPaymentIntent = () => {
  useAuth()
  const { user, customerInfo } = useSelector((state) => state.users);
  const { cartItems } = useSelector((state) => state.cart);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(clientSecret);
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };
  useEffect(() => {
    const checkoutPaymentIntent = async () => {
      setLoading(true);
      try {
        const { data } = await checkout_payment_intent(
          user?._id,
          customerInfo,
          cartItems
        );

        console.log(data);
        setClientSecret(data.clientSecret);
        setDpmCheckerLink(data.dpmCheckerLink);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    checkoutPaymentIntent();
  }, []);
  const appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading
  const loader = "auto";
  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-black opacity-50 flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {clientSecret && (
            <Elements
              options={{ clientSecret, appearance, loader }}
              stripe={stripePromise}
            >
              <CheckoutForm
                dpmCheckerLink={dpmCheckerLink}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </>
      )}
    </>
  );
};

export default CheckoutPaymentIntent;
