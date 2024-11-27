import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { BsCartX } from "react-icons/bs";
import { addItemsToCart, removeItemFromcart } from "../../actions/cartAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useSelector((state) => state.cart);

  const increaseQuantity = (id, quantity, stock) => {
    const newQuantity = quantity < stock ? quantity + 1 : quantity;
    if (newQuantity === quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQuantity));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    if (newQuantity === quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQuantity));
  };

  const removeItemFromCart = (id) => {
    dispatch(removeItemFromcart(id));
  };

  const cartCheckOutHandler = () => {
    navigate("/login", { state: { from: "/shipping" } });
  };

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <BsCartX />
          <p>No Products in Your Cart</p>
          <Link to={"/"}>Home</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Qunatity</p>
              <p>Subtotal</p>
            </div>
            {cartItems &&
              cartItems.map((item) => {
                return (
                  <div className="cartContainer" key={item.product}>
                    <CartItemCard
                      item={item}
                      deleteItemFromCart={removeItemFromCart}
                    />
                    <div className="cartInput">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.product, item.quantity)
                        }
                      >
                        -
                      </button>
                      <input type="number" value={item.quantity} readOnly />
                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.product,
                            item.quantity,
                            item.stock
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="cartSubtotal">{`₹${
                      item.price * item.quantity
                    }`}</div>
                  </div>
                );
              })}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={cartCheckOutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
