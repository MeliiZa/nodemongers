const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors"); //importing my own cors file, not the npm module cors
const user = require("../models/user");
​
const favoriteRouter = express.Router();
​
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //the .options handles preFlight Requests (see OneNote - CORS notes).  This is how the server tells the client what kind of requests it's willing to Accept
  .get(cors.cors, (req, res, next) => {
    Favorite.find()
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {
      //once we find a matching user then do the following:
      if (favorites) {
        //iterate through user's favorites and if favorite is new then add new favorite
        req.body.forEach((i) => {
          if (!favorites.campsites.includes(i._id)) {
            favorites.campsites.push(i_id);
          }
        });
        favorites
          .save() //might not be necessary with new versions of mongoose
          .then((favorites) => {
            console.log("Favorites Updated ", favorites);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
          })
          .catch((err) => next(err));
      } else {
        Favorite.create({ user: req.user._id, campsites: req.body })
          .then((favorites) => {
            console.log("Favorites Created ", favorites);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
          })
          .catch((err) => next(err));
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorite");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorites) => {
        favorites.remove(); //remove all of the favorites for the user
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  });
​
favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on a campsiteId of a favorite");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      //once we find a matching user then do the following:
      if (favorite) {
        if (!favorite.campsites.includes(req.params.campsiteId)) {
          //push new campsite as a favorite
          favorite.campsites.push(req.params.campsiteId); //this is actually pushing the id into the database right here
          favorite
            .save() //might not be necessary with new versions of mongoose
            .then((favorite) => {
              console.log("Favorites Updated ", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end("That campsite is already in the list of favorites!"); //res.end returns at this point
        }
      } else {
        Favorite.create({ user: req.user._id, campsites: req.params.campsiteId })
          .then((favorite) => {
            console.log("Favorites Created ", favorite);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => next(err));
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on a campsiteId of a favorite");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index >= 0) {
            favorite.campsites.splice(index, 1);
          }
          favorite
            .save()
            .then((favorite) => {
              Favorite.findById(favorite._id).then((favorite) => {
                console.log("Favorite Campsite Deleted!", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              });
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        }
      })
      .catch((err) => next(err));
  });
​
module.exports = favoriteRouter;

