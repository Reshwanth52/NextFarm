import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { IoBugOutline } from "react-icons/io5";
import { FaOpencart, FaTools } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
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

const Header = () => {
  const [tab, setTab] = useState("/");
  const [keyword, setKeyword] = useState("");
  const [navTabs, setNavTabs] = useState([
    "/",
    "/pesticides",
    "/gadgets",
    "/eatables",
    `/products/${keyword}`,
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    setTab(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    setNavTabs([
      "/",
      "/pesticides",
      "/automobiles",
      "/eatables",
      `/products/pesticides/${keyword}`,
      `/products/automobiles/${keyword}`,
    ]);
  }, [window.location.pathname]);

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      if (tab.includes("pesticides")) {
        navigate(`/products/pesticides/${keyword}`);
      } else if (tab.includes("automobiles")) {
        navigate(`/products/automobiles/${keyword}`);
        setTab(`/products/automobiles/${keyword}`);
      } else {
        navigate(`/products/eatables/${keyword}`);
        setTab(`/products/eatables/${keyword}`);
      }
    } else {
      if (tab.includes("pesticides")) {
        navigate("/pesticides");
      } else if (tab.includes("automobiles")) {
        navigate("/automobiles");
      } else {
        navigate("/eatables");
      }
    }
  };
  return (
    <div className="header">
      <div className="top_header">
        <div className="logo">
          <span className="logoText" onClick={() => navigate("/")}>
            NEXTFARM
          </span>
        </div>
        <div className="navLinks">
          <Link to="/pesticides" onClick={() => setTab("/pesticides")}>
            {tab === "/pesticides" ? <AiFillBug /> : <IoBugOutline />}
            Pesticides
          </Link>
          <Link to="/automobiles" onClick={() => setTab("/gadgets")}>
            {tab === "/automobiles" ? <FaTools /> : <VscTools />}
            Gadgets
          </Link>
          <Link to="/eatables" onClick={() => setTab("/eatables")}>
            {tab === "/eatables" ? <ImSpoonKnife /> : <CiForkAndKnife />}
            Eatables
          </Link>
          <Link to="/feeds" onClick={() => setTab("/feeds")}>
            {tab === "/feeds" ? <HiNewspaper /> : <HiOutlineNewspaper />}
            Feeds
          </Link>
          <Link to="/deals" onClick={() => setTab("/dealerships")}>
            {tab === "/deals" ? (
              <HiCurrencyRupee />
            ) : (
              <HiOutlineCurrencyRupee />
            )}
            Dealership
          </Link>
        </div>
        <div className="right_header">
          <Link>
            <FaOpencart />
            Cart
          </Link>
          <Link>
            <CgProfile />
            Login
          </Link>
        </div>
      </div>
      {navTabs.includes(tab) ? (
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
