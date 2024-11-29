import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/Brandproducts.css';

const AdminBrandProducts = () => {
    const router=  useRouter()
  
    const { brandId } = router.query;
    const [products, setProducts] = useState<{
        id: number;
        title: string;
        image: string;
        name: string;
        price: number;
    }[]>([]);
    const [showDropdown, setShowDropdown] = useState<{
        [key: number]: boolean;
    }>({});
    const [newPrice, setNewPrice] = useState<string>(''); 
    const [refresh, setRefresh] = useState<boolean>(false);


    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            if (!brandId) return;
            try {
                const response = await axios.get<typeof products>(`http://localhost:3001/api/products/${brandId}`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [brandId,refresh]); 

    const handlePriceUpdate = async (productId: number): Promise<void> => {
        try {
            await axios.put(`http://localhost:3001/api/products/${productId}`, { 
                price: parseFloat(newPrice) 
            });
            
            setNewPrice('');
            setShowDropdown((prev) => ({ 
                ...prev, 
                [productId]: false 
            }));
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error updating price:", error);
        }
    };
    

    return (
        <div className="admin-product-grid-container">
            {products.map((product) => (
                <div className="admin-product-card" key={product.id}>
                    <h3 className="admin-product-name">{product.title}</h3>
                    <div className="admin-image-container">
                        <img src={product.image} alt={product.name} className="admin-product-image" />
                    </div>
                    <p className="admin-product-price">${product.price}</p>
                    <button onClick={() => setShowDropdown((prev) => ({ ...prev, [product.id]: !prev[product.id] }))}>
                        Update Price
                    </button>
                    {showDropdown[product.id] && ( 
                        <div className="price-update-dropdown">
                            <input 
                                type="number" 
                                value={newPrice} 
                                onChange={(e) => setNewPrice(e.target.value)} 
                                placeholder="Enter new price" 
                            />
                            <button onClick={() => handlePriceUpdate(product.id)}>Submit</button>
                        </div>
                    )}
                </div>
            ))}
            <button className="Users" onClick={() => router.push ("/Admin")}>
                Back
            </button>
        </div>
    );
};

export default AdminBrandProducts;