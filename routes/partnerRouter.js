// This is the Express router for /partners and /partners/:partnerId

const express = require('express');                 // Import needed node modules
const bodyParser = require('body-parser');
const Partner = require('../models/partner');       // Import partner.js file
const authenticate = require('../authenticate');

const partnerRouter = express.Router();             // Practically-speaking, it's better to use partnersRouter rather than singular

partnerRouter.use(bodyParser.json());               // To use JSON data, you need to be able to parse it, and you can do that using JSON body-parser

// Add support for 4 endpoints for /partner path (ALL partner docs in partner collection):
partnerRouter
.route('/')                                                     // The route for this endpoint is defined in app.js         
.get((req, res, next) => {                                      // If we receive a GET request from the HTTP client, then do the following...
    Partner.find()                                              // Partner is the Model and .find is a Mongoose method which allows us to find all partner docs created via Partner Model                 
    .then(partners => {                                    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);                                
    })
    .catch(err => next(err));                                   // Handle any errors with this HTTP GET request
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                                     // When we receive a POST request, then do the following...
    Partner.create(req.body)                                    // This method creates a new Partner doc
    .then(partner => {                                     
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {                                            // This is an update request
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');        // We do not allow this on the entire collection bc allowing it would mean that if we made an update to a name field, this would apply to ALL documents in Model
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                                
    Partner.deleteMany()                                        // This method would delete all partner docs in collection
    .then(response => {                                      
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Add support for 4 endpoints for requests made to /partners/:partnerId (SINGULAR) path on MongoDB server
partnerRouter
.route('/:partnerId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)                            
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {               // Find and update a specific partner doc
        $set: req.body                                              // $set allows us to update specific doc we found based on req.body
    }, { new: true })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Export all the above routes through (everything at /partners route) router so it can be used elsewhere in app
module.exports = partnerRouter;