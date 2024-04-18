const joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const Campground = require('./models/campground');
const Review = require('./models/review');
const validateCampground = (req, res, next) => {
    const campgroundSchema = joi.object({
        campground: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            location: joi.string().required(),
            Image: joi.string().required(),
            description: joi.string().required()
        }).required()
    })
    const result = campgroundSchema.validate(req.body);

    if (result.error) {
        const message = result.error.details.map(temp => temp.message).join(',');
        throw new ExpressError(message, 400);
    }else{
        next();
    }
    
}
const validateReview = (req, res, next) => {
    const ReviewSchema = joi.object({
            review: joi.object({
            rating: joi.number().required().min(0).max(5),
            body: joi.string().required()
        }).required()
    })
    const result = ReviewSchema.validate(req.body);
    if(result.error){
        const message = result.error.details.map(temp => temp.message).join(',');
        throw new ExpressError(message,400);
    }else{
        next();
    }
}
const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error',"You must be Logged in");
        return res.redirect('/login');
    }
    next();
}
const isAdmin = async (req,res,next) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if((!req.user) || (camp.author.toString()!=(req.user._id.toString())) ){
        req.flash("error","You do not have permission");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
const ReviewAdmin = async (req,res,next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId).populate('author');
    if((!req.user )|| review.author._id.toString()!=req.user._id.toString()){
        req.flash('error',"You do not have permission to delete other's comments");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isAdmin = isAdmin;
module.exports.ReviewAdmin = ReviewAdmin;