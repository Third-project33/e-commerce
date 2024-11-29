const express = require("express");
const cors = require("cors");
const http = require("http"); 
const { Server } = require("socket.io"); 

const app = express();
const server = http.createServer(app); 
const io = new Server(server); 

app.use(cors());
app.use(express.json());

require("./database/index.js");
const PORT = 3000;
const brandsroute = require("./routes/brands.js");
const userRoute = require("./routes/user.js");
const productsRoute = require("./routes/AllProducts.js");
const cartRoute = require("./routes/cart.js");
const postsRoute = require("./routes/posts.js");

io.on("connection", (socket) => {
    console.log("A user connected");

    
    socket.on("sendNotification", (notification) => {
        io.emit("receiveNotification", notification); 
    });

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message); 
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

app.use("/brands", brandsroute);
app.use("/user", userRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/posts", postsRoute);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});