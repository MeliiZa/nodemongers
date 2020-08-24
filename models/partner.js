const mongoose = require('mongoose');                   
const Schema = mongoose.Schema;                         

require('mongoose-currency').loadType(mongoose);        

// Create Partner Schema
const partnerSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,              // Boolean data type defaults to false, so you don't need to explicitly state it
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

// Create Model from Schema defined above
const Partner = mongoose.model('Partner', partnerSchema)                

// Export this Partner module
module.exports = Partner;                          