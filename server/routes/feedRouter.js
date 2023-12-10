const express = require("express");
const {
  createFeed,
  likeFeed,
  dislikeFeed,
  deleteFeed,
  createComment,
  getFeedsOfFollowingUser,
  deleteComment,
  getAllFeeds,
  getALLMyFeeds,
  addAndRemoveInFavorites,
  getAllFavoriteFeeds,
} = require("../controllers/feedController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/feed/upload").post(isAuthenticated, createFeed);

router.route("/feed/like/:id").put(isAuthenticated, likeFeed);

router.route("/feed/dislike/:id").put(isAuthenticated, dislikeFeed);

router
  .route("/feed/favorite/:id")
  .put(isAuthenticated, addAndRemoveInFavorites);

router.route("/feed/favorite").get(isAuthenticated, getAllFavoriteFeeds);

router.route("/feed/:id").delete(isAuthenticated, deleteFeed);

router
  .route("/feed/comment/:id")
  .patch(isAuthenticated, createComment)
  .delete(isAuthenticated, deleteComment);

router.route("/feed/users").get(isAuthenticated, getFeedsOfFollowingUser);

router.route("/feeds").get(getAllFeeds);

router
  .route("/feeds/me")
  .get(isAuthenticated, authorizeRoles("farmer", "admin"), getALLMyFeeds);

module.exports = router;
