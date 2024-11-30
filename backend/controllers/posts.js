const db = require('../database');

exports.createPost = async (req, res) => {
  try {
    const { content, image, userId } = req.body;
    const post = await db.posts.create({
      content,
      image,
      UserId: userId
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await db.posts.findAll({
      where: { UserId: userId }
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

exports.deletePost = async (req, res) => {
  try {
      const { id } = req.params
      const result = await db.posts.destroy({
          where: { id: id },
      })

      if (result === 0) {

          return res.status(404).send('Post not found')
      }
      res.status(200).send('deleted')
  } catch (error) {

      console.error(error)
      res.status(500).send(error)
  }
}



