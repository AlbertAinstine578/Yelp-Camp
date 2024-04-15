const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campgRoute = require('./routes/campground');
const reviewRoute = require('./routes/review')
const userRoute = require('./routes/users');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Mongoose connected!!");
}
main().catch((err) => {
    console.log(err);
})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "thisissecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        // expires: Date.now() + 7*24*60*60*1000,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


app.get('/fakeUser', async (req, res, next) => {
    const user = new User({ email: "albert@gmail.com", username: 'Albert_San' });
    const newUser = await User.register(user, 'onnichan');
    res.send(newUser);
})
app.use('/', userRoute);
app.use('/campgrounds', campgRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);
app.get('/', async (req, res) => {
    res.render('home');
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong";
    }
    res.status(statusCode).render('error', { err });

})
app.listen(3000, () => {
    console.log('Serving on port 3000!');
})