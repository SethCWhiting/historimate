'use strict';

/**
 * @ngdoc function
 * @name historimateApp.controller:ManageCtrl
 * @description
 * # ManageCtrl
 * Controller of the historimateApp
 */
angular.module('historimateApp')
  .controller('ManageCtrl', function ($scope, $http, $cookieStore, $route, locations) {

    $scope.goHome = function() {
      $scope.mode = 'show-timelines';
      $scope.selectedTimeline = {};
    };


    // TIMELINES -----------------------------------------------

    $http.get('/api/timelines').success(function(res) {
      $scope.timelines = res;
    });

    $scope.selectedTimeline = {};
    $scope.mode = 'show-timelines';

    $scope.newTimeline = function() {
      $scope.mode = 'create-timeline';
      $scope.selectedTimeline = {};
    };

    $scope.editTimeline = function(tl) {
      $scope.mode = 'edit-timeline';
      $scope.selectedTimeline = tl;
      $scope.getEvents();
    };

    $scope.singleTimeline = {};
    $scope.createTimeline = function() {
      $scope.singleTimeline.creator = $cookieStore.get('userID');
      $http.post('/api/timelines', $scope.singleTimeline).then(
        function(res) {
          var selected = $cookieStore.get('selectedTimelines');
          if (selected === undefined) {
            $cookieStore.put('selectedTimelines', res.data);
          } else {
            $cookieStore.put('selectedTimelines', selected + ',' + res.data);
          }
        },
        function(err) {
          console.log(err);
        }
      );
      $route.reload();
    };

    $scope.updateTimeline = function() {
      $http.put('/api/timelines/' + $scope.selectedTimeline.id, $scope.selectedTimeline);
      $route.reload();
    };

    $scope.deleteTimeline = function() {
      $scope.selectedTimeline.deletedAt = new Date();
      $http.put('/api/timelines/' + $scope.selectedTimeline.id, $scope.selectedTimeline);
      $route.reload();
    };


    // EVENTS --------------------------------------------------

    $scope.getEvents = function() {
      $http.get('/api/correlations/timelines/' + $scope.selectedTimeline.id).success(
        function(res) {
          $scope.events = res;
        }
      );
    };

    $scope.getLocations = function() {
      if ($scope.singleEvent.location) {
        locations.getLocations($scope.singleEvent.location).then(function(res) {
          $scope.eventLocations = res.data.results;
        });
      } else {
        $scope.eventLocations = '';
      }
    };

    $scope.setLoc = function(loc) {
      $scope.singleEvent.location = loc;
      $scope.eventLocations = '';
    };

    $scope.editEvent = function(ev) {
      $scope.mode = 'edit-event';
      $scope.selectedEvent = ev;
      $scope.selectedEvent.date = new Date(ev.date);
    };

    $scope.newEvent = function() {
      $scope.mode = 'create-event';
      $scope.selectedEvent = {};
    };

    $scope.singleEvent = {};
    $scope.singleCorrelation = {};
    $scope.createEvent = function() {
      $scope.singleEvent.creator = $cookieStore.get('userID');
      $scope.singleCorrelation.timeline = $scope.selectedTimeline.id;
      $scope.singleCorrelation.creator = $cookieStore.get('userID');
      $http.post('/api/events', $scope.singleEvent).then(
        function(res) {
          $scope.singleCorrelation.event = res.data;
          $http.post('/api/correlations', $scope.singleCorrelation).then(
            function(res) {
              return res;
            },
            function(err) {
              console.log(err);
            }
          );
        },
        function(err) {
          console.log(err);
        }
      );
      $route.reload();
    };

    $scope.updateEvent = function() {
      $http.put('/api/events/' + $scope.selectedEvent.id, $scope.selectedEvent);
      $route.reload();
    };

    $scope.deleteEvent = function() {
      $scope.selectedEvent.deletedAt = new Date();
      $http.put('/api/events/' + $scope.selectedEvent.id, $scope.selectedEvent);
      $route.reload();
    };

  });
