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
    const [newProduct, setNewProduct] = useState<{ title: string; image: string; price: number }>({ title: '', image: '', price: 0 });
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showAddProductForm, setShowAddProductForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            if (!brandId) return;
            
            setLoading(true);
            try {
                const response = await axios.get<Product[]>(`http://localhost:3001/products/${brandId}`);
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



    //=>  price update 

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
            await axios.put(`http://localhost:3001/products/${productId}`, { 
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
    //=> img update 
    const handleImageUpdate = async (productId: number): Promise<void> => {
        const { value: newImage } = await Swal.fire({
            title: 'Update Product Image',
            input: 'text',
            inputLabel: 'Enter the new image URL',
            inputPlaceholder: 'Image URL',
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
        });

        if (newImage) {
            try {
                await axios.put(`http://localhost:3001/products/${productId}`, { 
                    image: newImage 
                });
                Swal.fire('Success!', 'Image updated successfully', 'success');
                setRefresh(prev => !prev);
            } catch (error) {
                console.error("Error updating image:", error);
                Swal.fire('Error!', 'Failed to update image. Please try again.', 'error');
            }
        }
    };

    
   //=> add product too the brand 
    const handleAddProduct = async () => {
        if (!newProduct.title || !newProduct.image || newProduct.price <= 0) {
            Swal.fire({
                title: 'Invalid Input',
                text: 'Please fill in all fields correctly.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            await axios.post(`http://localhost:3001/products/create`, { 
                ...newProduct, 
                brandId 
            });
            Swal.fire('Success!', 'Product added successfully', 'success');
            setNewProduct({ title: '', image: '', price: 0 });
            setRefresh(!refresh);
            setShowAddProductForm(false);
        } catch (error) {
            console.error("Error adding product:", error);
            Swal.fire('Error!', 'Failed to add product', 'error');
        }
    };
 


     
    
    const handleBackButtonClick = () => {
        const currentUrl = router.asPath; // Get the current URL
        const targetUrl = "/Admin/hooks/BrandsAdmin"; // Define your target URL

        if (currentUrl !== targetUrl) {
            router.push(targetUrl); // Only navigate if the URLs are different
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }
   



    const filteredProducts = products.filter(product =>
        (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-product-grid-container">
            <h1 className="page-title">Manage Products for Brand</h1>
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <button 
                className="add-product-button" 
                onClick={() => setShowAddProductForm(prev => !prev)}
            >
                +
            </button>

            <div className={`add-product-form ${showAddProductForm ? 'show' : ''}`}>
                <h2>Add New Product</h2>
                <input
                    type="text"
                    placeholder="Product Title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                />
                <button onClick={handleAddProduct}>Add Product</button>
            </div>

            <div className="products-wrapper">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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
                            <button 
                                className="update-image-button"
                                onClick={() => handleImageUpdate(product.id)}
                            >
                                Update Image
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
            </div>
            
            <button 
                className="back-button" 
                onClick={handleBackButtonClick}
            >
                Back
            </button>
        </div>
    );
};

export default AdminBrandProducts;