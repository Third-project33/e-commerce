import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2"; // A library for showing pop-up alerts.
import { useRouter } from "next/router"; // A hook from Next.js for navigation.
import Navbar from "../navbar/navbar";
import "./Productslist.css";
import LikedProducts from "../UserFavorites/LikedProducts"; // Import the LikedProducts component

// Product Interface: Defines the structure of a product object, specifying the types of its properties
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
  const [products, setProducts] = useState<Product[]>([]); // Stores the list of products.
  const [error, setError] = useState<string | null>(null); // Stores any error messages.
  const [filters, setFilters] = useState<Record<string, any>>({}); // Stores the current filter criteria
  const [likedProducts, setLikedProducts] = useState<number[]>([]); // Stores the IDs of liked products.
  const navigate = useRouter();
  const userId = localStorage.getItem("userId"); // Fetch user ID from local storage

  const fetchProducts = async () => {
    // Function to fetch products based on filters.
    try {
      const { data } = await axios.get("http://localhost:3001/products", {
        params: filters, // Pass the current filters as query parameters.
      });
      // Updates the products state with the fetched data
      setProducts(data);
    } catch {
      setError("Failed to load products"); // Set an error message if the fetch fails.
    }
  };



  useEffect(() => {
    // React hook to fetch products whenever filters change.
    fetchProducts();
  }, [filters]); // Re-fetch products when filters change

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      return updatedFilters;
    });
  };


  // Adds a product to the favorites in the database.
  const handleLike = async (productId: number) => {
    const isLiked = likedProducts.includes(productId);
    
    if (!isLiked) {
      try {
        // Call the addFavourite function
        await axios.post("http://localhost:3001/favorites/add", {
          userId: Number(userId), // Replace with the actual user ID
          productId: productId,
        });
        setLikedProducts((prev) => [...prev, productId]); // Update local state
        Swal.fire({
          icon: "success",
          title: "Product Liked",
          text: "You have liked this product!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error adding product to favorites:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add product to favorites.",
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Already Liked",
        text: "You have already liked this product.",
      });


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

  // Adds a product to the cart. If the user is not logged in, it prompts them to log in.
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

  // Updates the filter based on the selected rarity.
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
          {/* Header Bar: Displays the total number of items and filter options. */}
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
          {/* Product Grid: Displays each product in a card format
           with an image, title, price, and buttons to like or buy the product. */}
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
      {/* Optionally, you can include the LikedProducts component here */}
      {userId && <LikedProducts userId={Number(userId)} />}
    </>
  );
};

export default ProductList;

