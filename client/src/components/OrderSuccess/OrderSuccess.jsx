import React from "react";
import "./OrderSuccess.css";
import { AiFillCheckCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
      <AiFillCheckCircle />
      <Typography>Your Order has been Placed Successfully</Typography>
      <Link to={"/orders"}>View Orders</Link>
    </div>
  );
};

export default OrderSuccess;
