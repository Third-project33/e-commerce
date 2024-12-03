import React, { useState, useEffect } from "react"; // Import React and hooks for state and lifecycle management.
import axios from "axios"; // Import Axios for making HTTP requests.
import Sidebar from "./Sidebar"; // Import the Sidebar component.
import Swal from "sweetalert2"; // Import SweetAlert2 for creating pop-up alerts.
import { useRouter } from "next/router"; // Import the Next.js router for navigation.
import Navbar from "../navbar/navbar"; // Import the Navbar component.
import "./Productslist.css"; // Import the CSS file for styling.

interface Product {
  // Define the structure of a product object.
  id: number; // The unique ID of the product.
  title: string; // The name/title of the product.
  image: string; // The URL of the product image.
  price: number; // The price of the product.
  rarity: string; // The rarity level of the product.
  chains: string; // Any associated chains (e.g., category or tags).
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // State to store the list of products.
  const [error, setError] = useState<string | null>(null); // State to handle any error messages.
  const [filters, setFilters] = useState<Record<string, any>>({}); // State for managing filters.
  const [likedProducts, setLikedProducts] = useState<number[]>([]); // State to track IDs of liked products.
  const navigate = useRouter(); // A hook for navigation (useRouter is part of Next.js).

  const fetchProducts = async () => {
    // Function to fetch products based on filters.
    try {
      const { data } = await axios.get("http://localhost:3001/products", {
        params: filters, // Pass the current filters as query parameters.
      });
      setProducts(data); // Update the products state with the fetched data.
    } catch {
      setError("Failed to load products"); // Set an error message if the fetch fails.
    }
  };

  useEffect(() => {
    // React hook to fetch products whenever filters change.
    fetchProducts();
  }, [filters]); // Dependencies: this hook re-runs when `filters` changes.

  const handleFilterChange = (newFilters: Record<string, any>) => {
    // Update the filter criteria.
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters })); // Merge new filters with the current ones.
  };

  const handleLike = (productId: number) => {
    // Toggle the liked status of a product.
    setLikedProducts(
      (prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId) // Remove from liked list if already liked.
          : [...prev, productId] // Add to liked list if not liked yet.
    );
  };

  const handleOwner = async (id: number) => {
    // Increment the owner count of a product (e.g., a backend operation).
    try {
      const response = await axios.post(
        `http://localhost:3001/products/increment/${id}`
      );
      console.log(response.data.message); // Log success message to the console.
    } catch (error) {
      console.error("Error incrementing owner count:", error); // Log any errors.
    }
  };

  const handleAddToCart = async (productId: number) => {
    // Function to add a product to the cart.
    const token = localStorage.getItem("token"); // Check if the user is logged in using a token.
    if (!token) {
      const result = await Swal.fire({
        // Show a warning if the user is not logged in.
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to add products to the cart",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) navigate.push("/"); // Redirect to login page if the user clicks "Log In."
      return; // Exit the function.
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/cart/add",
        { productId }, // Send product ID to add to cart.
        {
          headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication.
        }
      );
      if (response.status === 200) {
        Swal.fire({
          // Show success message when added to cart.
          icon: "success",
          title: "Added to Cart",
          text: "Product successfully added to your cart",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch {
      Swal.fire({
        // Show error message if adding to cart fails.
        icon: "error",
        title: "Error",
        text: "An error occurred while adding to the cart",
      });
    }
  };

  const handleRarityChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    // Update filters when rarity is selected.
    handleFilterChange({ rarity: e.target.value });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    // Update filters when sorting is selected.
    handleFilterChange({ sort: e.target.value });

  if (error) return <div className="error">{error}</div>; // Show an error message if fetching products fails.

  return (
    <>
      <Navbar /> {/* Display the Navbar component. */}
      <div className="product-list-container">
        <div className="sidebar-container">
          {/* Sidebar: A component to display and apply filters */}
          <Sidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="content-section">
          {/* Header section to show product count and filter options */}
          <div className="header-bar">
            <div className="header-left">
              <div className="total-items">{products.length} items</div>
            </div>
            <div className="header-filters">
              {/* Dropdown for selecting rarity */}
              <select
                className="header-filter-button"
                onChange={handleRarityChange}
              >
                <option value="" className="text">
                  All Items
                </option>
                <option value="Secret Rare" className="text">
                  Secret Rare
                </option>
                <option value="Uncommon Rare" className="text">
                  Uncommon Rare
                </option>
                <option value="Ultra Rare" className="text">
                  Ultra Rare
                </option>
              </select>
              {/* Dropdown for sorting options */}
              <select
                className="header-filter-button"
                onChange={handleSortChange}
              >
                <option value="" className="text">
                  Sort By
                </option>
                <option value="price_asc" className="text">
                  Price: Low to High
                </option>
                <option value="price_desc" className="text">
                  Price: High to Low
                </option>
                <option value="newest" className="text">
                  Newest First
                </option>
              </select>
            </div>
          </div>
          <div className="product-grid">
            {/* Loop through products and display them as cards */}
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {/* Product image */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <div className="product-header">
                    <span
                      className={`rarity-badge ${product.rarity
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {product.rarity}
                    </span>
                    <span className="chains">{product.chains}</span>
                  </div>
                  <div className="product-title-price">
                    <h2 className="product-title">{product.title}</h2>
                    <span className="product-price">
                      {product.price.toLocaleString()} DT
                    </span>
                  </div>
                  <div className="product-footer">
                    <button
                      className={`like-button ${
                        likedProducts.includes(product.id) ? "liked" : ""
                      }`}
                      onClick={() => handleLike(product.id)}
                    >
                      {likedProducts.includes(product.id) ? "❤️" : "🤍"}
                    </button>
                    <button
                      className="buy-button"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList; // Export the ProductList component.
