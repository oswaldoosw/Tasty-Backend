const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const user = require('./routes/user');
app.use(cors());
app.use(express.json());

const mongoUrl = "mongodb+srv://oswaldoosw:70956910@cluster0.fkpwcl2.mongodb.net/?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);
mongoose.connect(mongoUrl, {
        useNewUrlParser:true
    })
    .then(() => {
        console.log("Connected!");
    })
    .catch((e) => {
        console.log(e);
    });

app.use('/', user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server Started");
});




