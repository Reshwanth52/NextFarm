import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoBugOutline } from "react-icons/io5";
import { FaTools } from "react-icons/fa";
import { VscTools } from "react-icons/vsc";
import {
  HiOutlineCurrencyRupee,
  HiOutlineNewspaper,
  HiNewspaper,
  HiCurrencyRupee,
} from "react-icons/hi2";
import { CiForkAndKnife } from "react-icons/ci";
import { AiFillBug, AiOutlineSearch } from "react-icons/ai";
import { ImSpoonKnife } from "react-icons/im";
import { RxHamburgerMenu } from "react-icons/rx";
import UserOptions from "./UserOptions";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentab, setCurrentTab] = useState("/");
  const [keyword, setKeyword] = useState("");
  const [tabs] = useState(["pesticides", "automobiles", "eatables"]);

  useEffect(() => {
    setCurrentTab(location.pathname);
  }, [location]);

  const checkTabValidity = () => {
    if (currentab === "/") {
      return true;
    }
    for (const tab of tabs) {
      if (currentab.includes(tab)) {
        return true;
      }
    }
    return false;
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (currentab.includes("pesticides"))
      navigate(`/products/pesticides/${keyword}`);
    if (currentab.includes("automobiles"))
      navigate(`/products/automobiles/${keyword}`);
    if (currentab.includes("eatables"))
      navigate(`/products/eatables/${keyword}`);
  };

  return (
    <div className="header">
      <div className="top_header">
        <div className="logo">
          <span className="logoText" onClick={() => navigate("/")}>
            NEXTFARM
          </span>
        </div>
        <div className="navItems">
          <div className="navLinks">
            <Link
              to="/products/pesticides"
              onClick={() => setCurrentTab("/products/pesticides")}
            >
              {currentab.includes("pesticides") ? (
                <AiFillBug />
              ) : (
                <IoBugOutline />
              )}
              Pesticides
            </Link>
            <Link
              to="/products/automobiles"
              onClick={() => setCurrentTab("/products/automobiles")}
            >
              {currentab.includes("automobiles") ? <FaTools /> : <VscTools />}
              Gadgets
            </Link>
            <Link
              to="/products/eatables"
              onClick={() => setCurrentTab("/products/eatables")}
            >
              {currentab.includes("eatables") ? (
                <ImSpoonKnife />
              ) : (
                <CiForkAndKnife />
              )}
              Eatables
            </Link>
            <Link to="/feeds" onClick={() => setCurrentTab("/feeds")}>
              {currentab.includes("feeds") ? (
                <HiNewspaper />
              ) : (
                <HiOutlineNewspaper />
              )}
              Feeds
            </Link>
            <Link
              to="/dealerships"
              onClick={() => setCurrentTab("/dealerships")}
            >
              {currentab.includes("dealerships") ? (
                <HiCurrencyRupee />
              ) : (
                <HiOutlineCurrencyRupee />
              )}
              Dealership
            </Link>
          </div>
          <div className="right_header">
            <UserOptions />
          </div>
          <RxHamburgerMenu className="navHamburger" />
        </div>
      </div>
      {checkTabValidity() ? (
        <div className="">
          <div className="banner">
            <form
              className="searchbar"
              onSubmit={(e) => searchSubmitHandler(e)}
            >
              <input
                type="search"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit">
                <AiOutlineSearch />
              </button>
            </form>
          </div>
          <div className="bottom_header">Grow With Green</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
