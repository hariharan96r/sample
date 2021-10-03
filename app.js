const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const { userRegisteration, validator } = require("./validation");
const filePath = './users.json';

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/register', (req, res) => {
    try {
        !fs.existsSync(filePath) && fs.writeFileSync(filePath, []);

        let userData = fs.readFileSync(filePath);
        userData = userData.toJSON().data.length ? JSON.parse(userData) : [];

        const contentToInsert = {
            name: req.body.name,
            password: req.body.password
        }

        userData.push(contentToInsert);
        fs.writeFileSync(filePath, JSON.stringify(userData));

        return res.status(200).json({
            status: 'success',
            message: 'User created successfully...'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'failure',
            message: 'something went wrong'
        });
    }
});

app.post('/login', (req, res) => {
    try {
        const userNotFound = () => 
            res.status(404).json({
                status: 'failure',
                message: 'User not found'
            });
        !fs.existsSync(filePath) && fs.writeFileSync(filePath, []);

        let userData = fs.readFileSync(filePath);
        userData = userData.toJSON().data.length ? JSON.parse(userData) : [];

        if (!userData.length) {
            return userNotFound();
        }
        const userFound = userData.find(user => user.name.toLowerCase() === req.body.name.toLowerCase()
            && user.password === req.body.password);
        if (!userFound) {
            return userNotFound();
        } else {
            return res.status(200).json({
                status: 'success',
                data: userFound
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: 'failure',
            message: 'User not found'
        });
    }
});
const port = 3000;

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
