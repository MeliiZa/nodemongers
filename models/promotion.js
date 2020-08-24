const mongoose = require('mongoose');                   
const Schema = mongoose.Schema;                         

require('mongoose-currency').loadType(mongoose);    // Import Mongoose Currency LIbrary to use Currency type
var Currency = mongoose.Types.Currency;             // Bring in type from Currency library and assign to variable so we can use it here

// Create Promotion Schema
const promotionSchema = new Schema ({
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
        type: Boolean,              
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Create Model from Schema defined above
const Promotion = mongoose.model('Promotion', promotionSchema)                

// Export this Promotion module
module.exports = Promotion;                          