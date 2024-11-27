import React from "react";
import "./Dealership.css";
import { useNavigate } from "react-router-dom";

const Dealership = () => {
  const navigate = useNavigate();

  return (
    <div className="dealership">
      <h2>Find the Best Deal and Higher You get Paid Now</h2>
      <p>
        Best Deals are Waiting for You, Our Motto is to give farmers the results
        of their hard work today
      </p>
      <h4>Please Identify yourself</h4>
      <input
        type="button"
        value="Farmer"
        className="Profession_button"
        onClick={() => navigate("/dealerships/farmer")}
      />
      <input
        type="button"
        value="Dealer"
        className="Profession_button"
        onClick={() => navigate("/dealerships/sales")}
      />
    </div>
  );
};

export default Dealership;
