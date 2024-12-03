"use client";
import React from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "./verified.css"

const VerifiedBrands = () => {
  return (
    <>
      <div className="verified-brands">
        <Navbar />
        <div className="content-wrapper">
          <h1>Verified Brands</h1>
          <p>Explore our collection of verified brands.</p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default VerifiedBrands; 