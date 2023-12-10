import React, { Fragment, useEffect, useState } from "react";
import "./Feed.css";
import {
  Button,
  Typography,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { FilterList, FullscreenExit } from "@mui/icons-material";
import {
  getAllFeeds,
  clearErrors,
  createFeed,
  getAllFollowingsUserFeeds,
  handleFavoriteList,
  getAllFavoriteFeeds,
} from "../../actions/feedAction";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { getAllFollowingUsers, loadUser } from "../../actions/userAction";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";

import Loader from "../layout/Loader/Loader";

const Feed = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [userForChatSearch, setUserForChatSearch] = useState("");
  const [userToFilterFeed, setUserToFilterFeed] = useState("");
  const [filterElement, setFilterElement] = useState("All");

  const [caption, setCaption] = useState();

  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [content, setContent] = useState([]);
  const [contentPreview, setContentPreview] = useState([]);

  const { loading, error, feeds } = useSelector((state) => state.feeds);
  const {
    loading: newFeedLoading,
    error: newFeedError,
    isCreated,
  } = useSelector((state) => state.newFeed);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.followingUsers);
  const [anchorElArray, setAnchorElArray] = useState(
    new Array(feeds.length).fill(null)
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createPostImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setContent([]);
    setContentPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.readyState === 2) {
          setContentPreview((old) => [...old, reader.result]);
          setContent((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  const removeImage = (itemIndex) => {
    const newContentPreview = contentPreview.filter((item, index) => {
      if (index !== itemIndex) {
        return item;
      }
    });
    setContentPreview(newContentPreview);
    setContent(newContentPreview);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("caption", caption);
    content.forEach((file) => {
      formData.append("files", file);
    });

    dispatch(createFeed(formData));
    setOpenDialog(false);
  };

  const favoriteHandler = (index) => {
    console.log(index);
    // const feed_id = feeds[index]._id;
    // console.log(feed_id);
    // dispatch(handleFavoriteList(feed_id));
    // dispatch(loadUser());
  };
  const shareHandler = (id) => {
    dispatch(handleFavoriteList(id));
    dispatch(loadUser());
  };
  const deleteHandler = (id) => {
    dispatch(handleFavoriteList(id));
    dispatch(loadUser());
  };
  const reportHandler = (id) => {
    dispatch(handleFavoriteList(id));
    dispatch(loadUser());
  };
  const submitCreateToggle = () => {
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (newFeedError) {
      alert.error(newFeedError);
      dispatch(clearErrors());
    }

    if (isCreated) {
      alert.success("Feed has been Created");
    }

    if (!newFeedLoading) {
      setOpenDialog(false);
    }

    if (filterElement === "All") {
      dispatch(getAllFeeds(userToFilterFeed));
    } else if (filterElement === "Following_User_Feeds") {
      dispatch(getAllFollowingsUserFeeds(userToFilterFeed));
    } else if (filterElement === "Marked") {
      dispatch(getAllFavoriteFeeds(userToFilterFeed));
    } else {
      dispatch(getAllFeeds(userToFilterFeed));
    }
  }, [
    dispatch,
    error,
    newFeedError,
    isCreated,
    newFeedError,
    newFeedLoading,
    userToFilterFeed,
    filterElement,
  ]);

  useEffect(() => {
    dispatch(getAllFollowingUsers(userForChatSearch));
  }, [userForChatSearch]);

  return (
    <div className="feedPage">
      <div className="feed_left">
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          disabled={!isAuthenticated}
        >
          Create Feed
        </Button>
        <Typography variant="h6" id="filterHeader">
          Filter <FilterList />{" "}
        </Typography>
        <FormControl>
          <FormLabel id="feed-category-controlled-radio-buttons-group">
            Filter By Category
          </FormLabel>
          <Stack direction="row">
            <RadioGroup
              aria-labelledby="feed-category-controlled-radio-buttons-group"
              name="feed-category-controlled-radio-buttons-group"
              defaultValue="All"
              onChange={(e) => setFilterElement(e.target.value)}
            >
              <FormControlLabel value="All" control={<Radio />} label="All" />
              <FormControlLabel
                value="Following_User_Feeds"
                control={<Radio />}
                label="Following User Feeds"
                disabled={!isAuthenticated}
              />
            </RadioGroup>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel id="feed-favorite-category-controlled-radio-buttons-group">
            Filter By Favorite
          </FormLabel>

          <RadioGroup
            aria-labelledby="feed-favorite-category-controlled-radio-buttons-group"
            name="feed-favorite-controlled-radio-buttons-group"
            defaultValue="All"
            onChange={(e) => setFilterElement(e.target.value)}
          >
            {" "}
            <Stack direction="row">
              <FormControlLabel value="All" control={<Radio />} label="All" />
              <FormControlLabel
                value="Marked"
                control={<Radio />}
                label="Marked"
                disabled={!isAuthenticated}
              />
              <FormControlLabel
                value="UnMarked"
                control={<Radio />}
                label="UnMarked"
                disabled={!isAuthenticated}
              />{" "}
            </Stack>
          </RadioGroup>
        </FormControl>
        <TextField
          id="outlined-basic"
          label="Search by User"
          variant="outlined"
          value={userToFilterFeed}
          disabled={!isAuthenticated}
          autoComplete="on"
          pattern="[^\/\\]*"
          onChange={(e) => setUserToFilterFeed(e.target.value)}
        />
        {!isAuthenticated ? (
          <Typography color={"red"}>
            Login to activate the Filter Actions
          </Typography>
        ) : undefined}
      </div>
      <div className="feed_mid">
        {loading ? (
          <Loader />
        ) : (
          <div className="feeds">
            {feeds.map((feed, index) => (
              <div className="feed_card" key={index}>
                <div className="feed_header">
                  {feed.postedBy.avatar ? (
                    <Avatar src={feed.postedBy.avatar.url} alt="User Avatar">
                      {feed.postedBy.name.substr(0, 1)}
                    </Avatar>
                  ) : (
                    <Avatar variant="circular">
                      {feed.postedBy.name.substr(0, 1)}{" "}
                    </Avatar>
                  )}

                  <Typography>{feed.postedBy.name}</Typography>
                  <IconButton
                    id={`basic-button-${index}`}
                    aria-controls={anchorEl ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertOutlinedIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PopoverClasses={{
                      style: { display: "flex", flexDirection: "column" },
                    }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    {user ? (
                      user.favoriteFeeds.includes(feed._id) ? (
                        <MenuItem anchorEl={anchorElArray[index]}>
                          <FavoriteBorderIcon /> Add to favorite{" "}
                        </MenuItem>
                      ) : (
                        <MenuItem onClick={() => favoriteHandler(feed._id)}>
                          <FavoriteIcon style={{ color: "red" }} /> Remove from
                          favorite
                        </MenuItem>
                      )
                    ) : undefined}

                    <MenuItem onClick={() => shareHandler()}>
                      <ShareIcon /> Share
                    </MenuItem>
                    <MenuItem onClick={() => deleteHandler()}>
                      <DeleteIcon /> Delete
                    </MenuItem>
                    <MenuItem onClick={() => reportHandler()} divider={true}>
                      <ReportIcon /> Report
                    </MenuItem>
                  </Menu>
                </div>
                <div className="feed_content">
                  <Carousel className="carousel">
                    {feed.content?.map((file, index) => (
                      <img src={file.url} alt="" key={file.url} />
                    ))}
                  </Carousel>
                </div>
                <div className="feed_caption">
                  <p>{feed.postedBy.name} </p>
                  <span>{feed.caption} </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="feed_right">
        <Typography variant="h6">Chats</Typography>
        <input
          type="search"
          value={userForChatSearch}
          onChange={(e) => setUserForChatSearch(e.target.value)}
          placeholder="Search User Here..."
        />
        {users ? (
          users.map((followingUser, index) => {
            return (
              <div className="chat_box">
                {followingUser.avatar ? (
                  <img src={followingUser.avatar.url} alt="user_dp" />
                ) : (
                  <Avatar>{followingUser.name.substring(0, 1)} </Avatar>
                )}
                <div>
                  <p>{followingUser.name} </p>
                  <span>recent mssg</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no_chat_mssg">
            <PeopleAltRoundedIcon />
            <Typography id="text_mssg">Follow Users To Chat</Typography>
          </div>
        )}
      </div>
      <div className="feedPage_dialogBox">
        <Dialog
          aria-labelledby="simple-dialog-title"
          open={openDialog}
          onClose={submitCreateToggle}
        >
          <DialogTitle>Create Post</DialogTitle>
          <DialogContent className="feedDialog">
            <form onSubmit={submitHandler}>
              <textarea
                className="submitDialogTextArea"
                cols={30}
                rows={5}
                value={caption}
                placeholder="Type What's in Your Mind"
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>

              <input type="file" multiple onChange={createPostImagesChange} />

              {contentPreview && (
                <div className="imagePreview">
                  {contentPreview.map((image, index) => (
                    <div>
                      <img src={image} alt="Image Preview" key={index} />
                      <DeleteForeverRoundedIcon
                        onClick={() => removeImage(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={submitCreateToggle}>
              Cancel
            </Button>
            <Button color="primary" onClick={submitHandler}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Feed;
