const User = require("../models/userModel");
const Feed = require("../models/feedModel");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorhandler");

exports.registerUser = catchAsyncErrors(async (request, response, next) => {
  const { userName, email, password } = request.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("Email already exist", 402));
  }

  user = await User.create({
    userName,
    email,
    password,
    avatar: { public_id: "sample public_id", url: "sample url" },
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
    response.cookie("jsonWebToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return response
      .status(200)
      .json({ sucess: true, message: "logout sucessfully" });
  } catch (error) {
    return response.status(500).json({ sucess: false, message: error.message });
  }
});

exports.followUser = catchAsyncErrors(async (request, response, next) => {
  const userToFollow = await User.findById(request.params.id);

  if (!userToFollow) {
    return next(new ErrorHandler("user not found", 404));
  }

  const user = request.user;

  if (user.following.includes(userToFollow._id)) {
    let index = await user.following.indexOf(userToFollow._id);
    await user.following.splice(index, 1);
    await user.save();

    index = await userToFollow.followers.indexOf(userToFollow._id);
    await userToFollow.followers.splice(index, 1);
    await userToFollow.save();

    return response
      .status(200)
      .json({ sucess: true, message: "UnFollowing the user" });
  }
  await user.following.push(userToFollow._id);
  await user.save();

  await userToFollow.followers.push(user._id);
  await userToFollow.save();

  return response
    .status(200)
    .json({ sucess: true, message: "Following the user" });
});

exports.updatePassword = catchAsyncErrors(async (request, response, next) => {
  const { oldPassword, newPassword } = await request.body;

  const user = await User.findById(request.user._id).select("+password");

  const isMatch = user.isMatchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Old Password Incorrect", 404));
  }

  user.password = newPassword;

  await user.save();

  return response
    .status(200)
    .json({ sucess: true, message: "Password updated Sucessfully" });
});

exports.updateProfile = catchAsyncErrors(async (request, response, next) => {
  const { newUserName, newEmail, newcontactNumber, newUserRole } = request.body;

  const user = request.user;

  user.userName = newUserName;
  user.email = newEmail;
  user.contactNumber = newcontactNumber;
  user.userRole = newUserRole;

  await user.save();

  return response
    .status(200)
    .json({ sucess: true, message: "Profile Updated Sucessfully", user });
});

exports.deleteProfile = catchAsyncErrors(async (request, response, next) => {
  const { password } = request.body;

  const isMatch = request.user.isMatchPassword(password);

  if (!isMatch) {
    return response
      .status(401)
      .json({ sucess: false, message: "Incorrect Password" });
  }

  // Deleting user posts

  const posts = request.user.posts;

  posts.forEach(async (item) => {
    let feed = await Feed.findById(item);

    await feed.deleteOne();
  });

  // Deleting followings and followers
  const followers = request.user.followers;

  followers.forEach(async (item) => {
    let followingUser = await User.findById(item);

    let index = await followingUser.following.indexOf(request.user._id);

    await followingUser.following.splice(index, 1);

    await followingUser.save();
  });

  const followings = request.user.following;

  followings.forEach(async (item) => {
    let followedUser = await User.findById(item);

    let index = await followedUser.followers.indexOf(request.user._id);

    await followedUser.followers.splice(index, 1);

    await followedUser.save();
  });

  // Loging out
  response.cookie("jsonWebToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // Deleting the user
  await request.user.deleteOne();

  return response
    .status(200)
    .json({ sucess: true, message: "Account Deleted Sucessfully" });
});

exports.myProfile = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findById(request.user._id).populate("posts");
  return response.status(200).json({ sucess: true, user });
});

exports.getUserProfile = catchAsyncErrors(async (request, response, next) => {
  const userProfile = await User.findById(request.params.id).populate("posts");

  if (!userProfile) {
    return response
      .status(404)
      .json({ sucess: false, message: "User not found" });
  }

  return response.status(200).json({ sucess: true, userProfile });
});

// Get All Users -- Admin
exports.getAllUsers = catchAsyncErrors(async (request, response, next) => {
  const users = await User.find();

  if (!users) {
    return response
      .status(404)
      .json({ sucess: false, message: "No User found" });
  }
  return response.status(200).json({ sucess: true, users });
});

exports.getAllFarmers = catchAsyncErrors(async (request, response, next) => {
  const farmers = await User.find({ userRole: "farmer" });

  if (!farmers) {
    return next(ErrorHandler("Farmers not found", 404));
  }
  return response.status(200).json({ sucess: true, farmers });
});

exports.forgotPssword = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });

  if (!user) {
    return response
      .status(404)
      .json({ sucess: false, message: "User not found" });
  }

  const resetPasswordToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `${request.protocol}://${request.get(
    "host"
  )}/api/v1/password/reset/${resetPasswordToken}`;

  const message = `reset your Pawword by clicking on the link below: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    response.status(200).json({
      sucess: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    response.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
});

exports.resetPassword = catchAsyncErrors(async (request, response, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(request.params.token)
    .digest("hex");

  const user = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return response.status(401).json({
      sucess: false,
      message: "Token is Invalid or Expired",
    });
  }

  user.password = request.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return response.status(200).json({
    sucess: true,
    message: "Reset Password Sucessfully",
  });
});

exports.deleteUser = catchAsyncErrors(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${request.params.id}`, 404)
    );
  }

  await user.deleteOne();

  response.status(200).json({
    sucess: true,
    message: "User Account deleted Sucessfully",
  });
});
