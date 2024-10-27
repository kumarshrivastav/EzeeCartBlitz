import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {useSelector} from "react-redux"
import { Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const CheckoutForm = ({ dpmCheckerLink,onPaymentSuccess }) => {
  useAuth()
  const {user}=useSelector(state=>state.users)
  const stripe = useStripe();
  const elements = useElements();
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      // Make sure to disable form submission until stripe.js has loaded
      return;
    }
    try {
      setIsLoading(true);
      setMessage("");
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:5173/complete",
          receipt_email: email,
        },
      });
      if(!error){
        navigate("/complete")
        onPaymentSuccess()
      }
      console.log(error);
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const paymentElementOption = {
    layout: "tabs",
  };
  return (
    <div className="flex flex-col bg-white  p-1 m-2">
      <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col">
        <input
          id="email"
          type="email"
          value={user?.email}
          className="font-serif my-2"
          readOnly
        />
        <PaymentElement id="payment-element" options={paymentElementOption} />
        <Button
          type="submit"
          className="my-2 rounded-none bg-blue-600 hover:!bg-blue-600"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text" className="font-serif">
            {isLoading ? (
              <>
                <Spinner aria-label="Spinner label" size={"sm"} />
                <span className="ml-2">Please wait...</span>
              </>
            ) : (
              "Pay now"
            )}
          </span>
        </Button>
        {message && (
          <div className="font-serif text-sm text-red-500" id="payment-message">
            {message}
          </div>
        )}
      </form>
      <div className="px-1 py-2">
        <p className="font-serif text-sm text-justify">
          Payment methods are dynamically displayed based on customer location,
          order amount, and currency.&nbsp;
          {/* <a
            href={dpmCheckerLink}
            target="_blank"
            className="italic text-blue-500"
            rel="noopener noreferrer"
            id="dpm-integration-checker"
          >
            Preview payment methods by transaction
          </a> */}
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;