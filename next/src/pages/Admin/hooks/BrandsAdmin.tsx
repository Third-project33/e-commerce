import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import Image from 'next/image'
import '../styles/BrandsAdmin.css'; 


interface Brand {
    id: number;        
    name: string;
    logo: string;
    verified: number;
}
const BrandAdmin = () => {
    const router=useRouter()
    const [brands, setBrands] = useState<Brand[]>([]);

   const handledelete  = (id: number) => {
    axios.delete(`http://localhost:3001/brands/delete/${id}`)
        .then(() => {
            Swal.fire({
                title: 'Success!',
                text: 'Brand successfully deleted',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            window.location.reload();
        })
        .catch((err) => console.error("Error deleting brand:", err));
};
    // Fixed typing and logic
    const handleverify = (brand: Brand) => {
        const checkverify = brand.verified === 1 ? 0 : 1;
        axios.put(`http://localhost:3001/brands/update/${brand.id}`, { verified: checkverify })
            .then(() => {
                Swal.fire({
                    title: 'Success!',
                    text: `Brand verification status updated to ${checkverify === 1 ? 'verified' : 'unverified'}.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                router.push("/Admin");
            })
            .catch((err) => {
                console.error("Error updating brand verification status:", err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update brand verification status.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };
           

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get<Brand[]>("http://localhost:3001/brands/allbrands");
                setBrands(response.data);
            } catch (error) {
                console.error("Error fetching brands:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch brands',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchBrands();
    }, []);

    return (
        <div>
        <div className="admin-brand-grid-container">
            {brands.map((brand) => (
                    <div className="admin-brand-card" key={brand.id}>
                    
                        <div className="admin-logo-container">
                        <Image 
                                src={brand.logo}
                                alt={`${brand.name} logo`}
                                width={100} 
                                height={100}
                                className="admin-brand-logo"
                                onClick={() => router.push({
                                    pathname: "/adminbrandproducts",
                                    query: { brandId: brand.id }
                                })}
                                priority
                            />
                       
                        </div>
                    <h3 className="admin-brand-name">{brand.name}</h3>
                    
                    <div className="admin-button-container">
                        <button className="admin-brand-button admin-green-button"onClick={()=>handleverify(brand)} >Verify</button>
                        <button className="admin-brand-button admin-red-button" onClick={()=>handledelete(brand.id)}>Remove</button>
                    </div>
                </div>
            ))}
             <button className="Users" onClick={() => router.push ("/Admin")}> Back </button>
        </div>
        </div>
    );
};

export default BrandAdmin;



;