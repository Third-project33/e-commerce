const express = require('express');
const router = express.Router();
const {getUserFavorites} = require('../controllers/user_favorites');




router.get('/:userId', getUserFavorites);

module.exports = router;