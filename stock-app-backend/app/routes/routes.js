const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const db = require("../models/");
const Image = db.tutorials;

var multer = require('multer')();
const searchController = require("../controller/search.controller");

const path = require('path');
const User = db.user;
var bodyParser = require('body-parser');
const config = require("../config/auth.config");
const spawnUtil = require("./spawnUtil");

var jwt = require("jsonwebtoken");
var crypto = require('crypto');

let routes = (app) => {

    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.post('/delete/:id', async(req, res) => {
        console.log(req.params.id);
        const ids = parseInt(req.params.id);
        Image.destroy({
            where: {
                id: ids
            }
        })
        .then(() => {
            console.log("Successfully deleted image with id= "+ ids);
            res.send({message:"success"})
        })
        .catch(err => {
            console.log("Error while deleting image with id= "+ids);
            console.log(err);
            res.send({message: "failure"})
        })

        
    })


    app.post("/login", (req, res, next) => {
        console.log("LOgin server requested");
        console.log(req.body);
        User.findOne({
                where: {
                    username: req.body.username
                }
            })
            .then(async(user) => {
                if (!user) {
                    console.log("User not found");
                    return res.status(404).send({ message: "User Not found." });
                }
                const reqPassword = await (req.body.password);
                const hash = crypto.createHash('md5').update(reqPassword).digest('hex');
                const userPassword = await (user.password);

                var passwordIsValid = hash === userPassword;

                if (!passwordIsValid) {
                    console.log("Invalid password");
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });


                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    accessToken: token
                });

            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    });

    app.post("/upload", multer.single("file"), async(req, res, next) => {


        try {
            const reqBody = req.body;
            const filename = reqBody.name;
            const reqFile = req.file.buffer;
            const uuid = uuidv4();
            const file240 = `${uuid}-${filename}-240.jpeg`;
            const file720 = `${uuid}-${filename}-720.jpeg`;
            
            await spawnUtil({ file240, file720, reqFile })
                .then(async(code) => {
                    if (code.code == 1) {
                        try {

                            const createImage = await Image.create({
                                name: reqBody.name,
                                description: reqBody.description,
                                file240: file240,
                            });

                            res.send({ message: "success" });
                        } catch {
                            res.send({ message: "failure" });
                        }
                    } else {
                        res.send({ message: "failure" });
                    }
                });

        } catch {
            res.send({ message: "failure" });
        }

    });

    app.get("/search", async(req, res) => {
        console.log(req.query.query);
        const params = req.query.query;
        const getWhere = await searchController.fetchRecords(params);
        const result = await db.sequelize.query(getWhere, {
            type: db.sequelize.QueryTypes.SELECT
        });
        res.send({
            message: result
        });
    });

    
    app.get("*", (req, res) => {
        return res.sendFile(path.join(__dirname, "../../../stock-app-frontend/dist/stock-app-frontend/index.html"));
    })
    return app.use("/", router);
}

module.exports = routes;