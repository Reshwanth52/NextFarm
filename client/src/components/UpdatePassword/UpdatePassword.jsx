import React, { Fragment, useEffect, useState } from "react";
import { BiLockOpen, BiLock } from "react-icons/bi";
import { BsKey } from "react-icons/bs";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import "./UpdatePassword.css";
import { USER_PASSWORD_RESET } from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector(
    (state) => state.updateProfile
  );

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [oldPasswordVisibility, setOldPasswordVisibility] = useState(false);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password Updated Successfully");

      navigate("/account");

      dispatch({
        type: USER_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, alert, isUpdated, navigate]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Password</h2>
              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="password">
                  <BsKey />
                  <input
                    type={oldPasswordVisibility ? "text" : "password"}
                    value={oldPassword}
                    placeholder="Old password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  {oldPassword && (
                    <Fragment>
                      {oldPasswordVisibility ? (
                        <PiEyeSlashLight
                          className="passwordVisibility"
                          onClick={() =>
                            setOldPasswordVisibility(!oldPasswordVisibility)
                          }
                        />
                      ) : (
                        <PiEyeLight
                          className="passwordVisibility"
                          onClick={() =>
                            setOldPasswordVisibility(!oldPasswordVisibility)
                          }
                        />
                      )}
                    </Fragment>
                  )}
                </div>
                <div className="password">
                  <BiLockOpen />
                  <input
                    type={newPasswordVisibility ? "text" : "password"}
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  {newPassword && (
                    <Fragment>
                      {newPasswordVisibility ? (
                        <PiEyeSlashLight
                          className="passwordVisibility"
                          onClick={() =>
                            setNewPasswordVisibility(!newPasswordVisibility)
                          }
                        />
                      ) : (
                        <PiEyeLight
                          className="passwordVisibility"
                          onClick={() =>
                            setNewPasswordVisibility(!newPasswordVisibility)
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
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
