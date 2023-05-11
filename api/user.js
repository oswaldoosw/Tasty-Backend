var express = require('express');
// const mongoose = require("mongoose");
var router = express.Router();
// const bcryptjs = require("bcryptjs");
// require("../models/UserDetails");
// require("../models/RecipeDetails");

// const User = mongoose.model("UserDetails");
// const Recipe = mongoose.model("RecipeDetails");

// const jsonwebtoken = require("jsonwebtoken");
// const JWT_SECRET = "dasdasd213721ewd;[]wwe12@!#deqw";

const user_controller = require("../controllers/userController.js");
const recipe_controller = require("../controllers/recipeController.js");

router.post("/login", user_controller.user_login);

router.post ("/register", user_controller.user_register);

router.post("/user", user_controller.user_find);

router.get("/recipe", recipe_controller.recipe_find);

router.get("/rating", recipe_controller.recipe_find_rating);

router.patch("/recipe/comment", recipe_controller.recipe_post_comment);

router.delete("/recipe/comment/delete", recipe_controller.recipe_delete_comment);

router.patch("/recipe/rate", recipe_controller.recipe_rate);


module.exports = router;