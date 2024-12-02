const express = require("express");
const cors = require("cors");
const http = require("http"); 

const app = express();
const server = http.createServer(app); 
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
// Removed Socket.IO related code
// const { Server } = require("socket.io"); 

// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3001',
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });

// io.on("connection", (socket) => {
//     console.log("A user connected");
//     // ... existing socket event handlers ...
//     socket.on("disconnect", () => {
//         console.log("A user disconnected");
//     });
// });

require("./database/index.js");
const PORT = 3001;
const brandsroute = require("./routes/brands.js");
const userRoute = require("./routes/user.js");
const productsRoute = require("./routes/AllProducts.js");
const cartRoute = require("./routes/cart.js");
const postsRoute = require("./routes/posts.js");

// Removed Socket.IO related routes
// app.use("/socket", io); // This line is also removed

app.use("/brands", brandsroute);
app.use("/user", userRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/posts", postsRoute);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});