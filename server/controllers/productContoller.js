const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary").v2;

exports.createProduct = catchAsyncErrors(async (request, response, next) => {
  let images = [];
  if (typeof request.body.images === "string") {
    images.push(request.body, images);
  } else {
    images = request.body.images;
  }

  const imagesLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  request.body.images = imagesLink;
  request.body.user = request.user.id;

  const product = await Product.create(request.body);

  return response.status(200).json({
    success: true,
    message: "Product added",
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (request, response, next) => {
  let product = await Product.findById(request.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  let images = [];
  if (typeof request.body.images === "string") {
    images.push(request.body.images);
  } else {
    images = request.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    const imageLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      console.log(result.public_id);
      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    request.body.images = imageLinks;
  }
  product = await Product.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  response.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (request, response, next) => {
  const product = await Product.findById(request.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }
  await product.deleteOne();

  return response.status(200).json({
    success: true,
    message: "Product Deleted successfully",
  });
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (request, response, next) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments({
    category: request.params.productType,
  });

  const apiFeature = new ApiFeatures(
    Product.find({ category: request.params.productType }),
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
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});

// Get All Admin Products
exports.getAdminProducts = catchAsyncErrors(async (request, response, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }

  response.status(200).json({
    success: true,
    products,
  });
});

exports.getProductDetails = catchAsyncErrors(
  async (request, response, next) => {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    response.status(200).json({
      success: true,
      product,
    });
  }
);

exports.createProductReview = catchAsyncErrors(
  async (request, response, next) => {
    const { rating, comment, productId } = request.body;

    const review = {
      user: request.user._id,
      name: request.user.name,
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
      success: true,
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
      success: true,
      reviews: product.reviews,
    });
  }
);

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
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

  res.status(200).json({
    success: true,
  });
});
