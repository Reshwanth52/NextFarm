const { request } = require("express");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Deal = require("../models/dealModel");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary").v2;

exports.createDeal = catchAsyncErrors(async (request, response, next) => {
  const { state, district, cropType, cropName, contactNumber } = request.body;
  const imagesLinks = [];

  const images = [];
  if (typeof request.body.images === "string") {
    images.push(request.body.images);
  } else {
    images = request.body.images;
  }

  if (images) {
    for (let i = 0; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "dealer_crops",
        width: 150,
        crop: "scale",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }
  const newDealData = {
    cropType: request.body.cropType,
    cropName: request.body.cropName,
    postedBy: request.user._id,
    contactNumber: request.body.contactNumber,
    address: {
      state: request.body.state,
      city: request.body.city,
      district: request.body.district,
    },
    images: imagesLinks,
  };

  await Deal.create(newDealData);

  return response.status(200).json({ success: true });
});

exports.getAllDeals = catchAsyncErrors(async (request, response, next) => {
  const deals = await Deal.find();
  if (!deals) {
    return next(new ErrorHandler("No Deals Available", 404));
  }
  response.status(200).json({ success: true, deals });
});
