"use client";
import React from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "./verified.css"
import { teamData } from "./data";


const VerifiedArtists = () => {
  return (
    <>
      <div className="verified-artists">
        <Navbar />
        <div className="content-wrapper">
          <h1>Verified Artists</h1>
          <section className="about-section center makers-section">
        <h1 className="about-title">Our Makers</h1>
        <p className="about-text1">
        Tracy is a master of detail, combining artistic flair with technical expertise to craft designs that stand out. 
        He leads our design team, ensuring every piece reflects our commitment to excellence and originality.
        Kim is a visionary leader with over a decade of experience in the design and creative industry. 
         He is passionate about pushing boundaries and creating designs that inspire and connect with people worldwide.
        </p>
        <div className="makers-grid1">
          {teamData.map((member) => (
            <div key={member.id} className="maker-card1">
              <img src={member.image} alt={member.name} className="maker-image1" />
              <h3 className="maker-name">{member.name}</h3>
              <div className="maker-role">{member.role}</div>
            </div>
          ))}
        </div>
      </section>
          <p>Discover our talented verified artists.</p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default VerifiedArtists; 