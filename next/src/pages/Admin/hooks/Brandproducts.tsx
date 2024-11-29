import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import '../../Admin/styles/Brandproducts.css';

interface Product {
    id: number;
    title: string;
    image: string;
    name: string;
    price: number;
}

const AdminBrandProducts = () => {
    const router = useRouter();
    const { brandId } = router.query;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState<{[key: number]: boolean}>({});
    const [newPrice, setNewPrice] = useState<string>('');
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            if (!brandId) return;
            
            setLoading(true);
            try {
                const response = await axios.get<Product[]>(`http://localhost:3000/api/products/${brandId}`);
                console.log('Fetched products:', response.data);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch products',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [brandId, refresh]);

    const handlePriceUpdate = async (productId: number): Promise<void> => {
        if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
            Swal.fire({
                title: 'Invalid Price',
                text: 'Please enter a valid price greater than 0',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            console.log('Updating price for product:', productId, 'New price:', newPrice);
            await axios.put(`http://localhost:3000/api/products/${productId}`, { 
                price: Number(newPrice) 
            });
            
            Swal.fire({
                title: 'Success!',
                text: 'Price updated successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setNewPrice('');
            setShowDropdown((prev) => ({ ...prev, [productId]: false }));
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error updating price:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update price',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-product-grid-container">

            {products.length > 0 ? (
                products.map((product) => (
                    <div className="admin-product-card" key={product.id}>
                        <h3 className="admin-product-name">{product.title}</h3>
                        <div className="admin-image-container">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="admin-product-image"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/default-product.png';
                                }}

     
                            />
                        </div>
                        <p className="admin-product-price">
                            ${Number(product.price).toFixed(2)}
                        </p>
                        <button 
                            className="update-price-button"
                            onClick={() => setShowDropdown((prev) => ({ 
                                ...prev, 
                                [product.id]: !prev[product.id] 
                            }))}
                        >
                            Update Price
                        </button>
                        {showDropdown[product.id] && (
                            <div className="price-update-dropdown">
                                <input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    placeholder="Enter new price"
                                    className="price-input"
                                />
                                <button 
                                    className="submit-button"
                                    onClick={() => handlePriceUpdate(product.id)}
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="no-products">
                    <h2>No products found for this brand</h2>
                </div>
            )}
            
            <button 
                className="back-button" 
                onClick={() => router.push("/Admin/hooks/Admin")}
            >
                Back
            </button>
        </div>
    );
};

export default AdminBrandProducts;