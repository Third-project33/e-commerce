import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import '../../Admin/styles/Userdetails.css'

interface User {
    id: number;
    firstName: string;
    email: string;
    avatar?: string;
}

interface Post {
    id: number;
    content: string;
    image: string;
}
///=> Interfaces in TypeScript are used to define the shape or structure of objects. They help
//=>  catch errors during development and provide better code documentation

const Userdetails = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userposts, setUserposts] = useState<Post[]>([]);
  
  //=> get userid from router.query
    const { userId } = router.query;

    useEffect(() => {
        if (!userId) {
            console.error("No userId found in query params. Redirecting...");
            router.push("/Admin/hooks/UsersAdmin");
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
    }, [userId, router]);

    return (
        <div className='Userdetails'>
        <div className="Userdetails profile-container">
            <div className="Userdetails profile-header">
                <div className="Userdetails profile-avatar">
                    {user && user.avatar ? (
                      <img 
                      src={user.avatar} 
                      alt="Profile" 
                      onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
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
            <button className="Users" onClick={() => router.push ("/Admin/hooks/UsersAdmin")}>
                Back
            </button>
        </div>
        </div>
    );
};

export default Userdetails;