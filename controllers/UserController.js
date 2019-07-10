const express = require("express");
const router = express.Router();

const User = require("../models/User");
const response = require("../src/constructors/responseBody");
const jwt = require("../src/constructors/jwt");
const authenticate = require("../src/middleware/authenticate");

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        const id = req.params["id"];
        console.log("GET /user/" + id);

        User.findOne({_id: id}, (err, user) => {
            res.send(err? response(false, err, {user: null}) : response(true, "", {user: user}));
        });
    })
    .put((req, res) => { //replace this with more specific functions
        const id = req.params["id"];
        console.log("PUT /user/" + id);

        User.findOneAndUpdate({_id: id}, req.body.user, (err, user) => {
            res.send(err? (response(false, err, {_id: id})) : response(true, "User updated successfully.", {_id: user._id}));
        })
    })

router.route("/createAccount")
    .post((req, res) => {
        console.log("POST /user");
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            res.send(response(false, "Empty email or password field(s)."))
        }

        User.findOne({email: email}, (err, user) => {
            if (err) {
                res.send(response(false, err, {_id: null}));
            } else if (user) {
                res.send(response(false, `User with email ${email} already exists.`));
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
                res.send(response(false, err));
            } else if (!user) {
                res.send(response(false, `No user with email ${email} found.`));
            } else {
                if (user.validateUser(req.body.password)) {
                    const token = jwt({
                        id: user._id,
                        issued: Date.now()
                    }, 10080);
                    res.cookie("access-token", token, {httpOnly: true, secure: true});
                    res.send(response(true, `User logged in.`, {id: user._id}));
                } else {
                    res.send(response(false, "Failed to validate user."));
                }
            }
        })
    })

router.route("/:id/logout")
    .all(authenticate)
    .get((req, res) => {
        const id = req.params.id;
        console.log(`GET: /users/${id}/logout`);
        res.send({}); //TODO
    })

module.exports = router;