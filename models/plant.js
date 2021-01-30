const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({

  // NOTE: just using snake case so the field names
  // eventually returned by the API match the Rails fields.
  // In pure MongoDB you would use camelCase, i.e. plantNumber
  plant_name: String,
  plant_date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User' //this creates an association to the user model
  },
  // a plant can have many nested datas
  data: [
    {
      moisture: Number,
      temperature: Number,
      watered: Number,
      date: Date
    }
  ]

}); // Schema

// In order to require() this model in other JS code, we have to
// export it here
module.exports = mongoose.model('Plant', PlantSchema);
