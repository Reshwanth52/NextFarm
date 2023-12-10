import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const CartItemCard = ({ item, deleteItemFromCart }) => {
  const dispatch = useDispatch();

  return (
    <div className="cartItemCard">
      <img src={item.image} alt="item image" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name} </Link>
        <span>{`Price: ₹${item.price}`} </span>
        <p onClick={() => deleteItemFromCart(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
