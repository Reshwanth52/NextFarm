import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LoginSignup.css";
import { GoMail } from "react-icons/go";
import { BiLockOpen } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";

const LoginSignup = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = userData;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "signup") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  useEffect(() => {
    if (!loading && error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(location.state ? location.state?.from : "/");
    }
  }, [dispatch, error, alert, isAuthenticated, location, navigate, loading]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignupContainer">
            <div className="LoginSignupBox">
              <div>
                <div className="login_signup_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "signup")}>SIGNUP</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <GoMail />
                  <input
                    type="email"
                    value={loginEmail}
                    placeholder="Email"
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="loginPassword">
                  <BiLockOpen />
                  <input
                    type="password"
                    value={loginPassword}
                    placeholder="Password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Link to="/password/forgot">Forgot Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <IoPersonOutline />
                  <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Name"
                    minLength={4}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div className="signUpEmail">
                  <GoMail />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div className="signUpPassword">
                  <BiLockOpen />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    minLength={8}
                    onChange={registerDataChange}
                    required
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="SignUp" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignup;
