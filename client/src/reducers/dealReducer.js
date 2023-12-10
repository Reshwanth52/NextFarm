import {
  CREATE_NEW_DEAL_FAIL,
  CREATE_NEW_DEAL_REQUEST,
  CREATE_NEW_DEAL_SUCCESS,
  GET_ALL_DEALS_REQUEST,
  GET_ALL_DEALS_SUCCESS,
  GET_ALL_DEALS_FAIL,
  CLEAR_ERRORS,
} from "../constants/dealConstants";

export const newDealsReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_NEW_DEAL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_NEW_DEAL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case CREATE_NEW_DEAL_FAIL:
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
export const dealsReducer = (state = { deals: [] }, action) => {
  switch (action.type) {
    case GET_ALL_DEALS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_DEALS_SUCCESS:
      return {
        ...state,
        loading: false,
        deals: action.payload,
      };
    case GET_ALL_DEALS_FAIL:
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
