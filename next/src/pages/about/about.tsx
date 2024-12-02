import React, { useState } from "react"; 
import "./About.css";
import { teamData } from "./data";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const AboutUs: React.FC = () => {
  const [activeImageIndex1, setActiveImageIndex1] = useState<number>(0);
  const [activeImageIndex2, setActiveImageIndex2] = useState<number>(0);

  const images1: string[] = [
    "https://s3-alpha-sig.figma.com/img/3a8d/fac0/26176011b1d617bcf3a940ae9d262418?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IpFqDpvP-AVpOH-BDjT7gmE1L3K2itKxTP7-SrrWcDKtAfW12wxsxjKt~FX9g48IDFfrYh9U8gyq03WkEoLtBGGrqC0rJ5q208nY9rhgtdnvmRbDKN8i11lyWrC1O9IwXWEdm5dpYibUk7B1agWdhnR-en5NOytOhrp-4XL4r-HFhuvJUj2Pm4ImMtAovQIuwFrdtUxqLC8-~0g4P4rIRQsyH~idLXKBpNNlR6iDj4WasmRhmpJAJmBEoQ1GjokBl7UZBZCaJDDMsvQFKpYDiIBNy1aORDZOABdneey4QJj6EOd4FNPlxzL7q-4YcANS~tC6sHZGpitoWn-Mp-q1dg__",
    "https://s3-alpha-sig.figma.com/img/b291/7b1d/203c1d4d9aa123da053c3da9834047bb?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qGt-IUWJsFHHZOT1kitJ7dwHoNaXIQ4brRhOVVIlnPq0Ew9Mv~IEzJ0Ic9JvOgA2inQDfUITkpI~z6Pl8LF~6fo2P8Z7wqk0LxUwQ0qrDZ2Ilq0cYHTm1B3TgXntkUH9SnrdxP6kXF0KES6ktZEh7hiE1F23d6zqqkQsD12sPa5LINqpp5RZKXR0yVkDN5dGvrEWCLSdyw16SE8uUAHd2HSJa6LD2K3N~tfGvZLOiRZz4~w~Cpt4g7FEpSeCgj~R-py76IhPK94xuPIE4FrogK-sJBigAWTcFSEtMt5d2XTcqE59c9j5YXSsIabJIXh9b9-2UtFNVJfc~hQA1CZ5jA__",
    "https://s3-alpha-sig.figma.com/img/7cd7/af66/606eb5e5df1973d0ec9081bdd910fd56?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NqCAZMWfsRJSxGP2mvwhCIGs8LTiLkOQDqGQesTd7pQKM4gsRR6IPKMzPqhpdD3SVPEaNXL-4Tj-YFHulZKyCBhyajYmyrxn~NHb5TEoviW1akWqMBeExzHr0wPtCK-bJv4xkoOcMdrkpkkVsMQ6QU1PSRSSu5tgsL-n9FPZ~aE5oZ3DQ6EezeHYIS98RWreFpu9JLomaahlIuBZfodWFvLTNQegO84jydRj3WsoEb~pQCYbssYlXDFuQKm0leM424py4ES3Uz~oS82hhg1WK5h3TdYU~5GI4gpccsJOOa6oxAC6lLBTcXN0lKGgEv4Keabn0yEDF6DNkqoE9PUcFw__"
  ];

  const images2: string[] = [
    "https://s3-alpha-sig.figma.com/img/7cd7/af66/606eb5e5df1973d0ec9081bdd910fd56?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NqCAZMWfsRJSxGP2mvwhCIGs8LTiLkOQDqGQesTd7pQKM4gsRR6IPKMzPqhpdD3SVPEaNXL-4Tj-YFHulZKyCBhyajYmyrxn~NHb5TEoviW1akWqMBeExzHr0wPtCK-bJv4xkoOcMdrkpkkVsMQ6QU1PSRSSu5tgsL-n9FPZ~aE5oZ3DQ6EezeHYIS98RWreFpu9JLomaahlIuBZfodWFvLTNQegO84jydRj3WsoEb~pQCYbssYlXDFuQKm0leM424py4ES3Uz~oS82hhg1WK5h3TdYU~5GI4gpccsJOOa6oxAC6lLBTcXN0lKGgEv4Keabn0yEDF6DNkqoE9PUcFw__",
    "https://s3-alpha-sig.figma.com/img/3a8d/fac0/26176011b1d617bcf3a940ae9d262418?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IpFqDpvP-AVpOH-BDjT7gmE1L3K2itKxTP7-SrrWcDKtAfW12wxsxjKt~FX9g48IDFfrYh9U8gyq03WkEoLtBGGrqC0rJ5q208nY9rhgtdnvmRbDKN8i11lyWrC1O9IwXWEdm5dpYibUk7B1agWdhnR-en5NOytOhrp-4XL4r-HFhuvJUj2Pm4ImMtAovQIuwFrdtUxqLC8-~0g4P4rIRQsyH~idLXKBpNNlR6iDj4WasmRhmpJAJmBEoQ1GjokBl7UZBZCaJDDMsvQFKpYDiIBNy1aORDZOABdneey4QJj6EOd4FNPlxzL7q-4YcANS~tC6sHZGpitoWn-Mp-q1dg__",
    "https://s3-alpha-sig.figma.com/img/b291/7b1d/203c1d4d9aa123da053c3da9834047bb?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qGt-IUWJsFHHZOT1kitJ7dwHoNaXIQ4brRhOVVIlnPq0Ew9Mv~IEzJ0Ic9JvOgA2inQDfUITkpI~z6Pl8LF~6fo2P8Z7wqk0LxUwQ0qrDZ2Ilq0cYHTm1B3TgXntkUH9SnrdxP6kXF0KES6ktZEh7hiE1F23d6zqqkQsD12sPa5LINqpp5RZKXR0yVkDN5dGvrEWCLSdyw16SE8uUAHd2HSJa6LD2K3N~tfGvZLOiRZz4~w~Cpt4g7FEpSeCgj~R-py76IhPK94xuPIE4FrogK-sJBigAWTcFSEtMt5d2XTcqE59c9j5YXSsIabJIXh9b9-2UtFNVJfc~hQA1CZ5jA__"
  ];

  const handleImageClick = (setIndex: React.Dispatch<React.SetStateAction<number>>, currentIndex: number, maxLength: number) => {
    setIndex((currentIndex + 1) % maxLength);
  };
    
  return (
    <>

    <div className="about-container">
    <Navbar />
      <section className="about-section center">
        <h2 className="about-subtitle">About Us</h2>
        <h1 className="about-title">Who we are.</h1>
        <p className="about-text">
        We are a passionate team dedicated to blending innovation with creativity to deliver exceptional solutions. 
        With a strong focus on quality and a commitment to exceeding expectations, we strive to make a meaningful impact.
        </p>
        <button className="about-button">More +</button>
      </section>

      <section className="about-section">
        <div className="section-content left">
          <h2 className="about-subtitle">Since 2014</h2>
          <h1 className="about-title">What We Do</h1>
          <p className="about-text">
          At our core, we design and create unique, high-quality fashion pieces that reflect individuality and style. 
          Our process involves meticulous craftsmanship and innovative design thinking, ensuring every creation tells a story.
          </p>
          <button className="about-button">More +</button>
        </div>
        <div 
          className="stacked-images right"
          onClick={() => handleImageClick(setActiveImageIndex1, activeImageIndex1, images1.length)}
        >
          {images1.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Fashion ${index + 1}`}
              className={`stacked-image ${index === activeImageIndex1 ? 'main' : index === (activeImageIndex1 + 1) % 3 ? 'back' : 'back-2'}`}
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div 
          className="stacked-images left"
          onClick={() => handleImageClick(setActiveImageIndex2, activeImageIndex2, images2.length)}
        >
          {images2.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Started ${index + 1}`}
              className={`stacked-image ${index === activeImageIndex2 ? 'main' : index === (activeImageIndex2 + 1) % 3 ? 'back' : 'back-2'}`}
            />
          ))}
        </div>
        <div className="section-about right">
          <h1 className="about-title">When We Started</h1>
          <p className="about-text">
          Our journey began in 2014 with a vision to redefine creativity in fashion and design. 
            From humble beginnings in a small studio, we've grown into a recognized brand known for innovation and artistry.
          </p>
          <button className="about-button">More +</button>
        </div>
      </section>

      <section className="about-section center makers-section">
        <h1 className="about-title">Our Makers</h1>
        <p className="about-text">
        Tracy is a master of detail, combining artistic flair with technical expertise to craft designs that stand out. 
        He leads our design team, ensuring every piece reflects our commitment to excellence and originality.
        Kim is a visionary leader with over a decade of experience in the design and creative industry. 
         He is passionate about pushing boundaries and creating designs that inspire and connect with people worldwide.
        </p>
        <div className="makers-grid">
          {teamData.map((member) => (
            <div key={member.id} className="maker-card">
              <img src={member.image} alt={member.name} className="maker-image" />
              <h3 className="maker-name">{member.name}</h3>
              <div className="maker-role">{member.role}</div>
            </div>
          ))}
        </div>
      </section>
    <Footer />
    </div>
    </>
  );
};

export default AboutUs;