import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2"; // A library for showing pop-up alerts.
import { useRouter } from "next/router"; //  A hook from Next.js for navigation.

import "./Productslist.css";

// Product Interface: Defines the structure of a product object, specifying the types of its properties
interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  rarity: string;
  chains: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Stores the list of products.
  const [error, setError] = useState<string | null>(null); // Stores any error messages.
  const [filters, setFilters] = useState<Record<string, any>>({}); // Stores the current filter criteria
  const [likedProducts, setLikedProducts] = useState<number[]>([]); // Stores the IDs of liked products.
  const navigate = useRouter();

  const fetchProducts = async () => {
    try {
      // Fetches products from the server using the current filters
      const { data } = await axios.get("http://localhost:3001/products", {
        params: filters,
      });
      //Updates the products state with the fetched data
      setProducts(data);
    } catch {
      setError("Failed to load products");
    }
  };
  //useEffect Hook: Runs fetchProducts whenever
  //the filters change, ensuring the product list is updated.
  useEffect(() => {
    fetchProducts();
  }, [filters]); // Re-fetch products when filters change

  // Updates the filters based on user input.
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      return updatedFilters;
    });
  };

  // Toggles the liked status of a product.
  const handleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  //  Sends a request to increment the owner count of a product.
  const handleOwner = async (id: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/products/increment/${id}`
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error incrementing owner count:", error);
    }
  };

  // Adds a product to the cart. If the user is not logged in, it prompts them to log in.

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in to add products to the cart",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) navigate.push("/");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/cart/add",
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart",
          text: "Product successfully added to your cart",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while adding to the cart",
      });
    }
  };
  //  Updates the filter based on the selected rarity.
  const handleRarityChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    handleFilterChange({ rarity: e.target.value });

  // Updates the filter based on the selected sort option.
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    handleFilterChange({ sort: e.target.value });

  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="product-list-container">
        {/* Sidebar: Contains filters for the product list. */}
        <div className="sidebar-container">
          <Sidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="content-section">
          {/* Header Bar: Displays the total number of items and filter options. */}
          <div className="header-bar">
            <div className="header-left">
              <div className="total-items">{products.length} items</div>
            </div>
            <div className="header-filters">
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
            {products.map((product) => (
              <div key={product.id} className="product-card">
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
                      {product.price.toLocaleString()} ETH
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
                      onClick={() => {
                        handleAddToCart(product.id);
                      }}
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

export default ProductList;
