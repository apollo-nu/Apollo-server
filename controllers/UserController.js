"use strict";

const express = require("express");
const router = express.Router();

const response = require("../src/constructors/responseBody");
const jwt = require("../src/constructors/jwt");
const authenticate = require("../src/middleware/authenticate");
const validate = require("../src/indicative/indicative");

const User = require("../models/User");

router.route("/")
    .all(authenticate)
    .get((req, res) => {
        const accessToken = req.cookies["access-token"];
        res.send(response(true, "", {id: jwt.payload(accessToken).id}));
    });

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
                        res.clearCookie("access-token");
                        res.send(response(false, err));
                    } else if (!user) {
                        res.clearCookie("access-token");
                        res.send(response(false, `No user with email ${body.email} found.`));
                    } else {
                        if (user.validateUser(body.password)) {
                            const EXPIRY_TIME = 604800000; // 7 Days
                            const token = jwt.sign({
                                id: user._id,
                                issued: Date.now()
                            }, EXPIRY_TIME);
                            const cookieOptions = process.env.NODE_ENV === "production"? {httpOnly: true, maxAge: EXPIRY_TIME, secure: true} : {maxAge: EXPIRY_TIME};
                            res.cookie("access-token", token, cookieOptions);
                            res.send(response(true, `User logged in.`, {id: user._id}));
                        } else {
                            res.clearCookie("access-token");
                            res.send(response(false, "Failed to validate user."));
                        }
                    }
                });
            } else {
                res.send(response(false, validResponse.message[0].message));
            }
        });
    });

module.exports = router;