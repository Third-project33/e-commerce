import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import "./Productslist.css";
import LikedProducts from "../UserFavorites/LikedProducts";

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  rarity: string;
  chains: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const navigate = useRouter();
  let userId: any;

  if (global?.window !== undefined) {
    userId = JSON.parse(localStorage.getItem("user") || "{}").id;
  }

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/products", {
        params: filters,
      });
      setProducts(data);
    } catch {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const handleLike = async (productId: number) => {
    const isLiked = likedProducts.includes(productId);
    if (!isLiked) {
      try {
        await axios.post("http://localhost:3001/favorite/add", {
          userId: Number(userId),
          productId: productId,
        });
        setLikedProducts((prev) => [...prev, productId]);
        Swal.fire({
          icon: "success",
          title: "Product Liked",
          text: "You have liked this product!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
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
    }
  };

  const handleOwner = async (id: number) => {
    try {
      await axios.post(`http://localhost:3001/products/increment/${id}`);
    } catch {
      console.error("Error incrementing owner count");
    }
  };

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
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleRarityChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    handleFilterChange({ rarity: e.target.value });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    handleFilterChange({ sort: e.target.value });

  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div>
        <Navbar />
        <div className="product-list-container">
          <div className="sidebar-container">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="content-section">
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
      </div>
      <Footer />
    </>
  );
};

export default ProductList;
