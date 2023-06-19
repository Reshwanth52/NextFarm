import Carousel from "react-material-ui-carousel";
import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import ReactStars from "react-rating-stars-component";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "./ReviewCard";
import { useAlert } from "react-alert";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity, setQuantity] = useState(1);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { id } = useParams();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, error, id, alert]);

  const options = {
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25,
    activeColor: "tomato",
    value: product ? product.ratings : 0,
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="productDetails">
            <div>
              <Carousel className="carousel">
                {product &&
                  product.images &&
                  product.images.map((image, index) => {
                    return (
                      <img
                        src={image.url}
                        key={image.url}
                        alt={`${index} Slide`}
                        className="CarouselImage"
                      />
                    );
                  })}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id} </p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>({product.numOfReviews}) Reviews </span>
              </div>
              <div className="detailsBlock-3">
                <h1> {`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={() => setQuantity()}
                    />
                    <button>+</button>
                  </div>
                  <button>Add to Cart</button>
                </div>
                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutofStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description} </p>
              </div>
              <button className="submitReview">Submit Review</button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
