const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async function(req, res, next) {
    if (! req.cookies.token){
        req.flash('error', 'You need to login first');
        return res.redirect('/');
    }
    try{
        let drcoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user= await  userModel.
        findOne({email: drcoded.email})
        .select('-password');
        req.user = user;
        next();
    }catch(err){
        req.flash('error', 'something went wrong');
        return res.redirect('/');
    }
    
};