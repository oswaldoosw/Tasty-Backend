const mongoose = require("mongoose");

require("../models/RecipeDetails");
const Recipe = mongoose.model("RecipeDetails");

const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = "dasdasd213721ewd;[]wwe12@!#deqw";

async function createRecipeComment (recipeid)
{
    await Recipe.create({
        recipeId: recipeid,
        rating: {
            score: 0,
            count: 0,
        },
    })
}

exports.recipe_find = async(req, res) => {
    const recipeid = req.query.param;
    
    try {
        const existingRecipe = await Recipe.findOne({ recipeId: recipeid });
        if (!existingRecipe)
        {
            await createRecipeComment(recipeid)   
        }
        Recipe.findOne({ recipeId: recipeid })
            .populate("comments.user", "_id name")
            .exec((err, result) => {
                if(err){
                    res.send({ status:"error", data:"error" });
                }
                else {
                    res.send({ status: "ok", data: result});
                }
            })
    }
    catch (error) {
        res.send({ status: "Recipe Error" });
    }
};

exports.recipe_find_rating = async(req, res) => {
    const token = req.query.token;
    const recipeid = req.query.param;
    
    try {
        if (token !== "null") {
            const userinfo = jsonwebtoken.verify(token, JWT_SECRET);
            const userFound = await Recipe.findOne({ recipeId: recipeid })
                .select({"ratingList": {
                    $elemMatch: {
                        user: userinfo,
                    }
                    }});
            Recipe.findOne({ recipeId: recipeid })
                .populate("comments.user", "_id name")
                .exec((err, result) => {
                    if(err) {
                        res.send({ status:"error", data:"error" });
                    }
                    else {
                        if (userFound){
                            res.send({ status: "rating found", data: result, rating: userFound});
                        }
                            
                        else
                            res.send({ status: "user not found", data: result});
                    }
                })
        }
        else {
            Recipe.findOne({ recipeId: recipeid })
                .populate("comments.user", "_id name")
                .exec((err, result) => {
                    if(err) {
                        res.send({ status:"error", data:"error" });
                    }
                    else {
                        res.send({ status: "user not found", data: result});
                    }
                })
        }
        
    }
    catch (error) {
        res.send({ status: "Rating Error" });
    }
};

exports.recipe_post_comment = async(req, res) => {
    const { postid, content, token } = req.body;
    var today = new Date();
    
    try {
        const userinfo = jsonwebtoken.verify(token, JWT_SECRET);
        
        var objFriends = { user:userinfo, content:content, dateCreated: today }
        Recipe.findByIdAndUpdate(postid, 
            {
                $push: { comments: objFriends}
            }, 
            {
                new: true
            })
            .populate("comments.user", "_id name")
            .exec((err, result) => {
                if(err){
                    res.send({ status:"error", data:"error" });
                }
                else {
                    res.send({ status: "ok", data: result});
                }
            })
    }
    catch (error) {
        res.send({ status: "Recipe Error" });
    }
};

exports.recipe_delete_comment = async(req, res) => {
    const { postid, _id, token } = req.body;
    try {
        const userinfo = jsonwebtoken.verify(token, JWT_SECRET);
        Recipe.findOneAndUpdate({ _id: postid }, 
            {
                $pull: {comments: {_id: _id, user: userinfo} }
            }, 
            {
                new: true
            })
        .populate("comments.user", "_id name")
        .exec((err, result) => {
            if(err){
                res.send({ status:"error", data:"error" });
            }
            else {
                res.send({ status: "ok", data: result});
            }
        })
    }
    catch (error) {
        res.send({ status: "Delete Failed" });
    }
};

exports.recipe_rate = async(req, res) => {
    const {rating, postid, ratingCount, actualRating, token, firstTimeRating, initialRating } = req.body;
    try {
        const userinfo = jsonwebtoken.verify(token, JWT_SECRET);
        if (firstTimeRating === true) {
            const newCount = parseInt(ratingCount) + 1;
            const newRating = parseFloat(actualRating) + (parseFloat(rating) - parseFloat(actualRating))/newCount;

            Recipe.findOneAndUpdate({ _id: postid }, 
                {
                    $set: {rating: { score: parseFloat(newRating), count: newCount}},
                    $push: {ratingList: { user: userinfo, score: parseFloat(rating) } }
                }, 
                {
                    new: true
                })
                .populate("ratingList.user", "_id name")
                .exec((err, result) => {
                    if(err){
                        res.send({ status:"error", data:"error" });
                    }
                    else {
                        res.send({ status: "ok", data: result});
                    }
                })
        }
        else {
            const newCount = parseInt(ratingCount);
            let subtractedAverageRating = ((parseFloat(actualRating) * newCount) - parseFloat(initialRating))/(newCount - 1);
            if (newCount === 1)
            {
                subtractedAverageRating = 0;
            }
            const newRating = parseFloat(subtractedAverageRating) + (parseFloat(rating) - parseFloat(subtractedAverageRating))/newCount;
            
            Recipe.findOneAndUpdate({ _id: postid, 'ratingList': {
                    $elemMatch: {
                        user: userinfo,
                    }
                }}, 
                {
                    '$set': {
                        'ratingList.$.score': rating,
                        rating: { score: parseFloat(newRating), count: newCount}
                    }
                    // $pull: {ratingList: { user: userinfo } },
                }, 
                {
                    new: true
                })
                .populate("ratingList.user", "_id name")
                .exec((err, result) => {
                    if(err){
                        res.send({ status:"error", data:"error" });
                    }
                    else {
                        res.send({ status: "ok", data: result});
                    }
                })
        }
        
       
    }
    catch (error) {
        res.send({ status: "Cannot Rate" });
    }
};