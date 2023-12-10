const express = require("express");
const { createDeal, getAllDeals } = require("../controllers/dealController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/deals")
  .post(isAuthenticated, authorizeRoles("farmer", "admin"), createDeal)
  .get(isAuthenticated, authorizeRoles("dealer", "admin"), getAllDeals);

module.exports = router;
