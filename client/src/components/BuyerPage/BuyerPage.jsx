import React from "react";
import "./BuyerPage.css";
import { MdOutlineFilterList } from "react-icons/md";

const BuyerPage = () => {
  const SalesCard = () => {
    return (
      <>
        <div className="sales_card">
          <p>Crop Name : Paddy</p>
          <p>Location : Nellore, Andhrapradesh</p>
          <p>Seller : Sai</p>
          <span>click on card for more details</span>
        </div>
        <div className="sales_card">
          <p>Crop Name : Wheat</p>
          <p>Location : Kavali, Andhrapradesh</p>
          <p>Seller : Ravi</p>
          <span>click on card for more details</span>
        </div>
      </>
    );
  };
  return (
    <div className="buyerPage">
      <div className="head">
        <h3>Make Deals with Best Price</h3>
      </div>
      <div className="body">
        <div className="buyerPage_left">
          <p>
            Filters <MdOutlineFilterList />
          </p>
          <div className="radio_filter">
            <label htmlFor="All">
              <input
                type="radio"
                name="filter_radio"
                id="All"
                value={"All"}
                defaultChecked
              />
              All
            </label>
            <label htmlFor="Marked">
              <input
                type="radio"
                name="filter_radio"
                id="Marked"
                value={"Marked"}
              />
              Marked
            </label>
            <label htmlFor="Unmarked">
              <input
                type="radio"
                name="filter_radio"
                id="Unmarked"
                value={"Unmarked"}
              />
              UnMarked
            </label>
          </div>
          <p>Search by Crops</p>
          <select name="">
            <option value="">Select by Crop</option>
            <option value="">Paddy</option>
            <option value="">Wheat</option>
            <option value="">Tomato</option>
            <option value="">Banana</option>
            <option value="">Potato</option>
            <option value="">Pulses</option>
            <option value="">Lemon</option>
            <option value="">Brinjal</option>
          </select>
          <p>Select by State</p>
          <select name="" id="">
            <option value="">Select by State</option>
            <option value="">AndhraPradesh</option>
            <option value="">Kerala</option>
            <option value="">TamilNadu</option>
            <option value="">Karnataka</option>
            <option value="">Gujarat</option>
          </select>
          <p>Select by Area</p>
          <select name="" id="">
            <option value="">Select by Area</option>
            <option value="">Nellore</option>
            <option value="">Sangam</option>
            <option value="">Atmakur</option>
            <option value="">Kavali</option>
            <option value="">Rebala</option>
          </select>
        </div>
        <div className="buyerPage_right">
          <div className="sales_cards">
            <SalesCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerPage;
