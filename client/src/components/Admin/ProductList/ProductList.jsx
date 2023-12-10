import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../../actions/productAction";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "../Sidebar/Sidebar";
import { DELETE_PRODUCT_RESET } from "../../../constants/productConstants";

const ProductList = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, alert, isDeleted, deleteError]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, frlx: 0.5 },
    { field: "name", headerName: "Product Name", minWidth: 350, flex: 1 },
    { field: "category", headerName: "category", minWidth: 150, flex: 0.3 },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="productActions">
            <Link to={`/admin/product/${params.row?.id}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteProductHandler(params.row?.id)}>
              <DeleteIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) =>
      rows.push({
        id: item._id,
        name: item.name,
        stock: item.stock,
        category: item.category,
      })
    );
  return (
    <Fragment>
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Products</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
