import { useState } from "react";
import { useRouter } from "next/router";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { auth } from "../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "../pages/Signup/Login.css";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isEmailStep, setIsEmailStep] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEmailStep) {
      setIsEmailStep(false);
    } else {
      try {
        let result = await axios.post("http://localhost:3000/user/login", {
          email,
          password,
        });
        console.log(result);

        localStorage.setItem("user", JSON.stringify(result));
        localStorage.setItem("userType", "user");
        router.push("/Home/home");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userAvatar", user.photoURL || "");
      localStorage.setItem("userType", "user");

      router.push("/Home/home");
    } catch (error) {
      console.error("Error during Google login:", error);
      setError(
        "An error occurred during Google login. Please try again later."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img
          src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732056264/hnmnjb0lmjvlvzgygkku.webp"
          alt="Login illustration"
          className="login-image"
        />
        <h4 className="Logingretting" style={{ marginRight: "160px" }}>
          Explore the world of meta fashion
        </h4>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <h3
          className="loginMessage"
          style={{ marginBottom: "0px", position: "relative", right: "20px" }}
        >
          Login
        </h3>
        <div className="login-link">
          <p>
            New User ?{" "}
            <a
              className="login-link-text"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/Signup/Signup")}
            >
              Create an account
            </a>
          </p>
        </div>

        {isEmailStep ? (
          <div>
            <input
              type="email"
              className="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              autoComplete="off"
            />
          </div>
        ) : (
          <div className="password-container">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="off"
            />
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <button type="submit" className="login-button">
          {isEmailStep ? "Continue" : "Login"}
        </button>

        <div className="or-container">
          <p style={{ marginBottom: "-2px" }}>Or</p>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-button google-button"
            onClick={handleGoogleLogin}
          >
            <FaGoogle style={{ marginRight: "10px", fontSize: "24px" }} />{" "}
            Continue with Google
          </button>
          <button className="social-button facebook-button" disabled>
            <FaFacebook style={{ marginRight: "10px", fontSize: "24px" }} />{" "}
            Continue with Facebook
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
