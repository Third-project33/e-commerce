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
    rarity: string;
    collection: string;
}

const AdminBrandProducts = () => {
    const router = useRouter();
    const { brandId } = router.query;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState<{[key: number]: boolean}>({});
    const [newPrice, setNewPrice] = useState<string>('');
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

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

    //=> Add product using SweetAlert modal
    const handleAddProduct = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add New Product',
            html: `
                <input id="title" class="swal2-input" placeholder="Product Title">
                <input id="image" class="swal2-input" placeholder="Image URL">
                <input id="price" type="number" class="swal2-input" placeholder="Price">
                <input id="rarity" class="swal2-input" placeholder="Rarity">
                <input id="collection" class="swal2-input" placeholder="Collection">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: (document.getElementById('title') as HTMLInputElement).value,
                    image: (document.getElementById('image') as HTMLInputElement).value,
                    price: Number((document.getElementById('price') as HTMLInputElement).value),
                    rarity: (document.getElementById('rarity') as HTMLInputElement).value,
                    collection: (document.getElementById('collection') as HTMLInputElement).value,
                };
            },
            showCancelButton: true,
            confirmButtonText: 'Add Product',
            cancelButtonText: 'Cancel',
        });

        if (formValues) {
            const { title, image, price, rarity, collection } = formValues;

            if (!title || !image || price <= 0 || !rarity || !collection || !brandId) {
                Swal.fire({
                    title: 'Invalid Input',
                    text: 'Please fill in all fields correctly.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            try {
                console.log('Adding product with payload:', { title, image, price, rarity, collection, brandId });
                const response = await axios.post(`http://localhost:3001/products/create`, { 
                    title, 
                    image, 
                    price, 
                    rarity, 
                    collection, 
                    brandId 
                });

                if (response.status === 201) {
                    Swal.fire('Success!', 'Product added successfully', 'success');
                    setRefresh(!refresh); // Refresh the product list
                }
            } catch (error) {
                console.error("Error adding product:", error.response ? error.response.data : error.message);
                Swal.fire('Error!', 'Failed to add product: ' + (error.response ? error.response.data.message : error.message), 'error');
            }
        }
    };

    //=> Price update
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

    //=> Image update
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
                const response = await axios.put(`http://localhost:3001/products/${productId}`, { 
                    image: newImage 
                });
                if (response.status === 200) {
                    Swal.fire('Success!', 'Image updated successfully', 'success');
                    setRefresh(prev => !prev); // Refresh the product list
                }
            } catch (error) {
                console.error("Error updating image:", error);
                Swal.fire('Error!', 'Failed to update image. Please try again.', 'error');
            }
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
                onClick={handleAddProduct} // Call the SweetAlert function here
            >
                +
            </button>


            <button 
            className="back-button" 
            onClick={handleBackButtonClick}
        >
           ←
        </button>

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
            
           
        </div>
    );
};

export default AdminBrandProducts;