const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken'); // Correct import

module.exports.registerUser = async function(req, res) { 
    try {
        let { fullname, email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (user) return res.status(400).send('You already have an account, please login');

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        user = await userModel.create({
            fullname,
            email,
            password: hashedPassword
        });

        // Generate the token
        let token = generateToken(user);
        res.cookie("token", token);
        res.send("User created successfully");
    } catch (err) {
        console.log(err.message);
        res.status(500).send('An error occurred');
    }
};

module.exports.loginUser = async function(req, res) {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password');

        bcrypt.compare(password, user.password, function(err, result) {
            if (err) return res.status(500).send('An error occurred');
            if (!result) return res.status(400).send('Invalid email or password');

            // Generate the token
            let token = generateToken(user);
            res.cookie("token", token);
            res.send("Login successful");
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('An error occurred');
    }
};

module.exports.logout = function(req, res) {
    res.clearCookie("token");
    res.send("Logout successful");
}