const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({

name: String,
email: String,
passwordDigest: String,

createdAt: {
  type: Date,
  default: Date.now //automatically fill out createdAt field with current date
},

plants: [{
  plant_name: String,
  plant_date: Date,
  // a plant can have many nested datas
  data: [
    {
      moisture: Number,
      temperature: Number,
      watered: Number,
      createdAt: {
        type: Date,
        default: Date.now // automatically fill out createdAt field
      }
    }
  ]

}], //plant schema

}); //user schema


//Creating customer methods to call on this model


module.exports = mongoose.model('User', UserSchema);
