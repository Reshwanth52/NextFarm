import React from "react";
import ReactStars from "react-rating-stars-component";
import profilePng from "../../images/renewLogo.png";

const ReviewCard = ({ review }) => {
  const options = {
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25,
    activeColor: "tomato",
    value: review.rating,
  };
  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{review.name} </p>
      <ReactStars {...options} />
      <span>{review.rating} </span>

      <span>{review.comment} </span>
    </div>
  );
};

export default ReviewCard;
