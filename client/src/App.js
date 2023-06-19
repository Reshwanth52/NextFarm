import React from "react";
import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome";
import Pesticide from "./components/Pesticide/Pesticide";
import Gadget from "./components/Gadget/Gadget";
import Dealership from "./components/Dealership/Dealership";
import Eatable from "./components/Eatable/Eatable";
import Feed from "./components/Feed/Feed";
import ProductDetails from "./components/Product/ProductDetails";
import PageNotFound from "./components/PageNotFound/PageNotFound";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/pesticides" element={<Pesticide />} />
          <Route path="/automobiles" element={<Gadget />} />
          <Route path="/eatables" element={<Eatable />} />
          <Route path="/feeds" element={<Feed />} />
          <Route path="/deals" element={<Dealership />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products/pesticides/:keyword" element={<Pesticide />} />
          <Route path="/products/automobiles/:keyword" element={<Gadget />} />
          {/* <Route path="/*" element={<PageNotFound />} /> */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
