const express = require('express');
const isloggedin = require('../middlewares/isLoggedin');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user || null,
        featuredProducts: [] // You can populate this with actual products later
    });
});

router.get('/shop', isloggedin, function (req, res) {
    res.render('shop');
});
 
module.exports = router;