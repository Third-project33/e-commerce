
// client/src/components/Admin/UsersAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Admin/UsersAdmin.css'; // Import the CSS file for styling

const UsersAdmin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/user/all"); // Adjust the endpoint as necessary
            setUsers(response.data);
            console.log(response.data); 
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/user/${id}`)
            .then(() => {
                Swal.fire({
                    title: 'Success!',
                    text: 'User successfully deleted',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchUsers();
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchUsers(); 
    }, []);

    return (
        <div className="user-grid-container">
            {users.map((user) => (
                <div className="user-card" key={user.id}>
                    <div className="admin-logo-container">
                   <img src={user.avatar} className='admin-brand-logo'></img>
                   </div>
                    <h3 className="user-name">{user.firstName}</h3>
                    <h3 className="user-name">{user.lastName}</h3>

                    <div className="button-container">
                        <button className="user-button green-button" onClick={()=>navigate("/userdetails",{ state: { userId: user.id } })}> More</button>
                        <button className="user-button red-button" onClick={() => handleDelete(user.id)}>Remove</button>
                    </div>
                </div>
            ))}
             <button className="Users" onClick={() => navigate("/Admin")}>
                Back
            </button>
        </div>
    );
};

export default UsersAdmin;