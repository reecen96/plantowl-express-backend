const Plant = require('../models/Plant');

module.exports = {

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


  async createData( req, res ){
    res.header('Access-Control-Allow-Origin', "*")


    console.log('POST plant data', req.params);
    // console.log('res.data', res)
    console.log('formdata', req.body);
    console.log('moisture:', parseInt(req.body.moisture));
    console.log('temperature:', parseInt(req.body.temperature));
    console.log('watered:', parseInt(req.body.watered));


    // const f = await Flight.find({ criteria });
    // f.update( { fields } )
    const newData = {
      moisture: parseInt(req.body.moisture),
      temperature: parseInt(req.body.temperature),
      watered: parseInt(req.body.watered)
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

  }, // createReservation

  };
