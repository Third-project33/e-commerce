// client/src/components/Admin/UsersAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import '../../Admin/styles/UsersAdmin.css';


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

    const handleBan = (id: number): void => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, ban it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://localhost:3000/user/ban/${id}`)
                    .then(() => {
                        Swal.fire('Banned!', 'User has been banned.', 'success');
                        fetchUsers();
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error!', 'Failed to ban user.', 'error');
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Handle image errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src = '/images/default-avatar.png'; // Ensure this path is correct
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
                                    <img 
                                        src={user.avatar || '/images/default-avatar.png'} // Use default if avatar is empty
                                        alt={`${user.firstName}'s avatar`} 
                                        className="user-avatar" 
                                        onError={handleImageError} 
                                    />
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
                                        className="action-button ban-button"
                                        onClick={() => handleBan(user.id)}
                                    >
                                        Ban
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