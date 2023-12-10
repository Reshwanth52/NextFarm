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
  forgotPassword,
  resetPassword,
  deleteUser,
  getAllFarmers,
  getAllFollowingsUsers,
  getCurrentUserDetails,
  getUserDetails,
  updateUserRole,
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

router.route("/me").get(isAuthenticated, getCurrentUserDetails);

router
  .route("/user/:id")
  .get(isAuthenticated, authorizeRoles("farmer", "admin"), getUserProfile)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router
  .route("/farmers/all")
  .get(isAuthenticated, authorizeRoles("farmer", "admin"), getAllFarmers);

router
  .route("/users/following")
  .get(
    isAuthenticated,
    authorizeRoles("admin", "farmer"),
    getAllFollowingsUsers
  );

module.exports = router;
