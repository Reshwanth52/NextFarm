import React from "react";
import ReactStar from "react-rating-stars-component";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const options = {
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25,
    activeColor: "tomato",
    value: product.ratings,
    edit: false,
  };
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div className="rating">
        <ReactStar {...options} />{" "}
        <span> ({product.numOfReviews} Reviews) </span>
      </div>
      <span>{`₹ ${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
