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

.factory('GetCoursesService', function($q) {
    var courses = [{
      id: 1,
      name: "Grafos"
    }, {
      id: 2,
      name: "Formais"
    }, {
      id: 3,
      name: "Estatistica"
    }, {
      id: 4,
      name: "POO1"
    }];

    var sessions = [{
      id: 1,
      name: "Session1"
    }, {
      id: 2,
      name: "Session2"
    }, {
      id: 3,
      name: "Session3"
    }, {
      id: 4,
      name: "Session4"
    }];

    return {
        getCourses: function() {
            return courses;
        },
        getSessions: function() {
            return sessions;
        }
    }
})