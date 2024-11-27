import React, { useState, useEffect } from "react";
import "./Farmerform.css";
import { RiImageAddLine } from "react-icons/ri";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { State, City } from "country-state-city";

const Farmerform = () => {
  const [cropName, setCropName] = useState("");
  const [cropType, setCropType] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [images, setImages] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="farmerForm">
      <h3>Sell the harvest and get the reward for your hard work</h3>
      <form onSubmit={() => submitHandler()}>
        <FormControl required sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-required-label">State</InputLabel>

          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={state}
            label="Age *"
            onChange={(e) => setState(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {State &&
              State.getStatesOfCountry(country).map((state) => (
                <MenuItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        <FormControl required sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-required-label">City</InputLabel>

          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={city.name}
            label="Age *"
            onChange={(e) => setCity(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {City &&
              City.getCitiesOfState(country, state).map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>
      </form>
    </div>
  );
};

export default Farmerform;
