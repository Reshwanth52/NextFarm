const Post = require("../models/postModel");

exports.createPost = async (request, response, next) => {
  try {
    await Post.create(request.body);

    return response
      .status(200)
      .json({ sucess: true, message: "Post Uploaded Sucessfully" });
  } catch (error) {
    return response.status(500).json({ sucess: false, message: error.message });
  }
};
