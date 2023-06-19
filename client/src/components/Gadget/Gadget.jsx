import React, { useEffect } from "react";
import ProductCard from "../Product/ProductCard";
import "./Gadget.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllAutoMobiles, clearErrors } from "../../actions/productAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import { useParams } from "react-router-dom";

const Gadget = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, products, error, productCount } = useSelector(
    (state) => state.products
  );

  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllAutoMobiles(keyword));
  }, [dispatch, error, alert, keyword]);
  return (
    <div className="gadget">
      <div className="gadget_left">hh</div>
      <div className="gadget_right">
        {loading ? (
          <Loader />
        ) : (
          <div className="cards">
            {products &&
              products.map((product) => {
                return (
                  <div className="" key={product._id}>
                    <ProductCard product={product} />;
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gadget;
