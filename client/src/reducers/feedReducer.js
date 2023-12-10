import {
  GET_ALL_FEEDS_REQUEST,
  GET_ALL_FEEDS_SUCCESS,
  GET_ALL_FEEDS_FAIL,
  CLEAR_ERRORS,
  CREATE_FEED_REQUEST,
  CREATE_FEED_SUCCESS,
  CREATE_FEED_FAIL,
  GET_FOLLOWINGS_FEEDS_REQUEST,
  GET_FOLLOWINGS_FEEDS_SUCCESS,
  GET_FOLLOWINGS_FEEDS_FAIL,
  GET_FAVORITE_FEEDS_FAIL,
  GET_FAVORITE_FEEDS_SUCCESS,
  GET_FAVORITE_FEEDS_REQUEST,
} from "../constants/feedConstant";

export const newFeedReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_FEED_REQUEST:
      return {
        loading: true,
      };
    case CREATE_FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        isCreated: action.payload,
      };
    case CREATE_FEED_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const feedReducer = (state = { feeds: [] }, action) => {
  switch (action.type) {
    case GET_ALL_FEEDS_REQUEST:
    case GET_FOLLOWINGS_FEEDS_REQUEST:
    case GET_FAVORITE_FEEDS_REQUEST:
      return {
        ...state,
        loading: true,
        feeds: [],
      };
    case GET_ALL_FEEDS_SUCCESS:
    case GET_FOLLOWINGS_FEEDS_SUCCESS:
    case GET_FAVORITE_FEEDS_SUCCESS:
      return {
        ...state,
        loading: false,
        feeds: action.payload.feeds,
      };
    case GET_ALL_FEEDS_FAIL:
    case GET_FOLLOWINGS_FEEDS_FAIL:
    case GET_FAVORITE_FEEDS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
