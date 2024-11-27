import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  GET_ALL_FOLLOWING_USERS_REQUEST,
  GET_ALL_FOLLOWING_USERS_SUCCESS,
  GET_ALL_FOLLOWING_USERS_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOAD_REQUEST,
  USER_LOAD_SUCCESS,
  USER_LOAD_FAIL,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_PROFILE_UPDATE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_REQUEST,
  USER_PASSWORD_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_FAIL,
  CLEAR_ERRORS,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_FAIL,
  USER_RESET_PASSWORD_SUCCESS,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
  USER_DETAIL_REQUEST,
  USER_DETAIL_SUCCESS,
  USER_DETAIL_FAIL,
  UPDATE_USER_REQUEST,
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_SUCCESS,
} from "../constants/userConstant";

// Login User
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });

    localStorage.setItem("userDetails", JSON.stringify(data.user));
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: error.response.data.message });
  }
};

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post("/api/v1/register", userData, config);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LOAD_REQUEST });

    const { data } = await axios.get("/api/v1/me");

    dispatch({ type: USER_LOAD_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: USER_LOAD_FAIL, payload: error.response.data.message });
  }
};

// logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get("/api/v1/logout");
    dispatch({ type: USER_LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: USER_LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// update User Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      "/api/v1/update/profile",
      userData,
      config
    );

    dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data.isUpdated });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// update User Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: USER_PASSWORD_UPDATE_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      "/api/v1/update/password",
      passwords,
      config
    );

    dispatch({ type: USER_PASSWORD_UPDATE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: USER_PASSWORD_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// forgot User Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post("/api/v1/password/forgot", email, config);

    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `/api/v1/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: USER_RESET_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/users");

    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({
      type: GET_ALL_USERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAIL_REQUEST });

    const { data } = await axios.get(`/api/v1/admin/user/${id}`);

    dispatch({ type: USER_DETAIL_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_DETAIL_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  console.log("hello ");
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/v1/admin/user/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/user/${id}`);

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Fetch user following users
export const getAllFollowingUsers =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_FOLLOWING_USERS_REQUEST });

      const { data } = await axios.get(
        `/api/v1/users/following?keyword=${keyword}`
      );

      dispatch({
        type: GET_ALL_FOLLOWING_USERS_SUCCESS,
        payload: data.followingsUsers,
      });
    } catch (error) {
      dispatch({
        type: GET_ALL_FOLLOWING_USERS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
