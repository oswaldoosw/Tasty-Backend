const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetailsSchema = new Schema(
    {
        name:String,
        email:{ type:String, unique:true },
        password:String
    },
    {
        collection: "UserInfo"
    }
);
module.exports = mongoose.model("UserDetails", UserDetailsSchema);
