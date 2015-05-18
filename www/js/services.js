angular.module('starter.services', [])

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.factory('GetSessionsService', function($q) {
    var sessions = [{
      id: 1,
      name: "Session1",
      courseName: "Grafos"
    }, {
      id: 2,
      name: "Session2",
      courseName: "Teoria da computação"
    }, {
      id: 3,
      name: "Session3",
      courseName: "Organização"
    }, {
      id: 4,
      name: "Session4",
      courseName: "Poo1"
    }];

    return {
        getSessions: function() {
            return sessions;
        }
    }
})