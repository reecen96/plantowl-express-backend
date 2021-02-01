// Main express server file

const express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
const app = express();
app.use(cors())
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;

const plantsController = require('./controllers/plantsController');
const mongoose = require('mongoose');


// parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// Load our model file
const Plant = require('./models/Plant');

// Connect to the DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('Connection error', err);
});

// Once the connection is established, we can start querying/seeding
db.once('open', async () => {


//once the db is connected, we can start accepting HTTP requests
  app.listen(PORT, () => {
    console.log(`Plant Owl server listening on http://localhost:${PORT}`);
  });

}); //db.once open


// app.get('/plants', async (req, res) => {
//
//   // Plant.find()
//   // .then( (plants) => {
//   //   res.json( plants );//send the result of the query
//   // })
//   // .catch( console.warn )
//   // res.json( {message: 'hello' } );
//   try{
//   const plants = await Plant.find();
//   res.json( plants );
// } catch(err){
//   console.log('ERROR querying DB for plants', err)
//   res.sendStatus( 500 )
// }
// }); //GET /flights



//
// const server = app.listen(PORT, () => {
//   console.log(`BA server listening on http://localhost:${PORT} ...`);
// });
//
//
// // Now this server.js looks a lot like a Rails routes.rb file!
//

app.get('/plants', plantsController.index  );

app.get('/plants/:id', plantsController.show );

app.post('/plants/:id/data', plantsController.createData );
