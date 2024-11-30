const express = require('express');
const router = express.Router();
const { createPost, getUserPosts , deletePost } = require('../controllers/posts');

router.post('/create', createPost);
router.get('/user/:userId', getUserPosts);
router.delete("/deletePost/:id", deletePost);


module.exports = router;
