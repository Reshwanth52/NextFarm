import React, { Fragment, useEffect, useRef } from "react";
import "./Payment.css";
import CheckOutSteps from "../Shipping/CheckOutSteps";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  BsCreditCard2FrontFill,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { MdVpnKey } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createOrder, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";

const Payment = () => {
  const payBtn = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));
          navigate("/success");
        } else {
          alert.error("Issue While Processing Payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);
  return (
    <Fragment>
      {stripe ? (
        <Fragment>
          <CheckOutSteps activeStep={2} />
          <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
              <Typography>Crad Info</Typography>
              <div>
                <BsCreditCard2FrontFill />
                <CardNumberElement className="paymentInput" />
              </div>
              <div>
                <BsFillCalendar2EventFill />
                <CardExpiryElement className="paymentInput" />
              </div>
              <div>
                <MdVpnKey />
                <CardCvcElement className="paymentInput" />
              </div>
              <input
                type="submit"
                value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                ref={payBtn}
                className="paymentFormBtn"
              />
            </form>
          </div>
        </Fragment>
      ) : (
        <Loader />
      )}
    </Fragment>
  );
};

export default Payment;
