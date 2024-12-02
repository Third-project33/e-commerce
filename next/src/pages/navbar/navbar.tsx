import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FiSearch,
  FiShoppingCart,
  FiBell,
  FiMessageSquare,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import "./navbar.css";
import ChatWidget from "../ChatWidget";
// Removed Socket.IO import
// const socket = io("http://localhost:3000");

const Navbar = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const savedAvatar =
      userData.avatar || localStorage.getItem(`userAvatar_${userData.id}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      setAvatar(
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
      );
    }

    // Removed Socket.IO listeners
    // return () => {
    //   socket.off("receiveNotification");
    //   socket.off("receiveMessage");
    // };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
    window.location.reload();
  };

  return (
    <>
      <div className="nav-container">
        <a href="/Home/home" className="logo">
          Logo
        </a>
        <div className="nav-center">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="search"
              className="search-bar"
              placeholder="Search Items, Fashion, Collection and Users"
            />
          </div>
          <nav className="nav-links">
            <a
              onClick={() => router.push("/Home/home")}
              style={{ cursor: "pointer" }}
            >
              Home
            </a>
            <a
              onClick={() => router.push("/Products/Productlist")}
              style={{ cursor: "pointer" }}
            >
              Explore <FiChevronDown />
            </a>
            <a href="#collection">Personal Collection</a>
            <a href="#drops">Drops</a>
            <a
              onClick={() => router.push("/about/about")}
              className="more-link"
              style={{ cursor: "pointer" }}
            >
              More <FiChevronDown />
            </a>
          </nav>
        </div>
        <div className="nav-right">
          <button className="icon-button">
            <FiBell size={20} />
          </button>
          <button
            className="icon-button"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <FiMessageSquare size={20} />
          </button>
          <button
            className="wallet-btn"
            onClick={() => router.push("/Cart/Cart")}
          >
            <FiShoppingCart size={18} />
          </button>
          <img
            onClick={() => router.push("/Profile/Profile")}
            src={avatar}
            alt="Profile"
            className="profile-img"
          />
          <button className="icon-button" onClick={handleLogout}>
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Navbar;
