const Plant = require('../models/Plant');
const User = require('../models/User');
const Server = require('../server');
const bcrypt = require('bcrypt'); // to encrypt & compare passwords
const SERVER_SECRET_KEY = 'yourSecretKey'
const jwt = require('jsonwebtoken'); // to send back a signed token to the frontend as proof of login

module.exports = {



  async login(req, res){
    res.header('Access-Control-Allow-Origin', "*")
    console.log('LOGIN', req.body);
      console.log( req.body)
      const { email, password } = req.body;

      try {

        const user = await User.findOne({ email });   // { email: email }

        // console.log('passwords', user, password, user.passwordDigest); // debug!

        if( user && bcrypt.compareSync(password, user.passwordDigest) ){
          // Credentials match - successful login

          // Create a signed JWT token to send as the response;
          // The frontend will have to store this token, and present it in the header
          // of any future AJAX requests for them to count as authenticated to this server;
          // The token also encodes the authenticated user's ID; the token can actually
          // be decoded and viewed by anyone, but not changed without breaking it.
          console.log('LOGIN SUCCESSFUL for', user.name)
          const token = jwt.sign(
            // The data to encode into the token: don't put too much in here,
            // since it gets sent in a header of all future AJAX requests from the frontend!
            {
              _id: user._id,
              name: user.name,
              email: user.email
            },
            SERVER_SECRET_KEY,  // private key used to 'sign' the token
            { expiresIn: '72h' } // expiry time/life of token
          );

          res.json({ user, token });

        } else {
          // No match! Failed login
          res.sendStatus(401); // 401 == Bad Credentials / Authentication Failed
        }

      } catch( err ){
        console.log('Login error', req.body, err);
        res.sendStatus(500);
      }

  //
}, //POST Login
  //





  // index: async function(req, res){
  async index(req, res){

    res.header('Access-Control-Allow-Origin', "*")

    try {
      const plants = await Plant.find();
      res.json( plants );
    } catch( err ){
      console.log('ERROR querying DB for plants', err);
      res.sendStatus( 500 );  // signal to the frontend 'Internal server error'
    }

  }, // index


  async show( req, res ){
    res.header('Access-Control-Allow-Origin', "*")



    const plant = await Plant.findOne({ _id: req.params.id});
    res.json( plant );

  }, // show (i.e. getPlant)



  async createUser( req, res ){
  res.header('Access-Control-Allow-Origin', "*")
  console.log('formdata', req.body);
  console.log('user', req.body.username)
  console.log('password', req.body.password)
  console.log('email', req.body.email)



  const user = {
    user: req.body.username,
    passwordDigest: bcrypt.hashSync(req.body.password, 10),
    email: req.body.email,
  }

console.log(user)
  try {

    // NOTE: use Flight.findOneAndUpdate() if you want to get back the changed document!
    await User.create( user )
    // send the new reservation object back to the frontend,
    // so the seating diagram updates automatically
    res.json( res.data );

    console.log('user created!', User.find().populate('plants'))


  } catch( err ){
    console.log('ERROR saving data', err);
    res.sendStatus(422);  // 'Unprocessable entity'
  } // catch



},

  async createData( req, res ){
    res.header('Access-Control-Allow-Origin', "*")


    console.log('POST plant data', req.params);
    // console.log('res.data', res)
    console.log('formdata', req.body);
    console.log('moisture:', parseInt(req.body.moisture));
    console.log('temperature:', parseInt(req.body.temprature));
    console.log('watered:', parseInt(req.body.watered));
    console.log('waterLevel:', parseInt(req.body.waterLevel));


    // const f = await Flight.find({ criteria });
    // f.update( { fields } )
    const newData = {
      moisture: parseInt(req.body.moisture),
      temperature: parseInt(req.body.temprature),
      watered: parseInt(req.body.watered),
      waterLevel: parseInt(req.body.waterLevel)
    }

    try {

      // NOTE: use Flight.findOneAndUpdate() if you want to get back the changed document!
      const plant = await Plant.updateOne(
        // how to find the document to change:
        { _id: req.params.id },
        // what to change about it:
        {
          $push: { data: newData } //  $push means push to the array, don't overwrite it!
        }
      );

      // send the new reservation object back to the frontend,
      // so the seating diagram updates automatically
      res.json( res.data );

    } catch( err ){
      console.log('ERROR saving data', err);
      res.sendStatus(422);  // 'Unprocessable entity'
    } // catch

  }, // createDate

  };
