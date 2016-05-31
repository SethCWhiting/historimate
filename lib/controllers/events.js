'use strict';

var _ = require('underscore'),
    mongo = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    mongoUri = "mongodb://127.0.0.1:27017/historimate",
    events;

mongo.connect(mongoUri, function(err, db) {
  return db.collection('events', function(er, c) {
    return events = c;
  });
});

exports.index = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('events', function(er, c) {
      return c.find({deletedAt: null}).toArray(function(err, events) {
        events = _.map(events, function(item) {
            return {
              id: item._id,
              date: item.date,
              location: item.location,
              title: item.title,
              source: item.source,
              correlations: item.correlations,
              creator: item.creator,
              editors: item.editors,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res.send(events);
      });
    });
  });
};

exports.correlated = function(req, res) {
  mongo.connect(mongoUri, function(err, db) {
    return db.collection('events', function(er, c) {
      return c.find({ deletedAt: null, _id: { $in: req } }).toArray(function(err, events) {
        events = _.map(events, function(item) {
            return {
              id: item._id,
              date: item.date,
              location: item.location,
              title: item.title,
              source: item.source,
              correlations: item.correlations,
              creator: item.creator,
              editors: item.editors,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
        });
        return res(events);
      });
    });
  });
};

exports.create = function(req, res) {
  var event;
  event = {
    date: req.body.date,
    location: req.body.location,
    title: req.body.title,
    source: req.body.source,
    correlations: req.body.correlations,
    creator: req.body.creator,
    editors: req.body.editors,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  return events.insert(event, function(err) {
    return res.send(event._id, 200);
  });
};

exports.edit = function(req, res) {
  var event, id;
  id = req.params.id;
  event = {
    _id: ObjectId(id),
    date: req.body.date,
    location: req.body.location,
    title: req.body.title,
    source: req.body.source,
    correlations: req.body.correlations,
    creator: req.body.creator,
    editors: req.body.editors,
    createdAt: req.body.createdAt,
    updatedAt: new Date(),
    deletedAt: req.body.deletedAt
  };
  return events.save(event, function(err) {
    return res.send(200);
  });
};
