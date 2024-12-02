const express = require("express");
const { signup, login, updateAvatar, getAllUsers, getuserbyid, deleteuserbyid, updateName, banUser } = require("../controllers/user");

const userRoute = express.Router();

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.put("/update-avatar", updateAvatar);
userRoute.get("/all", getAllUsers);
userRoute.get("/:id", getuserbyid);
userRoute.delete("/:id", deleteuserbyid);
userRoute.put("/update-name", updateName);
userRoute.post("/ban/:id", banUser);

module.exports = userRoute;
