const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./review');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const NewUser = await User.register(user, password);
        req.logIn(NewUser,function(err){
            if(err){
                return next(err);
            }
            req.flash('success', "Welcome to YelpCamp!!");
            res.redirect('/campgrounds');
        })
    }
    catch (err) {
        req.flash('error', err.message)
        res.redirect('/register');
    }
})
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', "Welcome back!!");
    res.redirect('/campgrounds');
})
router.get('/logout', (req, res) => {
    req.logOut(function (err) {
        req.flash('success', "Logged-out successfully");
        res.redirect('/campgrounds');
    });
})
module.exports = router;