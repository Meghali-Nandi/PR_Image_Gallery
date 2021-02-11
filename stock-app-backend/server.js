const express = require("express");
const fs = require('fs');
const http = require("http");
const https = require("https");
const path = require('path');
var bodyParser = require('body-parser');

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();


const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const db = require("./app/models");
const initRoutes = require("./app/routes/routes");
const cors = require("cors");


global.__basedir = __dirname;
var corsOption = {
    origin: "http://localhost:3000"
}

app.use(cors(corsOption));
app.use(require('sanitize').middleware);


app.use(express.static(__dirname + '/resources/file240'));
// app.use(express.static(path.join(__dirname, "../stock-app-frontend/dist/stock-app-frontend")));

app.use(express.urlencoded({ extended: true }));
initRoutes(app);



db.sequelize.sync();

//     { force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });


let port = 3000;


http.createServer(app).listen(8090);
// https.createServer({ key: privateKey, cert: certificate }, app).listen(port, () => {
//     console.log(`Running at localhost:${port}`);
// });
