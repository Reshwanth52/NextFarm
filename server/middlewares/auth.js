const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");

exports.isAuthenticated = catchAsyncErrors(async (request, response, next) => {
  const { token } = request.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to acess this resource", 401));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  request.user = await User.findById(decoded._id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.userRole)) {
      return next(
        new ErrorHandler(
          `Role: ${request.user.userRole} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
