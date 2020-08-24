// In this file, we define Mongoose Schema and the Model for all documents in our database's campsite collection

const mongoose = require('mongoose');                   // Import Mongoose
const Schema = mongoose.Schema;                         // This just creates shorthand for Schema which makes it easier to reference later on in code

require('mongoose-currency').loadType(mongoose);        // This loads the new curency type into Mongoose so it's avail for Mongoose Schemas to use
const Currency = mongoose.Types.Currency;               // Currency is just created to be shorthand for mongoose.Types.Currency

// Create comment Schema for docs storing comments about a campsite. This will be used to create a subdocument
const commentSchema = new Schema ({
    rating: {
        type: Number, 
        min: 1,                                     // When use use a data type of Number, you can specify the boundaries for it (ex. min, max) 
        max: 5, 
        required: true
    }, 
    text: {
        type: String,
        required: true
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'User'
    }
}, {
    timestamps: true
});

// Create Campsite Schema
const campsiteSchema = new Schema({                 // new Schema method instantiates a new object called campsiteSchema; 1st param is required, 2nd is optional 
    name: {                                         // 1st param (required) is an object that contains the definition for the Schema via the object's properties (name, description)
        type: String,                                       
        required: true, 
        unique: true                                // No 2 docs in this collection shoudl have the same name field
    }, 
    description: {                                  // name and description are the properties of the object that defines the Schema
        type: String, 
        required: true,
    }, 
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]                       // This adds the commentSchema as a SUBDOCUMENT of the campsiteSchema; Setting it as an array will allow every campsite doc to contain multiple comments stored in an array.
}, {                                                // This is the Schema's second param, which is optional
    timestamps: true                                // This causes Mongoose to automatically add two props to this Schema called "created at" and "updated at", and Mongoose will manage these for us
});

// Create Campsite Model using the above Campsite Schema. Model will be used to create new documents in DB
const Campsite = mongoose.model('Campsite', campsiteSchema)                 // This creates a Model named Campsites. 1st arg: capitalized, singular version of the name of the collection yuo want to use for this Model (Mongoose knows to pluralize it when searching for matching collection). 2nd arg: the schema we want to use, which is the campsiteSchema we just created above
                                                                            // mongoose.model creates a constructor function (aka JS ES6 class) which will instantiate documents for MongoDB
module.exports = Campsite;                          // Export this module