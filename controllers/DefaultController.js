const express = require("express");
const router = express.Router();

//this route is used to ping the server to keep it awake
router.route("/")
    .get((req, res) => {
        console.log("GET: /");
        res.send("App is running.");
    });

module.exports = router;