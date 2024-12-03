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

const LikedProducts: React.FC<LikedProductsProps> = ({  }) => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]); // State to hold liked products
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  let id: any  

  if (global?.window !== undefined) {

  //  id  = JSON.parse(localStorage.getItem('user') || '{}').id;
id = 1
  }
  console.log(id, "hiiiiiiiiiiiiiiii");
  // Fetch liked products when the component mounts
  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/favorite/Favourite/${id}`);
        console.log(data , "data")
        setLikedProducts(data); // Set the liked products
      } catch (error) {
        console.error("Error fetching liked products:", error);
        setError("Failed to load liked products.");
      }
    };

    fetchLikedProducts();
  }, [id]);

  // Function to delete a liked product
  // Function to delete a liked product
  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(`http://localhost:3001/favorite/delete/${productId}`);
      setLikedProducts((prevLikedProducts) =>
        prevLikedProducts.filter((product) => product.id !== productId)
      ); // Update the likedProducts state
      Swal.fire({
        icon: "success",
        title: "Product Removed",
        text: "Product has been removed from your favorites.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting liked product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove product from favorites.",
      });
    }
  };


  return (
    <>
      <Navbar /> {/* Optional, if you want navigation */}
      <div className="liked-products-container">
        <h2>Your Favorite Products</h2>
        {error && <p className="error-message">{error}</p>}
        {likedProducts.length > 0 ? (
          <div className="liked-products-grid">
            {likedProducts.map((product) => (
              <div key={product.id} className="liked-product-card">
                <img src={product.image} alt={product.title} />
                <h3>{product.title}</h3>
                <p>{product.price.toLocaleString()} DT</p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite products yet. Add some from the product list!</p>
        )}
      </div>
      <Footer /> {/* Optional, if you want a footer */}
    </>
  );
  
};

export default LikedProducts;