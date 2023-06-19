const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAllPesticidesProducts,
  getAllAutomobileProducts,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productContoller");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);

router.route("/products/pesticides").get(getAllPesticidesProducts);
router.route("/products/automobiles").get(getAllAutomobileProducts);

router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct)
  .get(isAuthenticated, authorizeRoles("admin"), getProductDetails);

router.route("/product/:id").get(getProductDetails);

router.route("/review").post(isAuthenticated, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
