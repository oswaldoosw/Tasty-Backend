const mongoose = require("mongoose");
require("./UserDetails");

const User = mongoose.model("UserDetails");

const RecipeDetailsSchema = new mongoose.Schema(
    {
        recipeId: { type: Number, unique:true },
        rating: { 
            score: Number,
            count: Number,
        },
        ratingList: [{
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
          },
          score: Number,
        }],
        comments: [{
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: User,
              required: true,
            },
            content: String,
            dateCreated: Date,
          }]
        
    },
    {
        collection: "RecipeInfo"
    }
);

mongoose.model("RecipeDetails", RecipeDetailsSchema);
