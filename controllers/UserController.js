const express = require("express");
const router = express.Router();

const User = require("../models/User");
const response = require("../src/constructors/responseBody");
const jwt = require("../src/constructors/jwt");
const authenticate = require("../src/middleware/authenticate");
const validate = require("../src/indicative/indicative");

router.route("/createAccount")
    .post((req, res) => {
        validate(req.body, "creds", response => {
            if (response.ok) {
                const email = req.body.email;
                const password = req.body.password;
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
                            res.send(err? response(false, err, {_id: null}) : response(true, "User created successfully.", {_id: user._id}));
                        });
                    }
                });
            } else {
                res.send(response(false, response.message));
            }
        })
    })

router.route("/login")
    .post((req, res) => {
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
                    const cookieOptions = process.env.NODE_ENV === "production"? {httpOnly: true, secure: true} : {};
                    res.cookie("access-token", token, cookieOptions);
                    res.send(response(true, `User logged in.`, {id: user._id}));
                } else {
                    res.send(response(false, "Failed to validate user."));
                }
            }
        })
    })

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        User.findOne({_id: req.params["id"]}, (err, user) => {
            res.send(err? response(false, err) : response(true, "", {user: user}));
        });
    })
    .put((req, res) => {
        User.findOneAndUpdate({_id: req.params["id"]}, req.body.user, (err, user) => {
            res.send(err? (response(false, err)) : response(true, "User updated successfully."));
        })
    })

module.exports = router;