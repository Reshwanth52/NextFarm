const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllProducts,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productContoller");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);

router.route("/products/:productType").get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthenticated, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct)
  .get(isAuthenticated, authorizeRoles("admin"), getProductDetails);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticated, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
