// components/Profile.tsx
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPlus, faEdit  , faTrash} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import "../Profile/Profile.css"
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import "../../app/globals.css"

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');

const defaultAvatar = 'https://res.cloudinary.com/dc9siq9ry/image/upload/v1733175640/wzyow7lupj7tjjo9klby.jpg'; 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const fullName = userData.name || decodedToken.name || 'Unknown';
        const unique = fullName.split(' ')[0].toLowerCase();
        setUser({
          id: decodedToken.id,
          name: fullName,
          username: unique,
          type: userData.type || 'user',
        });
        const savedAvatar = userData.avatar || localStorage.getItem(`userAvatar_${userData.id}`) || defaultAvatar;
        setAvatar(savedAvatar);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  const handleNameUpdate = () => {
    const [firstName, lastName] = newName.split(' ');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    axios.put('http://localhost:3001/user/update-name', {
      userId: userData.id,
      firstName,
      lastName,
    })
    .then(() => {
      const updatedUser = { ...userData, name: newName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    })
    .catch(err => {
      console.error('Error updating name:', err);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'speakeasy');
      formData.append('cloud_name', 'dc9siq9ry');
      axios.post('https://api.cloudinary.com/v1_1/dc9siq9ry/image/upload', formData)
        .then((data) => {
          const imageUrl = data.data.secure_url;
          const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
          axios.put('http://localhost:3001/user/update-avatar', { userId, avatar: imageUrl })
            .then(() => {
              const updatedUser = { ...user, avatar: imageUrl };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setAvatar(imageUrl);
            })
            .then(()=>{
              setTimeout(() => {
                window.location.reload()
              }, 50); 
            })
           
            .catch(err => {
              console.error('Error updating avatar:', err);
            });
        });
    }
  };

  useEffect(() => {
    const fetchPosts = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      axios.get(`http://localhost:3001/posts/user/${user.id}`)
        .then(response => {
          setPosts(response.data);
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    };

    if (user) {
      fetchPosts();
    }
  }, [user ]);

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }
  const handleDeletePost = (postId: number) => {
    Swal.fire({
      icon: 'warning',
      title: '<span style="color: red;">Are you sure?</span>', 
      html: "<span style='color: red;'>You won't be able to revert this!</span>", 
      background: 'rgba(255, 255, 258, 1)',  
      color: 'white',  
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonColor: 'red',  
      cancelButtonColor: '#3085d6',  
  
      customClass: {
        title: 'swal-title-error',
        confirmButton: 'swalpostConfirm',
        cancelButton: 'swalpostDelete'
      }
    })
    .then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/posts/deletePost/${postId}`)
          .then(() => {
            setPosts(posts.filter(post => post.id !== postId));
            Swal.fire(
              'Deleted!',
              'Your post has been deleted.',
              'success'
            );
          })
          .catch((error) => {
            console.error('Error deleting post:', error);
            Swal.fire(
              'Error!',
              'Something went wrong while deleting the post.',
              'error'
            );
          });
      }
    });
  };
  

  return (
    <div className="pageWrapper">
      <Navbar/> 
      <div className="profilePage">
        <div className="profileHeader">
          <div className="profilePicture">
            <img
              src={avatar || defaultAvatar} 
              alt="Profile Picture"
            />
          </div>
          <div className="uploadAvatarButton" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <FontAwesomeIcon icon={faCamera} />
          </div>
          <div className="profileActions">
            <div className="createPostButton" onClick={() => router.push('/Profile/Createpost')}>
              <FontAwesomeIcon icon={faPlus} /> Create Post
            </div>
            <div className="editProfileButton" onClick={() => setIsEditing(!isEditing)}>
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </div>
          </div>
        </div>

        <div className="profileDetails">
          {isEditing ? (
            <div className="editName">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button className="saveEditProfile" onClick={() => { handleNameUpdate()}}>Save Change</button>
            </div>
          ) : (
            <>
              <h1 style={{ color: "#ffffff" }}>{user.name}</h1>
              <p style={{ color: "#625c70" }}>@{user.username}</p>
              <p style={{ color: "#ffffff" }}>
                  "Exploring the intersection of fashion and technology, always looking for the next big trend."

              </p>
            </>
          )}
        </div>

        <div className="profilepostContent">
          <div className="sideImages">
            <div className="allPics" style={{ marginTop: "20px" }}>
              <div className="collection">
                <h2 style={{ color: "white", marginBottom: "10px" }}>Photos</h2>
                <div className="photoGrid">
                  <div className="photoItem">
                    <img alt="Photo 1" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732147116/kx6repm0wazx4n4gslqq.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 2" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732147134/woezvwj4ezrvlbghazqt.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 3" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732148871/u2wk3dacfpgbp2sbdo1j.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 4" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732148652/z5hvletnezlvnugrcyty.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 5" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732147176/jowusnhigmyabpcky2eb.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 6" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732147249/jbwlreucquta7wgunotl.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 7" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732148066/xohcecjgnlo6kgywpap6.jpg" />
                  </div>
                  <div className="photoItem">
                    <img alt="Photo 8" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732147297/kjjou1jyhihr4is2bpqj.jpg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="metaLook">
              <h2>Meta Look</h2>
              <img alt="Meta Look" src="https://res.cloudinary.com/dc9siq9ry/image/upload/v1732147731/ncikeqmudotwwulqxoub.jpg" />
              <div className="metaSliderContainer">
                <button className="metaSliderButton" id="minusButton">-</button>
                <input type="range" className="metaSlider" min="0" max="100" value="40" />
                <button className="metaSliderButton" id="plusButton">+</button>
              </div>
            </div>
          </div>

          <div className="createdPostes">
            <div className="postsSection">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="postContent">
                    <div className="postHeader">
                      <img
                        src={avatar || defaultAvatar}
                        alt="Profile"
                        className="CreatedPostAvatar"
                      />
                      
                      <div className="postInfo">
                        <h3 style={{ color: "#ffffff" }}>{user.name}</h3>
                      </div>
                      <div className="PosttrashIcon" style={{ cursor: 'pointer' }} onClick={()=>handleDeletePost(post.id)}>
                      <FontAwesomeIcon icon={faTrash} size="lg" color="red" />
                    </div>

                      
          
                    </div>
                    <div className="postContentWrapper">
                    <p style={{ color: "#ffffff" }}>{post.content}</p>
                    </div>
                    

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="CreatedPostImage"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No posts available.</p>
              )}
            </div>
          </div>
        </div>
        <input
          type="file"
          id="avatar-upload"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <Footer/>
    </div>
  );
};

export default Profile;



