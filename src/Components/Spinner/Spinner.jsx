import React from "react";
import "./style.css";

const Spinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="loading">
        <span className="block"></span>
        <span className="block"></span>
        <span className="block"></span>
        <span className="block"></span>
        <span className="block"></span>
      </div>
    </div>
  );
};

export default Spinner;
