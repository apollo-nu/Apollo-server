const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/User");
const response = require("../src/responseBody");

router.route("/")
    .get((req, res) => {
        console.log("GET /user");
        User.find()
            .sort("signupDate")
            .exec((err, users) => {
                res.send(err? response(false, err, {users: []}) : response(true, "", {users: users}));
            })
    })

router.route("/:id")
    .get((req, res) => {
        const id = req.params["id"];
        console.log("GET /user/" + id);

        User.findOne({_id: id}, (err, user) => {
            res.send(err? response(false, err, {user: null}) : response(true, "", {user: user}));
        });
    })
    .put((req, res) => {
        const id = req.params["id"];
        console.log("PUT /user/" + id);

        User.findOneAndUpdate({_id: id}, req.body.user, (err, user) => {
            res.send(err? (response(false, err, {_id: id})) : response(true, "", {_id: user._id}));
        })
    })
    .delete((req, res) => {
        const id = req.params["id"];
        console.log("DELETE /user/" + id);

        User.findOneAndDelete({_id: id}, (err, user) => {
            if (err) {
                res.send(response(false, err, {_id: id}));
            } else if (!user) {
                res.send(response(true, "User not found.", {_id: id}));
            } else {
                res.send(response(true, "", {_id: user._id}));
            }
        })
    });

router.route("/createAccount")
    .post((req, res) => {
        console.log("POST /user");
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            res.send(response(false, "Empty email or password field(s).", {_id: null}))
        }

        User.findOne({email: email}, (err, user) => {
            if (err) {
                res.send(response(false, err, {_id: null}));
            } else if (user) {
                res.send(response(false, `User with email ${email} already exists.`, {_id: user._id}));
            } else {
                const newUser = new User();
                newUser.email = email;
                newUser.generateHash(password);
                newUser.save((err, user) => {
                    res.send(err? response(false, err, {_id: null}) : response(true, "", {_id: user._id}));
                });
            }
        })        
    })

router.route("/login")
    .post((req, res) => {
        console.log("GET user/login")
        const email = req.body.email;

        User.findOne({email: email}, (err, user) => {
            if (err) {
                res.send(response(false, err, {_id: user._id}));
            } else if (!user) {
                res.send(response(false, `No user with email ${email} found.`, {_id: user._id}));
            } else {
                if (user.validateUser(req.body.password)) {
                    const token = jwt.sign({check: true}, process.env.JWT_SECRET, {expiresIn: 1440});
                    res.send(response(true, `User ${user._id} logged in.`, {
                        _id: user._id,
                        token: token
                    }));
                } else {
                    res.send(response(false, "Failed to validate user.", {_id: user._id}));
                }
            }
        })
    })

module.exports = router;