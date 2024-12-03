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
          <p>We ensure that all brands listed here meet our quality standards and are trusted by consumers worldwide.</p>
          <div className="brand-container">
            <div className="brand-card">
              <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1d6e5a46374707.5607cf2c19895.png" alt="Nike Logo" />
              <div className="brand-info">
                <h2 style={{ color: 'black' }}>Nike</h2>
                <div className="brand-details">
                  <span className="verification-sign">✔️ Verified</span>
                </div>
              </div>
            </div>
            <div className="brand-card">
              <img src="https://i.pinimg.com/474x/a3/7d/01/a37d0161f0a90ffe5c4f9fcaf7726c03.jpg" alt="Another Brand Logo" />
              <div className="brand-info">
                <h2 style={{ color: 'black' }}>Another Brand</h2>
                <div className="brand-details">
                  <span className="verification-sign">✔️ Verified</span>
                </div>
              </div>
            </div>
            <div className="brand-card">
              <img src="https://static.cdnlogo.com/logos/p/40/puma.png" alt="Brand 3 Logo" />
              <div className="brand-info">
                <h2 style={{ color: 'black' }}>Brand 3</h2>
                <div className="brand-details">
                  <span className="verification-sign">✔️ Verified</span>
                </div>
              </div>
            </div>
            <div className="brand-card">
              <img src="https://banner2.cleanpng.com/20180808/xsb/90bae36990468dfbef0296fb4b374140.webp" alt="Brand 4 Logo" />
              <div className="brand-info">
                <h2 style={{ color: 'black' }}>Brand 4</h2>
                <div className="brand-details">
                  <span className="verification-sign">✔️ Verified</span>
                </div>
              </div>
            </div>
            <div className="brand-card">
              <img src="https://static.vecteezy.com/ti/vecteur-libre/p1/21059821-gucci-logo-gucci-icone-avec-police-de-caracteres-sur-noir-contexte-gratuit-vectoriel.jpg" alt="Brand 5 Logo" />
              <div className="brand-info">
                <h2 style={{ color: 'black' }}>Brand 5</h2>
                <div className="brand-details">
                  <span className="verification-sign">✔️ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default VerifiedBrands; 