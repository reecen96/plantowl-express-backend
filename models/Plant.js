const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({

  // NOTE: just using snake case so the field names
  // eventually returned by the API match the Rails fields.
  // In pure MongoDB you would use camelCase, i.e. plantNumber
  plant_name: String,
  createdAt: {
    type: Date,
    default: Date.now // automatically fill out createdAt field
  },
  // a plant can have many nested datas
  data: [
    {
      moisture: Number, //soil moisture %
      temperature: Number,// temperature c
      watered: Number, // did water (y/n) - 1 or o
      waterLevel: Number, // L
      createdAt: {
        type: Date,
        default: Date.now // automatically fill out createdAt field
      }
    }
  ]

}); // Schema

// In order to require() this model in other JS code, we have to
// export it here
module.exports = mongoose.model('Plant', PlantSchema);
// Update and send to herku
