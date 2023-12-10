import React, { useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, getAdminProducts } from "../../../actions/productAction";
import { getAllUsers } from "../../../actions/userAction";
import { getAllOrders } from "../../../actions/orderAction";

ChartJs.register(
  LinearScale,
  PointElement,
  CategoryScale,
  LineElement,
  ArcElement,
  Legend,
  Tooltip
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { error: userError, users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  let totalAmount = 0;

  orders &&
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: "tomato",
        borderColor: "grey",
        borderWidth: 1,
        data: [0, totalAmount],
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: true,
    },
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A684", "#680084"],
        hoverBackgroundColor: ["#485000", "#35014F"],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (userError) {
      alert.error(userError);
      dispatch(clearErrors());
    }

    dispatch(getAdminProducts());
    dispatch(getAllUsers());
    dispatch(getAllOrders());
  }, [dispatch, error, alert, userError]);
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to={"/admin/products"}>
              <p>Product</p>
              <span>{products && products.length} </span>
            </Link>
            <Link to={"/admin/orders"}>
              <p>Orders</p>
              <span>{orders && orders.length} </span>
            </Link>
            <Link to={"/admin/users"}>
              <p>Users</p>
              <span>{users && users.length} </span>
            </Link>
          </div>
        </div>
        <div className="lineChart">
          <Line data={lineState} options={lineOptions} />
        </div>
        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
