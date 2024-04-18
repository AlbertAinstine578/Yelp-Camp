const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
 const {descriptors,places} = require('./seedHelpers');
 const axios = require('axios');
const { object } = require('joi');

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Mongoose connected!!");
}
main().catch((err)=>{
    console.log(err); 
})
function sample(arr){
   return Math.floor(Math.random()*arr.length);
}
 


const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const response = await axios.get('https://picsum.photos/400'); 
        const imageUrl = response.request.res.responseUrl;

        const camp = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`,
        Image: imageUrl,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur id quas, quis atque delectus molestias pariatur cum ad, beatae quos numquam nostrum voluptas cupiditate, quaerat qui? Ipsa dolorem tenetur omnis.",
        author:'661cff23181be8a85e8acd58'
        })
    await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})