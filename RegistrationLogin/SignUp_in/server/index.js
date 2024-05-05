const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1/user:27017");

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Incorrect Password");
                }
            } else {
                res.json("No record existed");
            }
        });
});


app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});


app.listen(3001, () => {
    console.log("Server is Running")
})