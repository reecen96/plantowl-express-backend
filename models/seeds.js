
const bcrypt = require('bcrypt')


const plants = [
{
  plant_name: 'Fern',
  data:[
    {
      moisture: 67,
      temperature: 23,
      watered: 1,
      waterLevel: 3

    }
  ] // reservations
} // first plant
]


const mongoose = require('mongoose');


//Load model files
const Plant = require('./Plant');
const User = require('./User');


const dotenv = require('dotenv').config();
//connect to  DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.on('error', (err) => {
  console.log('Connection error', err);
});



db.once('open', async () => {


  const plantsCreated = await createPlants();
  console.log('Plants done, created ', plantsCreated.length );

  // Now move on to creating users
  const usersCreated = await createUsers( plantsCreated ); // pass the created plants in
  console.log('Users done, created ', usersCreated.length );
  console.log(usersCreated[0]);

  process.exit(0); // quit program

}); // once connection is established


const createPlants = async () => {

  try {

    // 1. Empty the plantss collection (table), just like Rails plant.destroy_all
    await Plant.deleteMany();

    // 2. Insert the new plants
    await Plant.create( plants ); // array of plants

    const plantResults = await Plant.find();
    // console.log('plants', plantResults);

    return plantResults; // this will be the resolved promise value of this async function

  } catch(err){
    console.log('Error creating plants:', err);
  }

}; // createPlants


const createUsers = async (plants) => {

// user seed data

  const users = [
     {
       name: 'Test User 1',
       email: 'one@one.com',
       passwordDigest: bcrypt.hashSync('chicken', 10),
       plants: plants[0],
     },
     {
       name: 'Test User 2',
       email: 'two@two.com',
       passwordDigest: bcrypt.hashSync('chicken', 10),
       // need to know plant IDs first!
     },
   ];


  try {

    await User.deleteMany(); // clear the collection! .destroy_all

    await User.create( users ); // TODO: no reservations!

    // const createdUsers = await User.find().populate('user.plant');
    const createdUsers = await User.find().populate('plants');

    return createdUsers;

  } catch(err) {
    console.log('Error creating users', err);
  }

}; // createUsers

















//
//
// const createPlants = async () => {
//   try {
//
//       // 1. Empty the plant collection (table), just like Rails plant.destroy_all
//       await Plant.deleteMany();
//
//       // 2. Insert the new plants
//       await Plant.create( plants ); // array of plants
//
//       const plantResults = await Plant.find();
//       console.log('plants', plantResults);
//
//       return plantResults; // this will be the resolved promise value of this async function
//
//     } catch(err){
//       console.log('Error finding plants:', err);
//     }
//
//     console.log ('Done')
//     process.exit(0); // quit program
//
//
// }//create plants
