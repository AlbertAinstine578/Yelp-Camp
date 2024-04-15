const express = require('express');
const router = express.Router();
const {validateCampground}  = require('../schemas');
const {isLoggedIn} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');


router.get('/',async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index',{campgrounds});
}) 
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new');
})
router.post('/',validateCampground,catchAsync(async (req,res,next)=>{
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success',"Successfully created a Camp!");
    res.redirect(`campgrounds/${campground._id}`);
}))
router.get('/:id',catchAsync(async (req,res,next)=>{ 
    const {id} = req.params;
   const campground = await Campground.findById(id).populate('reviews');
   if(!campground){
    req.flash('error',"Campground not found");
    return res.redirect('/campgrounds');
     
}
    res.render('campgrounds/show',{campground});
  
}))
router.get('/:id/edit',catchAsync(async (req,res,next)=>{
        const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error',"Campground not found");
        return res.redirect('/campgrounds');
         
    }
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',validateCampground, catchAsync(async (req,res,next)=>{
        const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground,{runValidators:true, new:true});
    res.redirect(`/campgrounds/${id}`);
}))
router.delete('/:id',catchAsync(async (req,res,next)=>{
        const {id} = req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success',"Successfully deleted campground!");
   res.redirect('/campgrounds');
}))

module.exports = router;