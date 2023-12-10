const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middlewares/error");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}

// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "1000mb",
  })
);
app.use(fileUpload());

// Importing Routes
const userRoute = require("./routes/userRouter");
const productRoute = require("./routes/productRouter");
const feedRoute = require("./routes/feedRouter");
const orderRoute = require("./routes/orderRouter");
const menuRoute = require("./routes/menuRouter");
const paymentRoute = require("./routes/paymentRoute");
const dealsRoute = require("./routes/dealRouter");

// Using Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", feedRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", menuRoute);
app.use("/api/v1", dealsRoute);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
