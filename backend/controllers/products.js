const db = require("../database/index");
const { Op } = require('sequelize');
const { products } = require('../database/index');

const getProductbybrand = async (req, res) => {
    const brandId = req.params.brandId; // Get the brand ID from the request parameters

    try {
        const products = await db.products.findAll({
            where: { brandId }, // Filter products by the specified brand ID
            include: [{
                model: db.brands,
                attributes: ['id', 'name'] // Include brand details if needed
            }]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this brand." });
        }

        res.json(products); // Send the products as a JSON response
    } catch (error) {
        console.error("Error fetching products by brand ID:", error);
        res.status(500).send("Failed to fetch products");
    }
};  


const getFilteredProducts = (req, res) => {
    const { category, priceRange, rarity, status, onSale, chains, sort } = req.query
    const whereClause = {}
    const orderClause = []

    if (category) {
        whereClause.collection = category
    }
 
    if (rarity) {
        whereClause.rarity = rarity
    }

    if (status) {
        whereClause.status = status
    }

    if (chains) {
        whereClause.chains = { [Op.like]: `%${chains}%` }
    }

    if (onSale === 'true') {
        whereClause.onSale = true
    }

    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number)
        if (!isNaN(minPrice)) {
            whereClause.price = {
                [Op.gte]: minPrice
            }
        }
        if (!isNaN(maxPrice)) {
            whereClause.price = {
                ...whereClause.price,
                [Op.lte]: maxPrice
            }
        }
    }

    if (sort) {
        if (sort === 'price_asc') {
            orderClause.push(['price', 'ASC'])
        } else if (sort === 'price_desc') {
            orderClause.push(['price', 'DESC'])
        } else if (sort === 'newest') {
            orderClause.push(['createdAt', 'DESC'])
        }
    }


    products.findAll({ where: whereClause, order: orderClause })
        .then(filteredProducts => {
            console.log("Filtered products:", filteredProducts)
            res.json(filteredProducts)
        })
        .catch(error => {
            console.error('Error retrieving products:', error)
            res.status(500).json({ message: "Error retrieving products." })
        })
}

const incrementownercount = async (req, res) => {
    const { productId } = req.params; 

    try {
        
        const product = await db.products.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const brandId = product.brandId; 

        
        await db.brands.increment('owner', { where: { id: brandId } });

        res.status(200).json({ message: "Owner count incremented successfully." });
    } catch (error) {
        console.error("Error incrementing owner count:", error);
        res.status(500).send("Failed to increment owner count");
    }
};

const decrementownercount = async (req, res) => {
    const { productId } = req.params; // Get the product ID from the request parameters

    try {
        // Find the product by ID to get the associated brand ID
        const product = await db.products.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const brandId = product.brandId; // Get the brand ID from the product

        // Decrement the owner count in the brands table
        await db.brands.decrement('owner', { where: { id: brandId } });

        res.status(200).json({ message: "Owner count decremented successfully." });
    } catch (error) {
        console.error("Error decrementing owner count:", error);
        res.status(500).send("Failed to decrement owner count");
    }
};

const updateproductbyId = async (req, res) => {
    const productId = req.params.productId; // Get the product ID from the request parameters
    const { price } = req.body; // Destructure the request body for the attributes you want to update

    try {
        const [updated] = await db.products.update(
            { price }, // Attributes to update
            { where: { id: productId } } // Condition to find the product by ID
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
    // Log the incoming request body

    const { 
      title, 
      price, 
      image,
      status,
      rarity,
      chains,
      collection,
      stock = 0,
      onSale = false
    } = req.body;

    // Validate required fields
    if (!title || !price || !image || !rarity || !chains || !collection) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        receivedData: req.body
      });
    }

    // Create product with explicit values
    const product = await db.products.create({
      title: title.trim(),
      price: parseFloat(price),
      image: image.trim(),
      status: status || 'Available',
      rarity: rarity.trim(),
      chains: chains.trim(),
      collection: collection.trim(),
      stock: parseInt(stock),
      onSale: Boolean(onSale)
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating product',
      error: error.message,
      receivedData: req.body  // Include the received data in error response
    });
  }
};

module.exports = {
    getFilteredProducts,getProductbybrand,incrementownercount,decrementownercount,updateproductbyId,createProduct
};
