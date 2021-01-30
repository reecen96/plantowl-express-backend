
const MongoClient = require('mongodb')

let db;

MongoClient.connect('mongodb://127.0.0.1:27017',
{useNewUrlParser: true, useUnifiedTopology: true },
(err, client) => {

  //check for errors
  if( err ){
    console.log( 'Error connecting to MongoDB!', err )
    process.exit( 1 ); // non zero error code
  }

  db = client.db('ba');
  console.log('connected! Using db: "ba" ')

  insertPlants();


}
); //connect


const insertPlants = () => {

  db.collection('plants').insertMany( [
    {
      plant_name: 'Fern',
      plant_date: new Date('2021-10-01T04:20:00Z'),
      data: [
        { moisture: 70, temperature: 24, watered: 0, data_date: new Date('2021-10-0104:30:00Z')},
        { moisture: 68, temperature: 21, watered: 0, data_date: new Date('2021-11-0104:30:00Z')},
        { moisture: 67, temperature: 20, watered: 1, data_date: new Date('2021-12-0104:30:00Z')},
      ] // reservations
    }, // first plant
  ],
  (err, result) => {

    if( err ) return console.log('Error adding plants', err);

    console.log(`Success! Added ${ result.insertedCount } plants`);

    printPlants();


  }); // insertMany


}; // insetPlants


const printPlants = () => {

  // Flight.find();

  db.collection('plants').find().toArray( (err, plants) => {

    if( err ) return console.log('Error finding plants', err);

    console.log('Plants:', plants);
    debugger;
    // pause in debugger: only works if you run this file
    // through ndb: ./node_modules/.bin/ndb seeds-flights

    process.exit(0); // Finished! Quit the program with a success code


  }); // find plants

}; // printPlants
