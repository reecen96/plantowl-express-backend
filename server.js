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


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.json())

// Load our model file
const Plant = require('./models/Plant');

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

app.get('/plants/:id', plantsController.show );

app.post('/plants/:id/data', plantsController.createData );
