import React, { useEffect, useState } from 'react';
import '../Admin/Userdetails.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Userdetails = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userposts, setUserposts] = useState([]);
  
    const location = useLocation();
    const { userId } = location.state || {};

    useEffect(() => {
        if (!userId) {
            console.error("No userId found in location state. Redirecting...");
            navigate("/UsersAdmin");
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`);
                console.log("User details response:", response.data);
                setUser(response.data);
                const response2 = await axios.get(`http://localhost:3000/posts/user/${userId}`);
                setUserposts(response2.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setUser(null);
            }
        };

        fetchUserDetails();
    }, [userId, navigate]);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user && user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="Profile" 
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                    ) : (
                        <div className="avatar-placeholder">
                            {user ? user.firstName.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                </div>
                <h1>{user ? user.firstName : 'Loading...'}</h1>
                <p className="email">{user ? user.email : 'Loading...'}</p>
            </div>

            <div className="User-posts">
                <h2>{user ? `${user.firstName}'s posts:` : 'Loading posts...'}</h2>
                <div className="posts-grid">
                    {userposts.length > 0 ? (
                        userposts.map((post) => (
                            <div key={post.id} className="posts-data">
                                <h4>{post.content}</h4>
                                <div  className="post-image-container">
                                    <img src={post.image} alt={post.content.charAt(0).toUpperCase()} className="post-image" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            </div>
            <button className="Users" onClick={() => navigate("/UsersAdmin")}>
                Back
            </button>
        </div>
    );
};

export default Userdetails;