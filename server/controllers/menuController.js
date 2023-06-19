const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Menu = require("../models/menuModel");
const ErrorHandler = require("../utils/errorhandler");

exports.createMenu = catchAsyncErrors(async (request, response, next) => {
  const menuItem = await Menu.create(request.body);

  return response.status(200).json({ sucess: true, menuItem });
});

exports.getMenu = catchAsyncErrors(async (request, response, next) => {
  const menuItems = await Menu.find();

  if (!menuItems) {
    return next(new ErrorHandler("Items not found", 404));
  }

  return response.status(200).json({ sucess: true, menuItems });
});
