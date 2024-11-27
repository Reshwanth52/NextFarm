import React, { Fragment, useState } from "react";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Backdrop from "@material-ui/core/Backdrop";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { CgProfile } from "react-icons/cg";
import { FaOpencart } from "react-icons/fa";
import { logout } from "../../../actions/userAction";
import { Avatar } from "@mui/material";

const UserOptions = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const { cartItems } = useSelector((state) => state.cart);

  const dashboard = () => {
    navigate("/admin/dashboard");
  };

  const orders = () => {
    navigate("/orders");
  };

  const cart = () => {
    navigate("/cart");
  };
  const account = () => {
    navigate("/account");
  };
  const logoutUser = () => {
    dispatch(logout());
    location.state = null;
    alert.success("Logout Sucessfully");
  };

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    {
      icon: (
        <FaOpencart
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user && user.userRole === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  return (
    <Fragment>
      {isAuthenticated ? (
        <Fragment>
          <Backdrop open={open} style={{ zIndex: 10 }} />
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            className="speedDial"
            open={open}
            direction={"down"}
            icon={
              user.avatar ? (
                <img
                  className="speedDialIcon"
                  src={user ? user.avatar.url : "./Profile.png"}
                  alt="Profile"
                />
              ) : (
                <Avatar> {user.name.substr(0, 1)}</Avatar>
              )
            }
          >
            {options.map((item) => (
              <SpeedDialAction
                key={item.name}
                icon={item.icon}
                tooltipTitle={item.name}
                tooltipOpen={window.innerWidth <= 600 ? true : false}
                onClick={item.func}
              />
            ))}
            ;
          </SpeedDial>
        </Fragment>
      ) : (
        <Link to={"/login"}>
          <CgProfile />
          Login
        </Link>
      )}
    </Fragment>
  );
};

export default UserOptions;
