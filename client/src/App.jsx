import { Routes, Route } from "react-router-dom";
import {
  Home,
  Single,
  Login,
  Register,
  Cart,
  Profile,
  AddItem,
  Update,
} from "./pages";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import CheckoutPaymentIntent from "./pages/CheckoutPaymentIntent";
import PaymentCompletePage from "./pages/PaymentCompletePage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ResetPasswordByGmail from "./pages/ResetPasswordByGmail";
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);
function App() {
  return (
    <>
      <hr />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/single/:id" element={<Single />} />
        <Route path="/resetpasswordbygmail/:userId" element={<ResetPasswordByGmail/>}/>
        <Route element={<PrivateRoute />}>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/additem/:userId" element={<AddItem />} />
          <Route path="/updateitem/:userId/:productId" element={<Update />} />
          <Route path="/complete" element={<Elements stripe={stripePromise}><PaymentCompletePage/></Elements>}/>
          <Route path="/checkout-payment-intent" element={<CheckoutPaymentIntent/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
