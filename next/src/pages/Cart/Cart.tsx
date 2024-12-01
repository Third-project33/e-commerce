import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Cart.module.css";

interface Product {
  id: number;
  title: string;
  image: string;
  CartProducts: {
    priceAtPurchase: number;
    quantity: number;
  };
}

interface CartData {
  Products: Product[];
  totalItems: number;
  totalAmount: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:3000/cart/itemcart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.message || "Unable to load the cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleConfirmOrder = async () => {
    const result = await Swal.fire({
      title: "Confirm Order",
      text: "Are you sure you want to place this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm order",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:3000/cart/confirm-order",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: "success",
          title: "Order Confirmed!",
          text: "Check your email for order confirmation details.",
          timer: 2000,
          showConfirmButton: false,
        });

        setCart({
          Products: [],
          totalItems: 0,
          totalAmount: 0,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to confirm order",
        });
      }
    }
  };

  const handleRemoveItem = async (productId: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCart((prevCart) => {
          if (!prevCart) return null;
          const updatedProducts = prevCart.Products.filter(
            (element) => element.id !== productId
          );
          const totalItems = updatedProducts.reduce(
            (sum, el) => sum + el.CartProducts.quantity,
            0
          );
          const totalAmount = updatedProducts.reduce(
            (sum, elm) =>
              sum +
              elm.CartProducts.priceAtPurchase * elm.CartProducts.quantity,
            0
          );

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
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Unable to remove the product",
        });
      }
    }
  };

  const handleOwner = async (id: number) => {
    try {
      await axios.post(`http://localhost:3000/products/decrement/${id}`);
    } catch (error) {
      console.error("Error decrementing owner count:", error);
    }
  };

  if (error) return <div className={styles.cartError}>{error}</div>;
  if (!cart) return <div className={styles.cartLoading}>Loading...</div>;

  return (
    <div className={styles.cartContainer}>
      <h2>My Cart</h2>
      <div className={styles.cartItems}>
        {cart.Products.length === 0 ? (
          <div className={styles.cartEmpty}>Your cart is empty</div>
        ) : (
          cart.Products.map((product) => (
            <div key={product.id} className={styles.cartItem}>
              <img
                src={product.image}
                alt={product.title}
                className={styles.cartItemImage}
              />
              <div className={styles.cartItemDetails}>
                <h3>{product.title}</h3>
                <p className={styles.cartItemPrice}>
                  {product.CartProducts.priceAtPurchase} ETH
                </p>
                <p className={styles.cartItemQuantity}>
                  Quantity: {product.CartProducts.quantity}
                </p>
              </div>
              <button
                className={styles.removeItemButton}
                onClick={() => {
                  handleRemoveItem(product.id);
                  handleOwner(product.id);
                }}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>
      <div className={styles.cartSummary}>
        <p>Total Items: {cart.totalItems || 0}</p>
        <p>Total Amount: {cart.totalAmount || 0} ETH</p>
        <button
          className={styles.confirmOrderButton}
          onClick={handleConfirmOrder}
          disabled={!cart.Products || cart.Products.length === 0}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
