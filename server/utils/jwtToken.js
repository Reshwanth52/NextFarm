// Create Token and saving in cookie

const cookieParser = require("cookie-parser");

const sendToken = async (user, statusCode, res) => {
  const token = await user.getJSONWebToken();

  // options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
