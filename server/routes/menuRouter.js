const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const { createMenu, getMenu } = require("../controllers/menuController");
const router = express.Router();

router
  .route("/menuItem")
  .post(isAuthenticated, authorizeRoles("admin"), createMenu)
  .get(getMenu);

router;

module.exports = router;
