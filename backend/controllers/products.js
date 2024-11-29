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
// safsaf
const getFilteredProducts = (req, res) => {
    const { category, priceRange, rarity, status, onSale, sort } = req.query
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
    const { productId } = req.params; 

    try {
        const product = await db.products.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const brandId = product.brandId; 

        await db.brands.decrement('owner', { where: { id: brandId } });

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
      onSale = false
    } = req.body;

    // Validate required fields
    if (!title || !price || !image || !rarity || !collection) {
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
      receivedData: req.body  
    });
  }
};

module.exports = {
    getFilteredProducts, getProductbybrand, incrementownercount, decrementownercount, updateproductbyId, createProduct
};
