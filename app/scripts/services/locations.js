'use strict';

/**
 * @ngdoc service
 * @name historimateApp.locations
 * @description
 * # locations
 * Factory in the historimateApp.
 */
angular.module('historimateApp')
  .factory('locations', ['$http', function ($http) {
    return {
      getLocations: function () {
        return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=San+Francisco&key=AIzaSyDf_EG683HO6g3pOdixZ8kY6xYfbdICq3w')
            .success(function(res) {
              console.log('Success: ' + res);
            }).error(function(res) {
              console.log('Error: ' + res);
            });
      }
    };
  }]);
