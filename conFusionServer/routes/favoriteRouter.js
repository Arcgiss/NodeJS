const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');


const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Favorites.find({})
   .populate('comments.author')
   .then((dishes) => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(dishes);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Favorites.create(req.body)
   .then((dish) => {
       console.log('Favorites Created ', dish);
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(dish);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Favorites.remove({})
   .then((resp) => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));  
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Favorites.findById(req.params.dishId)
   .populate('comments.author')
   .then((dish) => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(dish);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   res.statusCode = 403;
   res.end('POST operation not supported on /favorites/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Favorites.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
  }, { new: true })
  .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Favorites.findByIdAndRemove(req.params.dishId)
   .then((resp) => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});


module.exports = favoriteRouter;