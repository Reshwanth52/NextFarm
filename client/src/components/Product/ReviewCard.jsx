import React from "react";
import "./ProductDetails.css";
import { Rating } from "@material-ui/lab";

const ReviewCard = ({ review }) => {
  const options = {
    size: "medium",
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <div className="reviewCard">
      <img src={review.avatar} alt="User" />
      <p>{review.name} </p>
      <Rating {...options} />
      <span>{review.rating} </span>
      <span className="reviewCardComment">{review.comment} </span>
    </div>
  );
};

export default ReviewCard;
