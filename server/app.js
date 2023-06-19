const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const errorMiddleware = require("./middlewares/error");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}

// Using Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Importing Routes
const userRoute = require("./routes/userRouter");
const productRoute = require("./routes/productRouter");
const postRoute = require("./routes/postRouter");
const feedRoute = require("./routes/feedRouter");
const orderRoute = require("./routes/orderRouter");
const menuRoute = require("./routes/menuRouter");

// Using Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", feedRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", menuRoute);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
