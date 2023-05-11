const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

require("../models/UserDetails");
const User = mongoose.model("UserDetails");

const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = "dasdasd213721ewd;[]wwe12@!#deqw";

exports.user_login = async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        if (await bcryptjs.compare(password, user.password)) {
            const token = jsonwebtoken.sign({ _id: user._id, email: user.email, name: user.name }, JWT_SECRET);
            if (res.status(201)) {
                res.json({ status: "ok", data: token });
            }
            else {
                res.json({ error:"error" });
            }
        }
        else {
            res.json({ status:"error", error:"Invalid Password"})
        }
    } 
    else {
        res.json({ error:"User Not Found" })
    }
};

exports.user_register = async(req,res) => {
    const {name, email, password} = req.body;
    const encryptedPass = await bcryptjs.hash(password, 10);
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser)
        {
            await User.create({
                name,
                email,
                password: encryptedPass,
            })
            res.send({ status: "Okk" });
        }
        else {
            res.send( {status: "User exists"} );
        }
        
        
    }
    catch (error) {
        res.send({ status: "Error" });
    }
};

exports.user_find = async(req, res) => {
    const { token } = req.body;
    try{
        const user = jsonwebtoken.verify(token, JWT_SECRET);
        const userEmail = user.email;
        User.findOne({ email: userEmail })
            .then((data) => {
                res.send({ status: "ok", data: data });
            })
            .catch((error) => {
                res.send({ status:"error", data:"error" });
            });
    }
    catch(error) {
        res.send({ status: "Error" });
    }
};

