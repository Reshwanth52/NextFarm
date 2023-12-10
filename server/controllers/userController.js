const User = require("../models/userModel");
const Feed = require("../models/feedModel");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary").v2;
const path = require("path");

exports.registerUser = catchAsyncErrors(async (request, response, next) => {
  const { name, email, password } = request.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("Email already exist", 402));
  }

  let avatar = request.body.avatar;
  if (avatar) {
    const myCloud = await cloudinary.uploader
      .upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      })
      .catch((error) => console.log(error));
  }

  user = await User.create({
    name,
    email,
    password,
    avatar: avatar
      ? {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
      : undefined,
  });

  sendToken(user, 201, response);
});

exports.loginUser = catchAsyncErrors(async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Email does not exist", 401));
  }

  const isMatch = await user.isMatchPassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect email or Password", 401));
  }

  sendToken(user, 200, response);
});

exports.logout = catchAsyncErrors(async (request, response, next) => {
  try {
    response.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return response
      .status(200)
      .json({ success: true, message: "logout successfully" });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: error.message });
  }
});

exports.followUser = catchAsyncErrors(async (request, response, next) => {
  const userToFollow = await User.findById(request.params.id);

  if (!userToFollow) {
    return next(new ErrorHandler("user not found", 404));
  }

  const user = request.user;

  if (user.followings.includes(userToFollow._id)) {
    let index = await user.followings.indexOf(userToFollow._id);
    await user.followings.splice(index, 1);
    await user.save();

    index = userToFollow.followers.indexOf(userToFollow._id);
    userToFollow.followers.splice(index, 1);
    await userToFollow.save();

    return response
      .status(200)
      .json({ success: true, message: "Unfollowing the user" });
  }
  await user.followings.push(userToFollow._id);
  await user.save();

  userToFollow.followers.push(user._id);
  await userToFollow.save();

  return response
    .status(200)
    .json({ success: true, message: "following the user" });
});

exports.updatePassword = catchAsyncErrors(async (request, response, next) => {
  const { oldPassword, newPassword, confirmPassword } = await request.body;

  const user = await User.findById(request.user._id).select("+password");

  const isMatch = user.isMatchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Old Password Incorrect", 404));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, response);
});

exports.updateProfile = catchAsyncErrors(async (request, response, next) => {
  const newUserData = {
    name: request.body.name,
    email: request.body.email,
    contactNumber: request.body.contactNumber,
  };

  if (request.body.avatar !== request.user.avatar.url) {
    const user = await User.findById(request.user._id);

    const imageId = user.avatar.public_id;

    await cloudinary.uploader.destroy(imageId);

    const myCloud = await cloudinary.uploader.upload(request.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(request.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return response.status(200).json({
    success: true,
    message: "Profile Updated successfully",
    isUpdated: true,
  });
});

async function deletingPostsOfuser(posts) {
  posts.forEach(async (item) => {
    let feed = await Feed.findById(item);
    feed.images.forEach((image) => {
      cloudinary.uploader.destroy(image.public_id);
    });

    await feed.deleteOne();
  });
}

async function removingFollowersAndFollowingsOfUser(followers, followings) {
  followers.forEach(async (item) => {
    let followingsUser = await User.findById(item);

    let index = followingsUser.followings.indexOf(request.user._id);

    followingsUser.followings.splice(index, 1);

    await followingsUser.save();
  });

  followings.forEach(async (item) => {
    let followedUser = await User.findById(item);

    let index = followedUser.followers.indexOf(request.user._id);

    followedUser.followers.splice(index, 1);

    await followedUser.save();
  });
}

exports.deleteProfile = catchAsyncErrors(async (request, response, next) => {
  const { password } = request.body;

  const isMatch = request.user.isMatchPassword(password);

  if (!isMatch) {
    return response
      .status(401)
      .json({ success: false, message: "Incorrect Password" });
  }

  // Deleting user posts
  deletingPostsOfuser(request.user.posts);

  // Deleting followingss and followers
  const followers = request.user.followers;

  removingFollowersAndFollowingsOfUser(
    request.user.followers,
    request.user.followings
  );

  // Loging out
  response.cookie("jsonWebToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // Deleting the user
  await request.user.deleteOne();

  return response
    .status(200)
    .json({ success: true, message: "Account Deleted successfully" });
});

exports.myProfile = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findById(request.user._id).populate("posts");
  if (!user) {
    return next(new ErrorHandler("Login To Access", 401));
  }
  return response.status(200).json({ success: true, user });
});

exports.getCurrentUserDetails = catchAsyncErrors(
  async (request, response, next) => {
    const user = await User.findById(request.user._id);

    response.status(200).json({
      success: true,
      user,
    });
  }
);

exports.getUserProfile = catchAsyncErrors(async (request, response, next) => {
  const userProfile = await User.findById(request.params.id).populate("posts");

  if (!userProfile) {
    return next(new ErrorHandler("user not Found", 404));
  }

  return response.status(200).json({ success: true, userProfile });
});

// Get All Users -- Admin
exports.getAllUsers = catchAsyncErrors(async (request, response, next) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorHandler("users not Found", 404));
  }
  return response.status(200).json({ success: true, users });
});

exports.getAllFarmers = catchAsyncErrors(async (request, response, next) => {
  const farmers = await User.find({ userRole: "farmer" });

  if (!farmers) {
    return next(new ErrorHandler("Farmers not found", 404));
  }
  return response.status(200).json({ success: true, farmers });
});

exports.forgotPassword = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });

  if (!user) {
    return next(new ErrorHandler("Email not found as registered", 404));
  }

  const resetPasswordToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetPasswordToken}`;

  const message = `Reset your Password by clicking on the link below: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    response.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.resetPassword = catchAsyncErrors(async (request, response, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(request.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is Invalid or Expired", 401));
  }

  if (request.body.password !== request.body.confirmPassword) {
    return next(
      new ErrorHandler("Password does not match with confirm password", 401)
    );
  }
  user.password = request.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return response.status(200).json({
    success: true,
    message: "Reset Password successfully",
  });
});

exports.deleteUser = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.uploader.destroy(imageId);

  deletingPostsOfuser(user.posts);

  removingFollowersAndFollowingsOfUser(user.followers, user.followings);

  await user.deleteOne();

  response.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

exports.getAllFollowingsUsers = catchAsyncErrors(
  async (request, response, next) => {
    const apiFeature = new ApiFeatures(
      User.find({
        _id: { $in: request.user.followings },
      }),
      request.query
    ).search();

    const followingsUsers = await apiFeature.query;

    response.status(200).json({
      success: true,
      followingsUsers,
    });
  }
);

exports.getUserDetails = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User with id ${request.params.id} not found`, 404)
    );
  }

  response.status(200).json({ success: true, user });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    userRole: req.body.userRole,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
