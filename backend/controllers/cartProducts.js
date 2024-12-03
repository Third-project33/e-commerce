const db = require("../database");
//jwt: This is a library for working with JSON Web Tokens, used here for verifying user authentication.

const jwt = require("jsonwebtoken");
// decodeToken Function: This function extracts and verifies the JWT from the request headers.
function decodeToken(req, res) {
  /*Token Extraction: It extracts the token from the Authorization header,
   expecting it in the format Bearer <token>.*/
  const token = req.headers.authorization?.split(" ")[1];
  /*Token Verification: It verifies the token using a secret key ('ascefbth,plnihcdxuwy'). 
  If the token is invalid, it responds with a 401 status code and an "Invalid token" message.*/
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    return jwt.verify(token, "ascefbth,plnihcdxuwy");
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// addToCart Function: This function adds a product to the user's cart.
exports.addToCart = (req, res) => {
  // Token Decoding: It decodes the token to get the user's ID. If decoding fails,
  // the function exits early.
  const decoded = decodeToken(req, res);
  if (!decoded) return;

  const { productId } = req.body;

  db.products // Product Lookup: Searches for the product in the database using the productId.
    .findOne({ where: { id: productId } })
    .then((product) => {
      // console.log(product);

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      db.cart // Cart Lookup/Create: Finds or creates a cart for the user.

        .findOrCreate({
          where: { UserId: decoded.id || decoded.uid },
          defaults: { totalItems: 0, totalAmount: 0 },
        })
        .then(([cart]) => {
          console.log(cart.id, "cart");

          db.CartProducts.findOrCreate({
            where: { cartId: cart.id, ProductId: productId },
            defaults: { quantity: 1, priceAtPurchase: product.price },
          }).then(([cartProduct, created]) => {
            /*Update Quantities: If the product is already in the cart, 
            it increments the quantity. It also updates the total items and total amount in the
             cart.*/
            if (!created) cartProduct.quantity++;
            cart.totalItems++;
            cart.totalAmount =
              parseFloat(cart.totalAmount) + parseFloat(product.price);
            // Save Changes: Saves the updated cartProduct and cart to the database.
            cartProduct.save();
            cart.save();
            res.status(200).json({ message: "Product added to cart" });
          });
        });
    })
    .catch(
      (error) => console.log(error)

      // res.status(500).json({ message: "Error adding product to cart", error })
    );
};

// removeFromCart Function: This function removes a product from the user's cart.
exports.removeFromCart = (req, res) => {
  const decoded = decodeToken(req, res);
  if (!decoded) return;

  const { productId } = req.params;

  db.cart // Cart Lookup: Searches for the user's cart in the database.
    .findOne({ where: { UserId: decoded.id } })
    .then((cart) => {
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      db.CartProducts.findOne({
        // Product Lookup: Finds the product in the database to get the price.
        where: { CartId: cart.id, ProductId: productId },
      }).then((cartProduct) => {
        if (!cartProduct)
          // Product Not Found in Cart: If the product isn't in the cart, it responds with a 404 status code.
          return res.status(404).json({ message: "Product not found in cart" });

        db.products // Product Lookup: Finds the product in the database to get the price.
          .findOne({ where: { id: productId } })
          .then((product) => {
            // Update Quantities: Sets the product quantity to 0,
            //updates the total items and total amount in the cart.
            const totalPrice = cartProduct.quantity * parseFloat(product.price);
            cartProduct.quantity = 0;
            cart.totalItems -= cartProduct.quantity;
            cart.totalAmount =
              cart.totalItems === 0
                ? 0
                : parseFloat(cart.totalAmount) - totalPrice;
            cart.save();
            res.status(200).json({ message: "Product removed from cart" });
          });
      });
    })
    .catch(() =>
      res.status(500).json({ message: "Error removing product from cart" })
    );
};

/*Summary
This file provides functionality to add and remove products from a user's cart.
 It uses JWT for user authentication, interacts with the database to manage cart and product data,
  and handles various scenarios like missing products or carts. The functions ensure that the cart's 
  total items and amount are accurately updated with each operation. */
