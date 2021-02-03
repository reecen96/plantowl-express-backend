// Main express server file
const express = require('express');
const app = express();
//cors
var cors = require('cors')
app.use(cors())
//JSON parser
var bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
//declairing port
const PORT = process.env.PORT || 3000;
//socket.io
const http = require("http");
const socketIo = require("socket.io");
//importing plantscontroller
const plantsController = require('./controllers/plantsController');
//requiring mongoose
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // to send back a signed token to the frontend as proof of login
const jwtAuthenticate = require('express-jwt');



// // Create a handler function that we give to any route that is protected,
// // i.e. a route that you must be logged-in to se
const checkAuth = () => {
  return jwtAuthenticate({
    secret: SERVER_SECRET_KEY, // use the same secret key to check the token hasn't been tampered with,
    algorithms: ['HS256']
  });
}; // checkAuth

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.json())



const bcrypt = require('bcrypt'); // to encrypt & compare passwords
const SERVER_SECRET_KEY = 'yourSecretKey'

// Load our model file
const Plant = require('./models/Plant');
const User = require('./models/User');


console.log(process.env.MONGO_URI)
// Connect to the DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


//------------------socket.io-----------------//
const server = http.createServer(db);
const io = socketIo(db);

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

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};




//-----------controller routes--------//
app.get('/plants', plantsController.index  );

app.get('/plants/:id', checkAuth(),plantsController.show );

app.post('/plants/:id/data', plantsController.createData );

app.post('/register', plantsController.createUser );

app.post('/login', plantsController.login );



// // Example of a protected route that requires an authentication token
app.get('/profile', checkAuth(),  (req, res) => {
  // checkAuth provides req.user when the token is valid
  console.log('Profile access allowed for authenticated user', req.user);
  res.json( req.user );
});
//
//Authentication error
app.use( (err, req, res, next) => {
  if( err.name === 'UnauthorizedError' ){
    console.log('Unauthorised request', req.path);
    res.status(401).json({ error: 'Invalid token' });
  } else {
    res.json(404); // generic "not found" response
  }
});



// curl -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDE5ZjNmYWY2YmRkZTJhNGRiNzY2MTMiLCJuYW1lIjoiVGVzdCBVc2VyIDEiLCJlbWFpbCI6Im9uZUBvbmUuY29tIiwiaWF0IjoxNjEyMzE1MzA3LCJleHAiOjE2MTI1NzQ1MDd9.OUkKT1ylp6IWin0VrLO0qWXw0EGTP_8obDJPRPPK0xY' http:/localhost:3000/plants/6019fd51ca3eb52c7acd71ed
