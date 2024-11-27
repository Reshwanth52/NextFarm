import React, { Fragment, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./Product.css";
import { clearErrors, getAllProducts } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { useLocation, useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import NotFound from "../NotFound/NotFound";

const Pesticide = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const location = useLocation();

  const { loading, error, products, productsCount, resultPerPage } =
    useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);

  const { keyword, productType } = useParams();

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getAllProducts(productType, keyword));
  }, [dispatch, error, alert, keyword, location]);

  return (
    <Fragment>
      <div className="pesticide">
        <div className="pesticide_left">Filters</div>
        <div className="pesticide_right">
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              {products && products.length !== 0 ? (
                <Fragment>
                  <div className="cards">
                    {products.map((product) => {
                      return (
                        <div className="" key={product._id}>
                          <ProductCard product={product} />
                        </div>
                      );
                    })}
                  </div>
                  {resultPerPage < productsCount && (
                    <div className="paginationBox">
                      <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage}
                        totalItemsCount={productsCount}
                        onChange={setCurrentPageNo}
                        nextPageText="Next"
                        prevPageText="Prev"
                        firstPageText="1st"
                        lastPageText="Last"
                        itemClass="page-item"
                        linkClass="page-link"
                        activeClass="pageItemActive"
                        activeLinkClass="pageLinkActive"
                        pageRangeDisplayed="6"
                      />
                    </div>
                  )}
                </Fragment>
              ) : (
                <NotFound />
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Pesticide;
