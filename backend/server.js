const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());


require("./database/index.js");
const PORT = 3001;
const brandsroute = require("./routes/brands.js");
const userRoute = require("./routes/user.js");
const productsRoute = require("./routes/AllProducts.js");
const cartRoute = require("./routes/cart.js");
const postsRoute = require("./routes/posts.js");
const userFavorites = require('./routes/user_favorites.js');
const favorite=require('./routes/favorite.js')



app.use("/brands", brandsroute);
app.use("/user", userRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/posts", postsRoute);
app.use("/user_favorites",userFavorites)
app.use("/favorite",favorite)


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
