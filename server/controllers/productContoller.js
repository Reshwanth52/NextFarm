const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

exports.createProduct = catchAsyncErrors(async (request, response, next) => {
  await Product.create(request.body);

  return response.status(200).json({
    sucess: true,
    message: "Product added",
  });
});

exports.updateProduct = catchAsyncErrors(async (request, response, next) => {
  let product = await Product.findById(request.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  response.status(200).json({
    sucess: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (request, response, next) => {
  const product = await Product.findById(request.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  return response.status(200).json({
    sucess: true,
    message: "Product Deleted Sucessfully",
  });
});

exports.getAllPesticidesProducts = catchAsyncErrors(
  async (request, response, next) => {
    const resultPerPage = 12;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(
      Product.find({ category: "Pesticide" }),
      request.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);

    const products = await apiFeature.query;

    if (!products) {
      return next(new ErrorHandler("Product not found", 404));
    }

    response.status(200).json({
      sucess: true,
      products,
      productCount,
      resultPerPage,
    });
  }
);

// Get All Automobile products
exports.getAllAutomobileProducts = catchAsyncErrors(
  async (request, response, next) => {
    const resultPerPage = 12;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(
      Product.find({ category: "AutoMobile" }),
      request.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);

    const products = await apiFeature.query;

    if (!products) {
      return next(new ErrorHandler("Product not found", 404));
    }

    response.status(200).json({
      sucess: true,
      products,
      productCount,
      resultPerPage,
    });
  }
);

exports.getProductDetails = catchAsyncErrors(
  async (request, response, next) => {
    const product = await Product.findById(request.params.id);

    // response.write("hekp");
    if (!product) {
      console.log("hello");
      return next(new ErrorHandler("Product not found", 404));
    }

    response.status(200).json({
      sucess: true,
      product,
    });
  }
);

exports.createProductReview = catchAsyncErrors(
  async (request, response, next) => {
    const { rating, comment, productId } = request.body;

    const review = {
      user: request.user._id,
      name: request.user.userName,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === request.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === request.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let averageRating = 0;

    product.reviews.forEach((rev) => {
      averageRating += rev.rating;
    });

    product.ratings = averageRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    response.status(200).json({
      sucess: true,
      message: "Reviewed this product",
    });
  }
);

exports.getProductReviews = catchAsyncErrors(
  async (request, response, next) => {
    const product = await Product.findById(request.query.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    response.status(200).json({
      sucess: true,
      reviews: product.reviews,
    });
  }
);

exports.deleteReview = catchAsyncErrors(async (request, response, next) => {
  const product = await Product.findById(request.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== request.query.id.toString()
  );

  let averageRating = 0;

  reviews.forEach((rev) => {
    averageRating += rev.rating;
  });

  const ratings = averageRating / reviews.length;

  const numOfReviews = review.length;

  await Product.findByIdAndUpdate(
    request.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  response.status(200).json({
    sucess: true,
    message: "Review Deleted",
  });
});
