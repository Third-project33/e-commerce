const express = require('express');
const router = express.Router();
const {addFavourite} = require('../controllers/favorite');
const {deleteFavourite}= require ('../controllers/favorite')


router.post('/add', addFavourite);


router.delete('/delete/:id', deleteFavourite);

module.exports = router;