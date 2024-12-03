import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for making API calls
import Swal from "sweetalert2"; // A library for showing pop-up alerts.
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  rarity: string;
  chains: string;
}

interface LikedProductsProps {
  userId: number; // User ID to fetch liked products
}

const LikedProducts: React.FC<LikedProductsProps> = ({ userId }) => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]); // State to hold liked products
  const [error, setError] = useState<string | null>(null); // State to hold error messages

  // Fetch liked products when the component mounts
  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/favorites/${userId}`);
        setLikedProducts(data); // Set the liked products
      } catch (error) {
        console.error("Error fetching liked products:", error);
        setError("Failed to load liked products.");
      }
    };

    fetchLikedProducts();
  }, [userId]);

  // Function to delete a liked product
  const handleDelete = async (productId: number) => {
    try {
      await axios.delete("http://localhost:3001/favorites/delete", {
        data: {
          userId: userId,
          productId: productId,
        },
      });
      // Remove the deleted product from the state
      setLikedProducts((prev) => prev.filter((product) => product.id !== productId));
      Swal.fire({
        icon: "success",
        title: "Product Unliked",
        text: "You have unliked this product!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting liked product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete liked product.",
      });
    }
  };

  return (
    <>
    <Navbar />
    <div className="liked-products-container">
      <h2>Liked Products</h2>
      {error && <p className="error">{error}</p>}
      {likedProducts.length === 0 ? (
        <p>No liked products found.</p>
      ) : (
        likedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h2 className="product-title">{product.title}</h2>
              <span className="product-price">
                {product.price.toLocaleString()} DT
              </span>
              <button
                className="delete-button"
                onClick={() => handleDelete(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    <Footer />
    </>
  );
};

export default LikedProducts;