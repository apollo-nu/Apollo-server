const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const env = "" + process.env.NODE_ENV;
console.log("ENV: " + env);
const config = require('./config/db')[env || "dev"];

const mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true });

//const NameController = require('./controllers/NameController');

//app.use('/routeName', NameController);

const PORT = process.env.PORT || 8081;
app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);

module.exports = app;