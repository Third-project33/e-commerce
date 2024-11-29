// client/src/components/Admin/UsersAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import '../../Admin/styles/UsersAdmin.css';
import DefaultAvatar from '../hooks/DefaultAvatar';

// Define interfaces for type safety
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
}

const UsersAdmin = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const fetchUsers = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axios.get<User[]>("http://localhost:3000/user/all");
            setUsers(response.data);
            console.log(response.data); 
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch users',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number): void => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3000/user/${id}`)
                    .then(() => {
                        Swal.fire(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                        );
                        fetchUsers();
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire(
                            'Error!',
                            'Failed to delete user.',
                            'error'
                        );
                    });
            }
        });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Handle scroll event to show/hide scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchUsers(); 
    }, []);

    // Add this function to handle image errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src = '/images/default-avatar.png'; // Path to your default avatar
    };

    return (
        <div className="users-container">
            <div className="search-container">
                <input 
                    type="text"
                    className="search-input"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <div className="users-grid">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="user-card">
                                <div className="user-avatar-container">
                                    {user.avatar ? (
                                        <img 
                                            src={user.avatar}
                                            alt={`${user.firstName}'s avatar`}
                                            className="user-avatar"
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <DefaultAvatar name={`${user.firstName} ${user.lastName}`} />
                                    )}
                                </div>
                                
                                <div className="user-info">
                                    <h3 className="user-name">{`${user.firstName} ${user.lastName}`}</h3>
                                    <p className="user-email">{user.email}</p>
                                </div>
                                
                                <div className="user-actions">
                                    <button 
                                        className="action-button view-button"
                                        onClick={() => router.push(`/Admin/hooks/Userdetails?userId=${user.id}`)}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="action-button delete-button"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No users found</div>
                    )}
                </div>
            )}
            
            {showScrollTop && (
                <div className="scroll-top" onClick={scrollToTop}>
                    ↑
                </div>
            )}
        </div>
    );
};

export default UsersAdmin;