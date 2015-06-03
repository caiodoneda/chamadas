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

.factory('GetSessionsService', function($q, $http) {
    var sessions = [{
      id: 1,
      name: "Session1",
      courseName: "Grafos",
      time: "10:10 - 12:00",
      date: "18/05/15 (Mon)"
    }, {
      id: 2,
      name: "Session2",
      courseName: "Teoria da computação",
      time: "10:10 - 12:00",
      date: "18/05/15 (Mon)"
    }, {
      id: 3,
      name: "Session3",
      courseName: "Organização",
      time: "10:10 - 12:00",
      date: "18/05/15 (Mon)"
    }, {
      id: 4,
      name: "Session4",
      courseName: "Poo1",
      time: "10:10 - 12:00",
      date: "18/05/15 (Mon)"
    }];


    return {
        getSessions: function() {
            $http.get('http://107.170.117.157/moodle28/webservice/rest/server.php?wstoken=fedd80b24f5296cbd138ab89b57a391a&wsfunction=mod_wsattendance_get_courses_with_sessions&userid=103').then(function(resp) {
              //console.log('Success', resp.data);
              console.log('Success', angular.fromJson(resp));
              // For JSON responses, resp.data contains the result
            }, function(err) {
              console.error('ERR', err);
              // err.status will contain the status code
            })  
            
            //return sessions;
        }
    }
})

.factory('GetSessionService', function($q) {
    var session = [{
      id: 1,
      name: "Session1",
      courseName: "Grafos",
      users: [{id:1, name:"Caio Bressan Doneda", status:"Ausente"}, {id:2, name:"José Norberto Guiz Fernandes Correa", status:"Ausente"}, {id:3, name:"Carlos", status:"Ausente"}]
    }, {
      id: 2,
      name: "Session2",
      courseName: "Teoria da computação",
      users: [{id:1, name:"Caio", status:"Ausente"}, {id:4, name:"Diego", status:"Ausente"}, {id:5, name:"Henrique", status:"Ausente"}]
    }, {
      id: 3,
      name: "Session3",
      courseName: "Organização",
      users: [{id:1, name:"Caio", status:"Ausente"}, {id:2, name:"Alfredo", status:"Ausente"}, {id:3, name:"Carlos", status:"Ausente"}]
    }, {
      id: 4,
      name: "Session4",
      courseName: "Poo1",
      users: [{id:1, name:"Caio", status:"Ausente"}, {id:2, name:"Alfredo", status:"Ausente"}, {id:3, name:"Carlos", status:"Ausente"}]
    }];    
    
    return {
        getSession: function(sessionid) {
            for (var i = 0; i < session.length; i++) {
                  if (session[i].id == sessionid)
                      return session[i];
            }
        }
    }
})