const { Sequelize  } = require('sequelize');


const sequelize = new Sequelize('e-commerce', 'root', 'saf12@sql', {
  host: 'localhost',
  dialect: 'mysql' 
});

sequelize
 .authenticate()
 .then(() => {
  console.log("DATABASE CONNECTED");
 })
 .catch((err) => {
  console.log(err);
 });


const db ={}
db.sequelize = sequelize 
db.Sequelize = Sequelize
db.brands = require("./models/brands")(sequelize , Sequelize)
db.cart = require("./models/cart")(sequelize , Sequelize)
db.products = require("./models/products")(sequelize , Sequelize)
db.user = require("./models/user")(sequelize , Sequelize)
db.user_favorites = require("./models/user_favorites")(sequelize , Sequelize)
db.CartProducts = require("./models/cartProducts")(sequelize, Sequelize)
db.posts = require("./models/posts")(sequelize, Sequelize)
db.Favourites = require("./models/favorite")(sequelize , Sequelize)


db.user.hasOne(db.cart);
db.cart.belongsTo(db.user);

db.cart.belongsToMany(db.products, { 
  through: db.CartProducts
});

db.products.belongsToMany(db.cart, { 
  through: db.CartProducts
});

db.brands.hasMany(db.products)
db.products.belongsTo(db.brands)

db.user.hasMany(db.posts)
db.posts.belongsTo(db.user)


db.user.hasMany(db.Favourites)
db.Favourites.belongsTo(db.user)

db.Favourites.belongsToMany(db.products , {through: db.user_favorites})
db.products.belongsToMany(db.Favourites ,{through: db.user_favorites})





// sequelize.sync({alter : false}).then(() => {
//    console.log(' table created successfully!');
//    }).catch((error) => {
//     console.error('Unable to create table : ', error);
//    });


module.exports= db

