import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../Components/Shared/Navbar/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";

const Root = () => {
  return (
    <div>
      <Navbar></Navbar>
       <ScrollToTop/>
      <div className="min-h-screen">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Root;
