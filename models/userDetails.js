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
mongoose.model("UserDetails", UserDetailsSchema);
