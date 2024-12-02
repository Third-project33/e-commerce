import React from 'react';
import './footer.css';
import Image from 'next/image';
import fb from '../../app/images/facebook-icon.avif'
import discord from '../../app/images/discord-icon.png'
import insta from '../../app/images/instagram-icon.avif'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="logo">LOGO</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque donec non pellentesque ut.</p>
        </div>

        <div className="footer-section">
          <h4>About</h4>
          <ul>
            <li>Product</li>
            <li>Resource</li>
            <li>Term & Condition</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>Our Team</li>
            <li>Partner With Us</li>
            <li>Privacy & Policy</li>
            <li>Features</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>+012 3456789</li>
            <li>adorableprogrammer@gmail.com</li>
            <div className="social-icons">
              <a href="#"><Image src={fb} 
              width={40}
              height={20}
              alt="Facebook" /></a>
              <a href="#"><Image src={discord}
              width={40}
              height={20}
               alt="Discord" /></a>
              <a href="#"><Image src={insta} 
              width={40}
              height={20}
              alt="Instagram" /></a>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;