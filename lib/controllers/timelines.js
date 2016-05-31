'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    mongoUri = "mongodb://127.0.0.1:27017/historimate",
    timelines;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('timelines', function(er, c) {
    return timelines = c;
  });
});

exports.index = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('timelines', function(er, c) {
      return c.find({deletedAt: null}).toArray(function(err, timelines) {
        timelines = _.map(timelines, function(item) {
            return {
              id: item._id,
              title: item.title,
              correlations: item.correlations,
              creator: item.creator,
              editors: item.editors,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(timelines);
      });
    });
  });
};

exports.create = function(req, res) {
  var timeline;
  timeline = {
    title: req.body.title,
    correlations: req.body.correlations,
    creator: req.body.creator,
    editors: req.body.editors,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return timelines.insert(timeline, function(err) {
    return res.send(timeline._id, 200);
  });
};

exports.edit = function(req, res) {
  var timeline, id;
  id = req.params.id;
  timeline = {
    _id: ObjectId(id),
    title: req.body.title,
    correlations: req.body.correlations,
    creator: req.body.creator,
    editors: req.body.editors,
    createdAt: req.body.createdAt,
    updatedAt: new Date(),
    deletedAt: req.body.deletedAt
  };
  return timelines.save(timeline, function(err) {
    return res.send(200);
  });
};
