import React from "react";
import { CgUnavailable } from "react-icons/cg";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not_found">
      <CgUnavailable />
      Products Not found
    </div>
  );
};

export default NotFound;
