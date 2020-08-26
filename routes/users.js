
const express = require('express');
const User = require('../models/user');
const passport = require('passport');             // Use Passport middleware to handle local authorization on server
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();

// GET users listing
router.get('/',cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {          // Allow only admins to get to this path
  User.find()                                         
    .then((users) => {                                    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);                                      // res.json returns the actual data            
    })
    .catch(err => next(err));                               
});

// Add support for new endpoints (HTTP request + filpath)
// This endpoint allows new users to register on website's filepath users/signup by creating new username/password
router.post('/signup',cors.corsWithOptions (req, res) => {                // Post request. 1st arg: filepath; 2nd arg: middleware callback fxn
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, user) => {
      if (err) {                                                                // If there's an error internatlly, like there's somethign wrong with DB config
        res.statusCode = 500;                                                   // 500 = internal server error
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
        });
      }
    }
  );
});

// Use Passport middleware to handle POST request to this login filepath
router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout',cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
      const token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router; 