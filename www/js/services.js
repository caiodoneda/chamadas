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
                      url: "http://107.170.117.157/moodle28/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "fedd80b24f5296cbd138ab89b57a391a",
                               wsfunction: "mod_wsattendance_get_courses_with_sessions",
                               moodlewsrestformat: "json",
                               userid: "103"}

                });
    };

    this.getSession = function (_attendanceid, _sessionid, _groupid) {
        return $http({
                      url: "http://107.170.117.157/moodle28/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "fedd80b24f5296cbd138ab89b57a391a",
                               wsfunction: "mod_wsattendance_get_session",
                               moodlewsrestformat: "json",
                               attendanceid: _attendanceid,
                               sessionid: _sessionid,
                               groupid: _groupid}

                });
    };

    this.takeAttendance = function (cust) {
        return $http.post(urlBase, cust);
    };
}])