import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="navigate">
        <div className="col1">
          <Link>About us</Link>
          <Link>Contact us</Link>
          <Link>Vision & Mission</Link>
        </div>
        <div className="col2">
          <Link>Feedback</Link>
          <Link>FAQ</Link>
        </div>
        <div className="col3">
          Follow us on
          <Link>Facebook</Link>
          <Link>Instagram</Link>
        </div>
      </div>
      <div className="copyRight">
        Copyright &copy; 2023 NEXTFARM. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
