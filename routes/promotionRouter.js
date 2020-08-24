// This is the Express router for /promotions and /promotions/:promotionId

const express = require('express');                 // Import needed node modules
const bodyParser = require('body-parser');
const Promotion = require('../models/promotion');   // Import promotion.js file
const authenticate = require('../authenticate');

const promotionRouter = express.Router();           // Practically-speaking, it's better to use promotionsRouter (PLURAL) rather than singular

promotionRouter.use(bodyParser.json());             // To use JSON data, you need to be able to parse it, and you can do that using JSON body-parser

// Add support/instructions for 4 endpoints (HTTP request + path) made to /promotion path (for ALL promo docs in Promo collection):
promotionRouter
.route('/')                                                     // The route for this endpoint is defined in app.js         
.get((req, res, next) => {                                      // If we receive a GET request from the HTTP client, then do the following...
    Promotion.find()                                            // Promotion is the Model and .find is a Mongoose method which allows us to find all promo docs created via Promotion Model                 
    .then(promotions => {                                    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);                                
    })
    .catch(err => next(err));                                   // Handle any errors with this HTTP GET request
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                                     // When we receive a POST request, then do the following...
    Promotion.create(req.body)                                  // This method creates a new Promotion doc
    .then(promotion => {                                     
        console.log('Partner Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');        // We do not allow this on the entire collection bc allowing it would mean that if we made an update to a name field, this would apply to ALL documents in Model
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {                                
    Promotion.deleteMany()                                        // This method would delete all promotion docs in collection
    .then(response => {                                      
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Add support for 4 endpoints (HTTP request + path) made to /promotions/:promotionId (SINGULAR) path on MongoDB server
promotionRouter
.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)                            
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {           // Find and update a specific promo doc
        $set: req.body                                              // $set allows us to update a specific doc we found based on req.body
    }, { new: true })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Export all the above routes through (everything at /partners route) router so it can be used elsewhere in app
module.exports = promotionRouter;