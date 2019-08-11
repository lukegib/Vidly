const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer')

router.post('/', auth, async(req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);


    const newCustomer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })

    await newCustomer.save();
    console.log(`Saved!\n`);
    res.send(newCustomer);

})

router.get('/', async(req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
})

router.get('/:id', async(req, res) => {
    
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("That ID does not exist!");
    
    res.send(customer);
})

router.put('/:id', async(req, res) => {
    let result = validate(req.body); 
    if (result.error) return res.status(400).send("Invalid Input"); 

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold, 
        name: req.body.name, 
        phone: req.body.phone
    }, { new: true});
    
    if(!customer) return res.status(404).send("That ID does not exist!");

    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(404).send("That ID does not exist!");
    
    res.send("Deleted it!");
})

module.exports = router;