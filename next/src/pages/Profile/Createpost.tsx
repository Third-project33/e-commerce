import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Profile/Createpost.css';

const CreatePost = () => {
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<string | null>('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const decodedToken: { id: string } = jwtDecode(token);
    const postData = {
      content,
      image,
      userId: decodedToken.id,
    };

    axios
      .post('http://localhost:3001/posts/create', postData)
      .then(() => {
        router.push('/Profile/Profile');
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'speakeasy');
      data.append('cloud_name', 'dc9siq9ry');
      axios.post('https://api.cloudinary.com/v1_1/dc9siq9ry/image/upload', data)
        .then((res) => {
          setImage(res.data.secure_url);
          console.log(res.data.secure_url);
          
        })
        .catch((err) => {
          console.error('Error uploading image:', err);
        });
    }
  };

  return (
    <div className="CreatedPostBackground">
      <div className="CreatedPostWrapper">
        <div className="CreatedPostForm">
          <h2>Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
              className="CreatedPostArea"
            />
            <div className="CreatedImageSection">
              <input
                type="file"
                id="post-image"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                className="CreatedImageSelector"
              />
              <div 
                className="CreatedImageAdd" 
                onClick={() => document.getElementById('post-image')?.click()}
              >
                <i className="fas fa-image"></i> Add Image
              </div>
              {image && <img src={image} alt="Preview" className="CreatedImagePreview" />}
            </div>
            <div className="CreatedPostSubmit" onClick={handleSubmit}>Post</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;