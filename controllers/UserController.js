"use strict";

const express = require("express");
const router = express.Router();

const response = require("../src/constructors/responseBody");
const jwt = require("../src/constructors/jwt");
const authenticate = require("../src/middleware/authenticate");
const validate = require("../src/indicative/indicative");

const User = require("../models/User");

router.route("/createAccount")
    .post((req, res) => {
        validate(req.body, "creds", validResponse => {
            const body = validResponse.body.data;
            if (validResponse.ok) {
                User.findOne({email: body.email}, (err, user) => {
                    if (err) {
                        res.send(response(false, err, {_id: null}));
                    } else if (user) {
                        res.send(response(false, "User already exists."));
                    } else {
                        const newUser = User.create(body);
                        newUser.save((err, user) => {
                            res.send(err? response(false, err) : response(true, "", {_id: user._id}));
                        });
                    }
                });
            } else {
                res.send(response(false, validResponse.message[0].message));
            }
        });
    });

router.route("/login")
    .post((req, res) => {
        validate(req.body, "creds", validResponse => {
            if (validResponse.ok) {
                const body = validResponse.body.data;
                User.findOne({email: body.email}, (err, user) => {
                    if (err) {
                        res.send(response(false, err));
                    } else if (!user) {
                        res.send(response(false, `No user with email ${body.email} found.`));
                    } else {
                        if (user.validateUser(body.password)) {
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
                });
            } else {
                res.send(response(false, validResponse.message[0].message));
            }
        });
    });

router.route("/:id")
    .all(authenticate)
    .get((req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            res.send(err? response(false, err) : response(true, "", {user: user}));
        });
    });

module.exports = router;