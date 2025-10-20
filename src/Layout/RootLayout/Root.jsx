import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../Components/Shared/Navbar/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import PremiumFaqBot from "../../Components/FaqBot/FaqBot.jsx";

const Root = () => {
  return (
    <div>
      <Navbar></Navbar>
      <PremiumFaqBot></PremiumFaqBot>
       <ScrollToTop/>
      <div className="min-h-screen">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Root;
