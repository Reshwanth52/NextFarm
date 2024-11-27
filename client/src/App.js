import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome";
import Product from "./components/Product/Product";
import Dealership from "./components/Dealership/Dealership";
import Feed from "./components/Feed/Feed";
import ProductDetails from "./components/Product/ProductDetails";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import BuyerPage from "./components/BuyerPage/BuyerPage";
import Farmerform from "./components/Farmerform/Farmerform";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import WebFont from "webfontloader";
import { clearErrors, loadUser } from "./actions/userAction";
import Profile from "./components/Profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import UpdatePassword from "./components/UpdatePassword/UpdatePassword";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Shipping/Shipping";
import ConfirmOrder from "./components/ConfirmOrder/ConfirmOrder";
import Payment from "./components/Payment/Payment";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/OrderSuccess/OrderSuccess";
import MyOrders from "./components/MyOrders/MyOrders";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import ProductList from "./components/Admin/ProductList/ProductList";
import NewProduct from "./components/Admin/NewProduct/NewProduct";
import { useAlert } from "react-alert";
import UpdateProduct from "./components/Admin/UpdateProduct/UpdateProduct";
import OrderList from "./components/Admin/OrderList/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder/ProcessOrder";
import UserList from "./components/Admin/UserList/UserList";
import UpdateUser from "./components/Admin/UpdateUser/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews/ProductReviews";
import Cards from "./components/card/Card";

function App() {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, user, error, loading } = useSelector(
    (state) => state.user
  );

  const [stripeApiKey, setStripeApiKey] = useState("");

  const getStripeApiKey = async () => {
    if (isAuthenticated) {
      const { data } = await axios.get("/api/v1/stripeapikey");

      setStripeApiKey(data?.stripeApiKey);
    }
  };

  const PaymentRoute = () => {
    return (
      <Elements stripe={loadStripe(stripeApiKey)}>
        <Payment />
      </Elements>
    );
  };
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    if (error) {
      dispatch(clearErrors());
    }
    dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/products/:productType" element={<Product />} />
          <Route path="/feeds" element={<Feed />} />
          <Route path="/dealerships" element={<Dealership />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products/:productType/:keyword" element={<Product />} />
          <Route path="/dealerships/farmer" element={<Farmerform />} />
          <Route path="/dealerships/sales" element={<BuyerPage />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/card" element={<Cards />} />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/account" element={<Profile />} />
            <Route path="/profile/update" element={<UpdateProfile />} />
            <Route path="/password/update" element={<UpdatePassword />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/order/confirm" element={<ConfirmOrder />} />
            <Route path="/success" element={<OrderSuccess />} />

            <Route path="/orders" element={<MyOrders />} />
            <Route path="/order/:id" element={<OrderDetails />} />

            {stripeApiKey && (
              <Route path="/process/payment" element={<PaymentRoute />} />
            )}
          </Route>

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/product"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <NewProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/:productId"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <UpdateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <ProductReviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <OrderList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/order/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <ProcessOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <UserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user/:userId"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isAdmin={user?.userRole}
                adminRoute={true}
              >
                <UpdateUser />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
