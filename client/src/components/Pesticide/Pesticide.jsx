import React, { Fragment, useEffect } from "react";
import ProductCard from "../Product/ProductCard";
import "./Pesticide.css";
import { clearErrors, getAllPesticides } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const Pesticide = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  const { keyword } = useParams();
  // console.log(keyword);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllPesticides(keyword));
  }, [dispatch, error, alert, keyword]);

  return (
    <Fragment>
      <div className="pesticide">
        <div className="pesticide_left">hh</div>
        <div className="pesticide_right">
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
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
              <div className="pagination">
                <Pagination />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Pesticide;
