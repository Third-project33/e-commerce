// This imports the database connection and models, allowing the function to interact with the database.
const db = require("../database/index");
// This is a library for working with JSON Web Tokens, used here for verifying user authentication.
const jwt = require("jsonwebtoken");

// getCart Function: This function handles HTTP requests to retrieve a user's cart.
const getCart = (req, res) => {
  /*Token Extraction: It extracts the token from the Authorization header of the request.
     The token is expected to be in the format Bearer <token>. */
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  /* Token Verification: The token is verified using a secret key ('ascefbth,plnihcdxuwy').
 If the token is valid, it decodes the token to extract the userId.*/
  const decoded = jwt.verify(token, "ascefbth,plnihcdxuwy");
  const userId = decoded.id;

  db.cart
    .findOne({
      where: { UserId: userId }, // Filters the cart by the user's ID.
      include: [
        // Joins
        {
          model: db.products, // Joins the products model to include product details in the response.
          attributes: ["id", "title", "price", "image"], // Specifies which product attributes to include (id, title, price, image).
          through: {
            // From the join table
            attributes: ["quantity", "priceAtPurchase"], // Specifies attributes from the join table (quantity, priceAtPurchase)
            as: "CartProducts", //  and aliases them as CartProducts.
          },
        },
      ],
    })
    // Promise Handling:
    .then((cart) => {
      if (!cart) {
        return res.status(200).json({
          totalItems: 0,
          totalAmount: 0,
          Products: [],
        });
      }
      res.status(200).json(cart);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error retrieving cart" });
    });
};

module.exports = { getCart };

/*Summary
The getCart function is a controller function that retrieves a user's cart from the database. 
It uses a JSON Web Token to authenticate the user, queries the database for the user's cart, 
and returns the cart details, including product information and quantities. If the user is not
 authenticated or an error occurs, it responds with appropriate error messages. */
