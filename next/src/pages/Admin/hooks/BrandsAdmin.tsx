import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import '../../Admin/styles/BrandsAdmin.css';

interface Brand {
    id: number;
    name: string;
    logo: string;
    verified: number;
}

const BrandAdmin: React.FC = () => {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleDelete = async (id: number): Promise<void> => {
        try {
            await axios.delete(`http://localhost:3000/brands/delete/${id}`);
            Swal.fire({
                title: 'Success!',
                text: 'Brand successfully deleted',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            // Refresh brands instead of page reload
            fetchBrands();
        } catch (error) {
            console.error("Error deleting brand:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete brand',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleVerify = async (brand: Brand): Promise<void> => {
        const checkVerify = brand.verified === 1 ? 0 : 1;
        try {
            await axios.put(`http://localhost:3000/brands/update/${brand.id}`, { 
                verified: checkVerify 
            });
            
            Swal.fire({
                title: 'Success!',
                text: `Brand verification status updated to ${checkVerify === 1 ? 'verified' : 'unverified'}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            router.push("/Admin/hooks/Admin");
        } catch (error) {
            console.error("Error updating brand verification status:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update brand verification status.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const fetchBrands = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axios.get<Brand[]>("http://localhost:3000/brands/allbrands");
            setBrands(response.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch brands',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src = '/images/default-brand-logo.png'; // Path to your default brand logo
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-brand-container">
            <div className="admin-brand-grid-container">
                {brands.map((brand) => (
                    <div className="admin-brand-card" key={brand.id}>
                        <div className="admin-logo-container">
                            <img 
                                src={brand.logo || '/images/default-brand-logo.png'}
                                alt={`${brand.name} logo`} 
                                className="admin-brand-logo"
                                onError={handleImageError}
                                onClick={() => router.push({
                                    pathname: "/Admin/hooks/Brandproducts",
                                    query: { brandId: brand.id }
                                })}
                            />
                        </div>
                        <h3 className="admin-brand-name">{brand.name}</h3>
                        <div className="admin-button-container">
                            <button 
                                className={`admin-brand-button ${brand.verified === 1 ? 'admin-red-button' : 'admin-green-button'}`}
                                onClick={() => handleVerify(brand)}
                            >
                                {brand.verified === 1 ? 'Unverify' : 'Verify'}
                            </button>
                            <button 
                                className="admin-brand-button admin-red-button"
                                onClick={() => handleDelete(brand.id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                className="back-button" 
                onClick={() => router.push("/Admin/hooks/Admin")}
            >
                Back
            </button>
        </div>
    );
};

export default BrandAdmin;



;