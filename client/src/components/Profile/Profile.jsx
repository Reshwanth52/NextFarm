import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, isAunthenticated } = useSelector(
    (state) => state.user
  );

  const { feeds } = useSelector((state) => state.feeds);

  useEffect(() => {
    if (isAunthenticated === false) {
      navigate("/login");
    }
  }, [isAunthenticated]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="profile">
          <div className="top_profile">
            <div className="top_left_profile">
              <img src={user.avatar.url} alt="Profile" />
              <Link to={"/profile/update"}>Edit Profile</Link>
            </div>
            <div className="top_right_profile">
              <div className="account_details">
                <p id="name">{user.name}</p>
                <p id="email">{user.email} </p>
              </div>
              <div className="activity_details">
                <p>{`${user.followings.length} Followings`} </p>
                <p>{`${user.followers.length} Followers`}</p>
                <p>{`${user.posts.length} Posts`}</p>
              </div>
              <Link to={"/password/update"}>Change Password</Link>
            </div>
          </div>
          <div className="bottom_profile">
            <div className="bottom_left_profile">
              <div className="transitions_history">
                <div className="transition_card">
                  <div className="status">Done</div>
                </div>
              </div>
            </div>
            <div className="bottom_right_profile">
              <div className="heading">Posts</div>
              <div className="posts">
                <div className="post_card">
                  <img src="./Profile.png" alt="Post" />
                </div>
                <div className="post_card">
                  <img src="./Profile.png" alt="Post" />
                </div>
                <div className="post_card">
                  <img src="./Profile.png" alt="Post" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
