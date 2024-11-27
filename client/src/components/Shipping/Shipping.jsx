import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import {
  MdPinDrop,
  MdLocationCity,
  MdTransferWithinAStation,
} from "react-icons/md";
import { BiSolidHome, BiSolidPhone } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import { saveShippingInfo } from "../../actions/cartAction";
import CheckOutSteps from "./CheckOutSteps";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const shippingSubmitHandler = (e) => {
    e.preventDefault();
    if (phoneNo.length < 10 || phoneNo.length > 10) {
      alert.error("Phone Number should be 10 digits Long");
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    navigate("/order/confirm");
  };
  return (
    <Fragment>
      <CheckOutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form className="shippingForm" onSubmit={shippingSubmitHandler}>
            <div>
              <BiSolidHome />
              <input
                type="text"
                value={address}
                placeholder="Shipping Address"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <MdLocationCity />
              <input
                type="text"
                value={city}
                placeholder="Shipping City"
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <MdPinDrop />
              <input
                type="number"
                value={pinCode}
                placeholder="Pin Code"
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
            </div>
            <div>
              <BiSolidPhone />
              <input
                type="number"
                value={phoneNo}
                placeholder="Phone Number"
                onChange={(e) => setPhoneNo(e.target.value)}
                size={10}
                required
              />
            </div>
            <div>
              <BsGlobeAsiaAustralia />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}{" "}
                    </option>
                  ))}
              </select>
            </div>
            {country && (
              <div>
                <MdTransferWithinAStation />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}{" "}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
