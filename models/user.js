// In this file, we create the Mongoose Schema/Model for all user documents in the Users collection on the DB 

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');           // From Passport middleware to support local authorization in server
const Schema = mongoose.Schema;                 

// Create new Schema for user
const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    }, 
    lastname: {
        type: String, 
        default: ''
    },
    admin: {                            // No longer need to explicitly define username/password bc passport local mongoose will do that for us
        type: Boolean,
        default: false                  // When a new user doc is created, the admin flag will be set to false
    }
});

// Plug in the passport-local-mongoose package plugin
userSchema.plugin(passportLocalMongoose);

// Export the Model from the module
module.exports = mongoose.model('User', userSchema);            // 1st arg must be SINGULAR version of whatever you want the collection name to be; Mongoose will know to name the collection the PLURAL Users
                                                                // 2nd arg is the schema to use for this mdoel, which is userSchema defined in this file above
