const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const {
  createMenu,
  getMenu,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const router = express.Router();

router
  .route("/menuItem")
  .post(isAuthenticated, authorizeRoles("admin"), createMenu)
  .get(getMenu);

router
  .route("/menuItem/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateMenuItem)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteMenuItem);

router;

module.exports = router;
