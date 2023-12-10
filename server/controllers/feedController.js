const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Feed = require("../models/feedModel");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");

exports.createFeed = catchAsyncErrors(async (request, response) => {
  let files = [];
  if (typeof request.body.files === "string") {
    files.push(request.body.files);
  } else {
    files = request.body.files;
  }
  const fileLinks = [];

  for (let i = 0; i < files.length; i++) {
    const result = await cloudinary.uploader.upload(files[i], {
      folder: "Feeds",
      width: 300,
      height: 200,
      crop: "thumb",
      zoom: 0.8,
    });

    fileLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  const newFeedData = {
    caption: request.body.caption,
    content: fileLinks,
    postedBy: request.user._id,
  };
  const newFeed = await Feed.create(newFeedData);

  const user = request.user;

  user.posts.push(newFeed._id);

  await user.save();

  return response.status(200).json({ success: true });
});

exports.likeFeed = catchAsyncErrors(async (request, response, next) => {
  const feed = await Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (feed.likes.includes(request.user._id)) {
    const index = feed.likes.indexOf(request.user._id);
    feed.likes.splice(index, 1);
    await feed.save();
    return response
      .status(200)
      .json({ success: true, message: "Unliked Feed" });
  } else {
    feed.likes.push(request.user._id);
    await feed.save();

    if (feed.dislikes.includes(request.user._id)) {
      try {
        if (feed.dislikes.includes(request.user._id)) {
          const index = feed.dislikes.indexOf(request.user._id);
          feed.dislikes.splice(index, 1);
          await feed.save();
        }
      } catch (error) {
        return response
          .status(500)
          .json({ success: false, message: error.message });
      }
    }
    return response.status(200).json({ success: true, message: "Liked Feed" });
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
      .json({ success: true, message: "DisUnliked Feed" });
  } else {
    feed.dislikes.push(request.user._id);

    await feed.save();

    if (feed.likes.includes(request.user._id)) {
      try {
        if (feed.likes.includes(request.user._id)) {
          const index = feed.likes.indexOf(request.user._id);
          feed.likes.splice(index, 1);
          await feed.save();
        }
      } catch (error) {
        return response
          .status(500)
          .json({ success: false, message: error.message });
      }
    }
    return response
      .status(200)
      .json({ success: true, message: "DisLiked Feed" });
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

  return response.status(200).json({ success: true, message: "Comment added" });
});

exports.deleteComment = catchAsyncErrors(async (request, response, next) => {
  const feed = Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (request.body.commentId === undefined) {
    return response
      .status(400)
      .message({ success: false, message: "Comment Id is required" });
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
          .json({ success: false, message: "UnAuthorize" });
      }
    });
  }

  return response
    .status(200)
    .json({ success: true, message: "Comment Deleted" });
});

exports.deleteFeed = catchAsyncErrors(async (request, response, next) => {
  const feed = await Feed.findById(request.params.id);

  if (!feed) {
    return next(new ErrorHandler("Feed not found", 404));
  }

  if (
    feed.postedBy.toString() !== request.user._id.toString() &&
    request.user.userRole !== "admin"
  ) {
    return response
      .status(401)
      .json({ success: false, message: "UnAuthorize" });
  }
  await feed.deleteOne();
  const index = request.user.posts.indexOf(request.params.id);
  await request.user.posts.splice(index, 1);
  await request.user.save();

  return response
    .status(200)
    .json({ success: true, message: "Feed is deleted" });
});

exports.getFeedsOfFollowingUser = catchAsyncErrors(
  async (request, response, next) => {
    const feeds = await Feed.aggregate([
      {
        $match: {
          postedBy: {
            $in: request.user.followings,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          postedBy: {
            name: { $arrayElemAt: ["$userDetails.name", 0] },
            avatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          },
        },
      },
      {
        $match: {
          "postedBy.name": {
            $regex: request.query.keyword,
            $options: "i",
          },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);

    return response.status(200).json({ success: true, feeds });
  }
);

exports.getAllFeeds = catchAsyncErrors(async (request, response, next) => {
  const feeds = await Feed.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $addFields: {
        postedBy: {
          name: { $arrayElemAt: ["$userDetails.name", 0] },
          avatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        },
      },
    },
    {
      $match: {
        "postedBy.name": {
          $regex: request.query.keyword,
          $options: "i",
        },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
  ]);

  if (!feeds) {
    return next(new ErrorHandler("no feeds available, 200"));
  }

  return response.status(200).json({
    success: true,
    feeds,
  });
});

exports.getALLMyFeeds = catchAsyncErrors(async (request, response, next) => {
  const feeds = await Feed.find({ postedBy: request.user._id });

  response.status(200).json({
    success: true,
    feeds,
  });
});

exports.addAndRemoveInFavorites = catchAsyncErrors(
  async (request, response, next) => {
    const { id } = request.params;
    const user = await User.findById(request.user._id);
    if (user.favoriteFeeds.includes(id)) {
      const index = user.favoriteFeeds.indexOf(id);
      user.favoriteFeeds.splice(index, 1);
      await user.save();
    } else {
      user.favoriteFeeds.push(id);
      await user.save();
    }
    response.status(200).json({ success: true });
  }
);
exports.getAllFavoriteFeeds = catchAsyncErrors(
  async (request, response, next) => {
    const feeds = await Feed.find({
      _id: { $in: request.user.favoriteFeeds },
    }).populate("postedBy", "avatar name");

    response.status(200).json({ success: true, feeds });
  }
);
