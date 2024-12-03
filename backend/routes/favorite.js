const express = require('express');
const router = express.Router();
const {addFavourite} = require('../controllers/favorite');
const {deleteFavourite}= require ('../controllers/favorite')
const {getFavorites}=require('../controllers/favorite')

router.post('/add', addFavourite);
router.get('/Favourite/:id',getFavorites)
router.delete('/delete/:id', deleteFavourite);

module.exports = router;