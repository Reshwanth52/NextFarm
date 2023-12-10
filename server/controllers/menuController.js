const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const menuModel = require("../models/menuModel");
const Menu = require("../models/menuModel");
const ErrorHandler = require("../utils/errorhandler");

exports.createMenu = catchAsyncErrors(async (request, response, next) => {
  const menuItem = await Menu.create(request.body);

  return response.status(200).json({ success: true, menuItem });
});

exports.getMenu = catchAsyncErrors(async (request, response, next) => {
  const menuItems = await Menu.find();

  if (!menuItems) {
    return next(new ErrorHandler("Items not found", 404));
  }

  return response.status(200).json({ success: true, menuItems });
});

exports.updateMenuItem = catchAsyncErrors(async (request, response, next) => {
  const menuItem = await menuModel.findById(request.params.id);
  if (!menuItem) {
    return next(new ErrorHandler("Menu Id doesn't found", 404));
  }
  const { image, title, content } = request.body;
  menuItem.image = image;
  menuItem.title = title;
  menuItem.content = content;

  menuItem.save();

  return response.status(200).json({
    success: true,
    message: "successfully updated",
  });
});

exports.deleteMenuItem = catchAsyncErrors(async (request, response, next) => {
  const menuItem = await menuModel.findByIdAndDelete(request.params.id);

  response.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});
