import axios from "axios";
import {
  CREATE_NEW_DEAL_FAIL,
  CREATE_NEW_DEAL_REQUEST,
  CREATE_NEW_DEAL_SUCCESS,
  GET_ALL_DEALS_REQUEST,
  GET_ALL_DEALS_SUCCESS,
  GET_ALL_DEALS_FAIL,
  CLEAR_ERRORS,
} from "../constants/dealConstants";

export const CreateNewDeal = (dealData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_NEW_DEAL_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    await axios.post("/deals", dealData, config);
    dispatch({ type: CREATE_NEW_DEAL_SUCCESS });
  } catch (error) {
    dispatch({
      type: CREATE_NEW_DEAL_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAllDeals = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_DEALS_REQUEST });
    const { data } = await axios.get("/deals");
    dispatch({ type: GET_ALL_DEALS_SUCCESS, payload: data.deals });
  } catch (error) {
    dispatch({
      type: GET_ALL_DEALS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
