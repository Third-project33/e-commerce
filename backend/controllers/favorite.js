const db = require('../database'); // Adjust the path as necessary

// Function to add a favorite
 const addFavourite = async (req, res) => {
    try {
        const { userId, productId } = req.body; // Expecting userId and productId in the request body

        const favourite = await db.Favourites.create({
            UserId: userId,
            productId: productId,
            added_at: new Date() // Optional: you can set this explicitly
        });

        return res.status(201).json({ message: 'Favourite added successfully', favourite });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding favourite', error });
    }
};

// Function to delete a favorite
 const deleteFavourite = async (req, res) => {
    try {
        const { id } = req.params; // Expecting the favourite ID in the request parameters

        const result = await db.Favourites.destroy({
            where: { id: id }
        });

        if (result) {
            return res.status(200).json({ message: 'Favourite deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Favourite not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting favourite', error });
    }
};
const getFavorites = async (req, res) => {
    try {
        const { id } = req.params; // Expecting userId in the request parameters
console.log(id)
        const favorites = await db.Favourites.findOne({
            where: { UserId: id },
            include: [{ model: db.products ,as: "products"}] // Include product details if needed
        });
console.log(favorites);
       res.send(favorites.products)
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving favorites', error });
    }
};

 module.exports={addFavourite,deleteFavourite,getFavorites}
