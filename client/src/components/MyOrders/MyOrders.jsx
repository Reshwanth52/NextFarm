import React, { Fragment, useEffect } from "react";
import "./MyOrders.css";
import { Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { MdLaunch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearErrors, myOrders } from "../../actions/orderAction";

const MyOrders = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 360, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 250,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      flex: 2,
      minWidth: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      type: "number",
      minWidth: 50,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.row?.id}`}>
            <MdLaunch />
          </Link>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) =>
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      })
    );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error, alert]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
          />

          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
