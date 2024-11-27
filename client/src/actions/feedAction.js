import {
  GET_ALL_FEEDS_REQUEST,
  GET_ALL_FEEDS_SUCCESS,
  GET_ALL_FEEDS_FAIL,
  GET_ALL_MY_FEEDS_REQUEST,
  GET_ALL_MY_FEEDS_SUCCESS,
  GET_ALL_MY_FEEDS_FAIL,
  CLEAR_ERRORS,
  CREATE_FEED_REQUEST,
  CREATE_FEED_SUCCESS,
  CREATE_FEED_FAIL,
  GET_FOLLOWINGS_FEEDS_REQUEST,
  GET_FOLLOWINGS_FEEDS_SUCCESS,
  GET_FOLLOWINGS_FEEDS_FAIL,
  MANAGE_FAVORITE_LIST_FAIL,
  MANAGE_FAVORITE_LIST_REQUEST,
  MANAGE_FAVORITE_LIST_SUCCESS,
  GET_FAVORITE_FEEDS_FAIL,
  GET_FAVORITE_FEEDS_REQUEST,
  GET_FAVORITE_FEEDS_SUCCESS,
} from "../constants/feedConstant";
import axios from "axios";

export const createFeed = (feedData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_FEED_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/v1/feed/upload", feedData, config);

    dispatch({
      type: CREATE_FEED_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: CREATE_FEED_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAllFeeds =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_FEEDS_REQUEST });
      const { data } = await axios.get(`/api/v1/feeds?keyword=${keyword}`);

      dispatch({
        type: GET_ALL_FEEDS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_ALL_FEEDS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const getAllMyFeeds = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_MY_FEEDS_REQUEST });

    const { data } = await axios.get("/feeds/me");

    dispatch({ type: GET_ALL_MY_FEEDS_SUCCESS, payload: data.feeds });
  } catch (error) {
    dispatch({
      type: GET_ALL_MY_FEEDS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAllFollowingsUserFeeds =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_FOLLOWINGS_FEEDS_REQUEST });
      const { data } = await axios.get(`/api/v1/feed/users?keyword=${keyword}`);
      dispatch({ type: GET_FOLLOWINGS_FEEDS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: GET_FOLLOWINGS_FEEDS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const handleFavoriteList = (id) => async (dispatch) => {
  try {
    dispatch({ type: MANAGE_FAVORITE_LIST_REQUEST });
    const { data } = await axios.put(`/api/v1/feed/favorite/${id}`);
    dispatch({ type: MANAGE_FAVORITE_LIST_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: MANAGE_FAVORITE_LIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAllFavoriteFeeds =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_FAVORITE_FEEDS_REQUEST });
      const { data } = await axios.get(
        `/api/v1/feed/favorite?keyword=${keyword}`
      );
      dispatch({ type: GET_FAVORITE_FEEDS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: GET_FAVORITE_FEEDS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
