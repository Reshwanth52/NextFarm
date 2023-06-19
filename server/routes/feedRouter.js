const express = require('express');
const { createFeed, likeFeed, dislikeFeed, deleteFeed, createComment, getPostsOfFollowingUser, deleteComment } = require('../controllers/feedController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route('/feed/upload').post(isAuthenticated,createFeed);

router.route('/feed/like/:id').put(isAuthenticated, likeFeed);

router.route('/feed/dislike/:id').put(isAuthenticated, dislikeFeed);

router.route('/feed/:id').delete(isAuthenticated, deleteFeed);

router.route('/feed/comment/:id').patch(isAuthenticated, createComment).delete(isAuthenticated, deleteComment);

router.route('/feeds').get(isAuthenticated, getPostsOfFollowingUser);

module.exports = router;