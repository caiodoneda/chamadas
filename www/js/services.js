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

.service('SessionsService', ['$http', function ($http, $scope) {
    this.getSessions = function(_userid) {
        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "13453d8ad6a8ead45113c33c56bee530",
                               wsfunction: "mod_wsattendance_get_courses_with_today_sessions",
                               moodlewsrestformat: "json",
                               userid: _userid}

                });
    };

    this.getSession = function (_sessionid) {
        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "13453d8ad6a8ead45113c33c56bee530",
                               wsfunction: "mod_wsattendance_get_session_info",
                               moodlewsrestformat: "json",
                               sessionid: _sessionid}

                });
    };

    this.takeAttendance = function (_users, _session_info) {
        //Moodle  does not support JSON parameters as input.
        data_as_string = 'session=' + _session_info +'&students='+ _users;

        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "POST",
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                      },
                      params: {
                          wstoken: "13453d8ad6a8ead45113c33c56bee530",
                          wsfunction: "mod_wsattendance_take_attendance"
                      },
                      data: data_as_string
                      });
    };
}])