const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const {isLoggedIn} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const {validateReview}  = require('../schemas');
const {ReviewAdmin} = require('../schemas');
router.post('/',validateReview,isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const {review} = req.body;
    const rev = await new Review(review);
    rev.author = req.user._id;
    campground.reviews.push(rev);
    await rev.save();
    await campground.save();
    req.flash('success',"Created a new review!");
    res.redirect(`/campgrounds/${id}`);

}))
router.delete('/:reviewId',isLoggedIn,ReviewAdmin, catchAsync(async (req,res,next)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull :{reviews: reviewId}});
    const rev = await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
    
}))

module.exports = router;