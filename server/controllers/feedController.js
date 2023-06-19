const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Feed = require("../models/feedModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");

exports.createFeed = catchAsyncErrors(async (request, response) => {
  const newFeedData = {
    caption: request.body.caption,
    images: [
      {
        public_id: "Sample Public_id",
        url: "Sample URL",
      },
    ],
    postedBy: request.user._id,
  };
  const newFeed = await Feed.create(newFeedData);

  const user = request.user;

  user.posts.push(newFeed._id);

  await user.save();

  return response
    .status(200)
    .json({ sucess: true, message: "Feed added", newFeed });
});

exports.likeFeed = catchAsyncErrors(async (request, response, next) => {
  const feed = await Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (feed.likes.includes(request.user._id)) {
    const index = await feed.likes.indexOf(request.user._id);
    await feed.likes.splice(index, 1);
    await feed.save();
    return response.status(200).json({ sucess: true, message: "Unliked Feed" });
  } else {
    await feed.likes.push(request.user._id);
    await feed.save();

    if (feed.dislikes.includes(request.user._id)) {
      try {
        if (feed.dislikes.includes(request.user._id)) {
          const index = await feed.dislikes.indexOf(request.user._id);
          await feed.dislikes.splice(index, 1);
          await feed.save();
        }
      } catch (error) {
        return response
          .status(500)
          .json({ sucess: false, message: error.message });
      }
    }
    return response.status(200).json({ sucess: true, message: "Liked Feed" });
  }
});

exports.dislikeFeed = catchAsyncErrors(async (request, response, next) => {
  const feed = await Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (feed.dislikes.includes(request.user._id)) {
    const index = await feed.dislikes.indexOf(request.user._id);

    await feed.dislikes.splice(index, 1);

    await feed.save();

    return response
      .status(200)
      .json({ sucess: true, message: "DisUnliked Feed" });
  } else {
    await feed.dislikes.push(request.user._id);

    await feed.save();

    if (feed.likes.includes(request.user._id)) {
      try {
        if (feed.likes.includes(request.user._id)) {
          const index = await feed.likes.indexOf(request.user._id);
          await feed.likes.splice(index, 1);
          await feed.save();
        }
      } catch (error) {
        return response
          .status(500)
          .json({ sucess: false, message: error.message });
      }
    }
    return response
      .status(200)
      .json({ sucess: true, message: "DisLiked Feed" });
  }
});

exports.createComment = catchAsyncErrors(async (request, response, next) => {
  const feed = await Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  feed.comments.push({
    postedBy: request.user._id,
    comment: request.body.comment,
  });

  await feed.save();

  return response.status(200).json({ sucess: true, message: "Comment added" });
});

exports.deleteComment = catchAsyncErrors(async (request, response, next) => {
  const feed = Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (request.body.commentId === undefined) {
    return response
      .status(400)
      .message({ sucess: false, message: "Comment Id is required" });
  }

  if (!feed.postedBy.toString() === request.user._id) {
    feed.comments.forEach(async (item, index) => {
      if (item._id.toString() === request.body.commentId.toString()) {
        return feed.comments.splice(index, 1);
      }
    });

    await feed.save();
  } else {
    feed.comments.forEach(async (item, index) => {
      if (
        item.postedBy.toString() === request.user._id.toString() &&
        item._id.toString() === request.body.commentId.toString()
      ) {
        return feed.comments.splice(index, 1);
      } else {
        return response
          .status(401)
          .json({ sucess: false, message: "UnAuthorize" });
      }
    });
  }

  return response
    .status(200)
    .json({ sucess: true, message: "Comment Deleted" });
});

exports.deleteFeed = catchAsyncErrors(async (request, response, next) => {
  const feed = await Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (feed.postedBy.toString() !== request.user._id.toString()) {
    return response.status(401).json({ sucess: false, message: "UnAuthorize" });
  }

  await feed.deleteOne();
  const index = request.user.posts.indexOf(request.params.id);
  await request.user.posts.splice(index, 1);
  await request.user.save();

  return response
    .status(200)
    .json({ sucess: true, message: "Feed is deleted" });
});

exports.getPostsOfFollowingUser = catchAsyncErrors(
  async (request, response, next) => {
    const feeds = await Feed.find({
      postedBy: {
        $in: request.user.following,
      },
    });

    return response
      .status(200)
      .json({ sucess: true, message: "Fetch all posts", feeds });
  }
);
