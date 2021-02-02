
const bcrypt = require('bcrypt')
const users = [
  {
  name: 'Test User 1',
  email: 'one@one.com',
  passwordDigest: bcrypt.hashSync('chicken', 10)
  }
]

const plants = [
{
  plant_name: 'Fern',
  plant_date: new Date('2021-10-01T04:20:00Z'),
  data: [
    {}
  ] // reservations
} // first plant

]


// const mongoose = require('mongoose');
//
// Load our model file
const Plant = require('./Plant');
const User = require('./User');
// // Connect to the DB
// mongoose.connect('mongodb://localhost/plantowl', { useNewUrlParser: true, useUnifiedTopology: true });
//
// const db = mongoose.connection;
//
// db.on('error', (err) => {
//   console.log('Connection error', err);
// });
//
// // Once the connection is established, we can start querying/seeding
// db.once('open', async () => {
// once('open', async() => {
//
//  const plantsCreated = await createPlants();
//    console.log ('Plants done, created', plantsCreated.length)
//   process.exit(0); // quit program
//
// }); // once connection is established


const createPlants = async () => {
  try {

      // 1. Empty the plant collection (table), just like Rails Flight.destroy_all
      await Plant.deleteMany();

      // 2. Insert the new flights
      await Plant.create( plants ); // array of flights

      const plantResults = await Plant.find();
      console.log('plants', plantResults);

      return plantResults; // this will be the resolved promise value of this async function

    } catch(err){
      console.log('Error finding plants:', err);
    }

    console.log ('Done')
    process.exit(0); // quit program


}//create plants
