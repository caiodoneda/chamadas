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
    this.getSessions = function() {
        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "bcb1e1bb0fb560963da6220d814120ec",
                               wsfunction: "mod_wsattendance_get_courses_with_sessions",
                               moodlewsrestformat: "json",
                               userid: "103"}

                });
    };

    this.getSession = function (_moduleid, _sessionid, _groupid) {
        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "bcb1e1bb0fb560963da6220d814120ec",
                               wsfunction: "mod_wsattendance_get_session",
                               moodlewsrestformat: "json",
                               moduleid: _moduleid,
                               sessionid: _sessionid,
                               groupid: _groupid}

                });
    };

    this.takeAttendance = function (_users, _sessionid, _takenby, _groupid) {
       return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "POST",
                      params: {wstoken: "bcb1e1bb0fb560963da6220d814120ec",
                               wsfunction: "mod_wsattendance_take_attendance",
                               users: _users,
                               sessionid: _sessionid,
                               takenby: _takenby,
                               grouptype: _groupid}
                });
    };
}])