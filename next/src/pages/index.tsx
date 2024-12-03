import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaGoogle, FaFacebook , FaGithub} from 'react-icons/fa';
import { auth } from '../firebaseConfig'; 
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider  , GithubAuthProvider } from 'firebase/auth'; 
import Swal from 'sweetalert2';
import axios from 'axios';
import '../pages/Signup/Login.css';
import '../app/globals.css'

const Login = () => { 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isEmailStep, setIsEmailStep] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEmailStep) {
      setIsEmailStep(false);
    } else {
      axios.post('http://localhost:3001/user/login', {
          email,
          password,
        })
        .then((response) => {
          if (response.status === 200) {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userAvatar', response.data.user.avatar);
            localStorage.setItem('userType', user.type);
            
            if (user.type === 'admin' && user.banned === false ) {
              router.push('/Admin/hooks/Admin');
            } else if ( (user.type === 'user' && user.banned === false) ) {
              router.push('/Home/home');
            }
            else if(user.banned === true) {
              Swal.fire({
                icon: 'error',
                title: '<span class="swal-title-error">Account Suspended</span>',
                text: 'Your account has been suspended due to policy violations. Please contact support for more information.',
                background: 'rgba(255, 255, 255, 0.1)', 
                color: 'red', 
                confirmButtonText: 'Got it!',
                customClass: {
                  title: 'swal-title-error',
                  htmlContainer: 'swal-content',
                    confirmButton: 'login-custom-button',
                }
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userAvatar', user.photoURL || ''); 
      localStorage.setItem('userType', 'user');
      
      router.push('/Home/home');
    } catch (error) {
      console.error("Error during Google login:", error);
      setError(
        "An error occurred during Google login. Please try again later."
      );
    }
  };

  async function handleFacebookSignIn() {
    const facebookProvider = new FacebookAuthProvider()

    facebookProvider.addScope('email'); 
    facebookProvider.setCustomParameters({
      'display': 'popup'
    });

    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const token = await user.getIdToken()
      localStorage.setItem("token", token)

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));

      router.push("/Home/home");
      //window.location.reload()
    } catch (err: any) {
      console.error(err);
      setError("Facebook sign-in failed. Please try again.");
    }
  }
  const handleGitHubLogin = async () => {
    const githubProvider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, githubProvider);

      const user = result.user;
      console.log('Logged in user:', user);
      const token = await user.getIdToken();

      localStorage.setItem('token', token);

    localStorage.setItem(
      'user',
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      })
    );

      router.push('/Home/home');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('GitHub Login Error:', errorCode, errorMessage);

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
            New User?{' '}
            <a className="login-link-text" style={{ cursor: 'pointer' }} onClick={() => router.push('/Signup/Signup')}>
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
  <button className="social-button google-button" type="button" onClick={handleGoogleLogin}>
    <FaGoogle style={{ marginRight: '10px', fontSize: '24px' }} /> Continue with Google
  </button>
  <button className="social-button facebook-button" type="button" onClick={handleFacebookSignIn}>
    <FaFacebook style={{ marginRight: '10px', fontSize: '24px' }} /> Continue with Facebook
  </button>
  <button className="social-button github-button" type="button" onClick={handleGitHubLogin}>
    <FaGithub style={{ marginRight: '10px', width: '20px', height: '20px' }} /> Continue with GitHub
  </button>
</div>
      </form>
    </div>
  );
};

export default Login;
