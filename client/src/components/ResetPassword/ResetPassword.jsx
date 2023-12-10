import React, { Fragment, useEffect, useState } from "react";
import { BiLockOpen, BiLock } from "react-icons/bi";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import { USER_PASSWORD_RESET } from "../../constants/userConstant";
import { useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const { token } = useParams();
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Reset Successfully");

      navigate("/login");

      dispatch({
        type: USER_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, alert, success, navigate]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Create New Password</h2>
              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div className="password">
                  <BiLockOpen />
                  <input
                    type={passwordVisibility ? "text" : "password"}
                    value={password}
                    placeholder="New Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password && (
                    <Fragment>
                      {passwordVisibility ? (
                        <PiEyeSlashLight
                          className="passwordVisibility"
                          onClick={() =>
                            setPasswordVisibility(!passwordVisibility)
                          }
                        />
                      ) : (
                        <PiEyeLight
                          className="passwordVisibility"
                          onClick={() =>
                            setPasswordVisibility(!passwordVisibility)
                          }
                        />
                      )}
                    </Fragment>
                  )}
                </div>
                <div className="password">
                  <BiLock />
                  <input
                    type={confirmPasswordVisibility ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && (
                    <Fragment>
                      {confirmPasswordVisibility ? (
                        <PiEyeSlashLight
                          className="passwordVisibility"
                          onClick={() =>
                            setConfirmPasswordVisibility(
                              !confirmPasswordVisibility
                            )
                          }
                        />
                      ) : (
                        <PiEyeLight
                          className="passwordVisibility"
                          onClick={() =>
                            setConfirmPasswordVisibility(
                              !confirmPasswordVisibility
                            )
                          }
                        />
                      )}
                    </Fragment>
                  )}
                </div>

                <input
                  type="submit"
                  value="Reset"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
