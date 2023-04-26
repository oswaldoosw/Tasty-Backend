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

app.listen(5000, () => {
    console.log("Server Started");
});




