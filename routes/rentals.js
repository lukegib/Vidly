const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const Fawn = require('fawn');

Fawn.init(mongoose);

//crud commands
router.post('/', auth, async(req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return req.status(400).send("Invalid genre!");

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return req,status(400).send("Movie not in database");

    if (movie.inStock === 0) return res.status(400).send('Movie not in stock.');

    const newRental = new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        dateOut: req.body.dateOut,
        dateReturned: req.body.dateReturned,
        rentalFee: req.body.rentalFee 
        
    })
    
    try{
        new Fawn.Task()
            .save('rentals', newRental)
            .update('movies', {_id: movie._id}, {$inc: {inStock: -1}})
            .run()

        res.send(newRental)
    }
    catch(err){
        res.send("woopsy");
    }
    
})

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
  
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  
    res.send(rental);
});


module.exports = router;