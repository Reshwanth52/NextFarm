const app = require("./app");
const { connectDatabase } = require("./config/database");
const cloudinary = require("cloudinary");

// Handling Uncaught Exception
process.on("uncaughtException", (error) => {
  console.log(`Error: ${error.message}`);
  console.log(
    `Shutting down the server due to Uncaught Exception Promise Rejection`
  );
  process.exit(1);
});

connectDatabase();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log("backend is working");
});

// unhandled promise rejection

process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
