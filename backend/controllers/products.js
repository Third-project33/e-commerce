const db = require("../database/index");
const { Op } = require("sequelize");
const { products } = require("../database/index");

const getProductbybrand = async (req, res) => {
  const brandId = req.params.brandId; // Get the brand ID from the request parameters

  try {
    const products = await db.products.findAll({
      where: { brandId }, // Filter products by the specified brand ID
      include: [
        {
          model: db.brands,
          attributes: ["id", "name"], // Include brand details if needed
        },
      ],
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this brand." });
    }

    res.json(products); // Send the products as a JSON response
  } catch (error) {
    console.error("Error fetching products by brand ID:", error);
    res.status(500).send("Failed to fetch products");
  }
};
// safsaf
/* The getFilteredProducts function processes HTTP requests to fetch products that match specific
 filter criteria, such as category, price range, rarity, status, and whether they are on sale. 
 It also allows sorting the results by price or creation date. */
const getFilteredProducts = (req, res) => {
  const { category, priceRange, rarity, status, onSale, sort } = req.query;

  // whereClause: An object used to build conditions for filtering products in the database.
  const whereClause = {};

  // orderClause: An array used to specify the sorting order of the results.
  const orderClause = [];

  // Category Filter: If a category is specified, it adds a condition to filter products by their collection.
  if (category) {
    whereClause.collection = category;
  }

  // Rarity Filter: If rarity is specified, it filters products by their rarity.
  if (rarity) {
    whereClause.rarity = rarity;
  }

  // Status Filter: If status is specified, it filters products by their status.
  if (status) {
    whereClause.status = status;
  }

  // On Sale Filter: If onSale is 'true', it filters products that are on sale.
  if (onSale === "true") {
    whereClause.onSale = true;
  }

  //Price Range Filter: If priceRange is specified, it splits the range into minPrice and maxPrice.
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    /*Minimum Price: If minPrice is a valid number, 
    it adds a condition to filter products with a price greater than or equal to minPrice.*/
    if (!isNaN(minPrice)) {
      whereClause.price = {
        [Op.gte]: minPrice,
      };
    }
    /*Maximum Price: If maxPrice is a valid number,
     it adds a condition to filter products with a price less than or equal to maxPrice. */
    if (!isNaN(maxPrice)) {
      whereClause.price = {
        ...whereClause.price,
        [Op.lte]: maxPrice,
      };
    }
  }

  // Sorting: If a sort option is specified, it determines the order of the results:
  if (sort) {
    // Price Ascending: Sorts by price in ascending order from lowest to highest price
    if (sort === "price_asc") {
      orderClause.push(["price", "ASC"]);
      // Price Descending: Sorts by price in descending order.
    } else if (sort === "price_desc") {
      orderClause.push(["price", "DESC"]);
      // Newest: Sorts by creation date in descending order (newest first). E5er 7ja zedtha 9bal)
    } else if (sort === "newest") {
      orderClause.push(["createdAt", "DESC"]);
    }
  }

  products
  /*Uses the findAll method to retrieve products from the database that match the whereClause
   conditions and are sorted according to orderClause. */
    .findAll({ where: whereClause, order: orderClause })
    .then((filteredProducts) => {
      console.log("Filtered products:", filteredProducts);
      res.json(filteredProducts);
    })
    .catch((error) => {
      console.error("Error retrieving products:", error);
      res.status(500).json({ message: "Error retrieving products." });
    });
};

// lenna tofa
const incrementownercount = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await db.products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const brandId = product.brandId;

    await db.brands.increment("owner", { where: { id: brandId } });

    res.status(200).json({ message: "Owner count incremented successfully." });
  } catch (error) {
    console.error("Error incrementing owner count:", error);
    res.status(500).send("Failed to increment owner count");
  }
};

const decrementownercount = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await db.products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const brandId = product.brandId;

    await db.brands.decrement("owner", { where: { id: brandId } });

    res.status(200).json({ message: "Owner count decremented successfully." });
  } catch (error) {
    console.error("Error decrementing owner count:", error);
    res.status(500).send("Failed to decrement owner count");
  }
};

const updateproductbyId = async (req, res) => {
  const productId = req.params.productId;
  const { price } = req.body;

  try {
    const [updated] = await db.products.update(
      { price },
      { where: { id: productId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully." });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Failed to update product");
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      image,
      status,
      rarity,
      collection,
      stock = 0,
      onSale = false,
    } = req.body;

    // Validate required fields
    if (!title || !price || !image || !rarity || !collection) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        receivedData: req.body,
      });
    }

    // Create product with explicit values
    const product = await db.products.create({
      title: title.trim(),
      price: parseFloat(price),
      image: image.trim(),
      status: status || "Available",
      rarity: rarity.trim(),
      collection: collection.trim(),
      stock: parseInt(stock),
      onSale: Boolean(onSale),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
      receivedData: req.body,
    });
  }
};

module.exports = {
  getFilteredProducts,
  getProductbybrand,
  incrementownercount,
  decrementownercount,
  updateproductbyId,
  createProduct,
};
