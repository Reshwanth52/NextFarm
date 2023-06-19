const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  followUser,
  updatePassword,
  updateProfile,
  deleteProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
  forgotPssword,
  resetPassword,
  deleteUser,
  getAllFarmers,
} = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router
  .route("/followUser/:id")
  .get(isAuthenticated, authorizeRoles("farmer", "admin"), followUser);

router.route("/update/password").put(isAuthenticated, updatePassword);

router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/delete/profile").delete(isAuthenticated, deleteProfile);

router.route("/profile").get(myProfile);

router
  .route("/profile/:id")
  .get(isAuthenticated, authorizeRoles("farmer", "admin"), getUserProfile)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateProfile);

router
  .route("/users/all")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.route("/forgot/password").post(forgotPssword);

router.route("/password/reset/:token").put(resetPassword);

router
  .route("/farmers/all")
  .get(isAuthenticated, authorizeRoles("farmer", "admin"), getAllFarmers);

module.exports = router;
