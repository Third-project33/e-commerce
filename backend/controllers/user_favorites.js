const db = require('../database'); // Adjust the path as necessary
const { get } = require('../routes/favorite');

// Function to get user favorites
 const getUserFavorites = async (req, res) => {
    try {
        const { userId } = req.params; // Expecting userId in the request parameters

        const favorites = await db.user_favorites.findAll({
            where: { userId: userId },
            include: [{ model: db.products }] // Include product details if needed
        });

        return res.status(200).json(favorites);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving favorites', error });
    }
};
 module.exports={getUserFavorites}