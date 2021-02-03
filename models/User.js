const mongoose = require('mongoose');
const Plant = require('./Plant');


const UserSchema = new mongoose.Schema({

  name: String,
  email: String,
  passwordDigest: String,
  createdAt: {
    type: Date,
    default: Date.now //automatically fill out createdAt field with current date
  },
  plants: [{
    ref: 'Plant', // this 'flight' key is a reference to a Flight model instance
    type: mongoose.Schema.Types.ObjectId  // flight is an _id for a Flight collection object
  }],


//
// }], //plant schema

}); //user schema


//Creating customer methods to call on this model
  // UserSchema.methods.saveReservation = async function (res) {
  //
  //   // Save reservation into both places that we are storing it:
  //   // 1. Into the Flight's reservations list
  //   // 2. Into this User's reservations list
  //
  //   // 1. await res.flight.updateOne( { ... })
  //   // 2. await this.update( { ... } )
  //
  //   // return this;
  //
  // }; // saveReservation

module.exports = mongoose.model('User', UserSchema);
