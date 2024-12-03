import React, { useState, useEffect } from "react";
// Import React and hooks: useState (to manage state) and useEffect (to handle side effects like API calls).

import axios from "axios";
// Import Axios library for making HTTP requests.

import Swal from "sweetalert2";
// Import SweetAlert2 library for showing customizable pop-ups and alerts.

import "../Cart/Cart.css";
// Import the CSS file for styling the cart component.

import Navbar from "../navbar/navbar";
// Import the Navbar component to display the navigation bar in this component.

interface Product {
  id: number;
  title: string;
  image: string;
  CartProducts: {
    priceAtPurchase: number;
    quantity: number;
  };
}
// Define a TypeScript interface for a Product, which includes its ID, title, image, and nested CartProducts object with price and quantity.

interface CartData {
  Products: Product[];
  totalItems: number;
  totalAmount: number;
}
// Define a TypeScript interface for the entire CartData, containing an array of Products, total items, and total amount.

const Cart: React.FC = () => {
  // Define the Cart component using React's Functional Component (FC) type.

  const [cart, setCart] = useState<CartData | null>(null);
  // Declare a state variable `cart` to store cart data, initialized as `null`.

  const [error, setError] = useState<string | null>(null);
  // Declare a state variable `error` to store error messages, initialized as `null`.

  const fetchCart = async () => {
    // Define an async function to fetch cart data from the backend.
    try {
      const token = localStorage.getItem("token");
      // Get the authentication token from local storage.
      if (!token) throw new Error("No token found");
      // If the token doesn't exist, throw an error.

      const response = await axios.get("http://localhost:3001/cart/itemcart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Make a GET request to the backend to fetch cart data with the token in the headers.
      setCart(response.data);
      // Update the cart state with the fetched data.
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.message || "Unable to load the cart");
      // If there's an error, set the error message.
    }
  };

  useEffect(() => {
    fetchCart();
    // Call `fetchCart` when the component loads for the first time.
  }, []);
  // Pass an empty dependency array to ensure this effect runs only once after the initial render.

  const handleConfirmOrder = async () => {
    // Define an async function to handle order confirmation.
    const result = await Swal.fire({
      title: "Confirm Order",
      text: "Are you sure you want to place this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm order",
      cancelButtonText: "Cancel",
    });
    // Show a confirmation pop-up using SweetAlert2.

    if (result.isConfirmed) {
      // If the user confirms the order:
      try {
        const token = localStorage.getItem("token");
        // Get the authentication token from local storage.

        await axios.post(
          "http://localhost:3001/cart/confirm-order",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Send a POST request to confirm the order.

        Swal.fire({
          icon: "success",
          title: "Order Confirmed!",
          text: "Check your email for order confirmation details.",
          timer: 2000,
          showConfirmButton: false,
        });
        // Show a success message.

        setCart({ Products: [], totalItems: 0, totalAmount: 0 });
        // Clear the cart after confirming the order.
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to confirm order",
        });
        // Show an error message if the order confirmation fails.
      }
    }
  };

  const handleRemoveItem = async (productId: number) => {
    // Define an async function to handle item removal from the cart.
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    });
    // Show a confirmation pop-up.

    if (confirm.isConfirmed) {
      // If the user confirms removal:
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Send a DELETE request to remove the product.

        setCart((prevCart) => {
          // Update the cart state.
          if (!prevCart) return null;
          const updatedProducts = prevCart.Products.filter(
            (element) => element.id !== productId
          );
          // Remove the product from the array.
          const totalItems = updatedProducts.reduce(
            (sum, el) => sum + el.CartProducts.quantity,
            0
          );
          // Recalculate the total number of items.

          const totalAmount = updatedProducts.reduce(
            (sum, elm) =>
              sum +
              elm.CartProducts.priceAtPurchase * elm.CartProducts.quantity,
            0
          );
          // Recalculate the total amount.

          return {
            ...prevCart,
            Products: updatedProducts,
            totalItems,
            totalAmount,
          };
        });

        Swal.fire({
          icon: "success",
          title: "Product Removed",
          timer: 1500,
          showConfirmButton: false,
        });
        // Show a success message after removal.
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Unable to remove the product",
        });
        // Show an error message if removal fails.
      }
    }
  };

  const handleOwner = async (id: number) => {
    // Define an async function to decrement the owner's product count.
    try {
      await axios.post(`http://localhost:3001/products/decrement/${id}`);
      // Send a POST request to decrement.
    } catch (error) {
      console.error("Error decrementing owner count:", error);
      // Log any error.
    }
  };

  if (error) return <div className="cart-error">{error}</div>;
  // Show the error message if there's an error.

  if (!cart) return <div className="cart-loading">Loading...</div>;
  // Show a loading message until the cart data is fetched.

  console.log("cart", cart);
  // Log the cart data to the console for debugging.

  return (
    <>
      <Navbar />
      // Display the navigation bar.
      <div className="cart-container">
        <h2>My Cart</h2>
        <div className="cart-items">
          {cart.Products.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            cart.Products.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={product.image}
                  alt={product.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{product.title}</h3>
                  <p className="cart-item-price">
                    {product.CartProducts.priceAtPurchase} DT
                  </p>
                  <p className="cart-item-quantity">
                    Quantity: {product.CartProducts.quantity}
                  </p>
                </div>
                <button
                  className="remove-item-button"
                  onClick={() => {
                    handleRemoveItem(product.id);
                  }}
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <p>Total Items: {cart.totalItems || 0}</p>
          <p>Total Amount: {cart.totalAmount || 0} DT</p>
          <button
            className="confirm-order-button"
            onClick={() => handleConfirmOrder()}
            disabled={!cart.Products || cart.Products.length === 0}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
// Export the Cart component for use in other parts of the application.
