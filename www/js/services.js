angular.module('starter.services', [])

.service('LoginService', ['$http', function ($http, $scope, $window) {
    this.checkUrl = function() {
        //TODO
    };

    this.getUserToken = function(pw) {
        var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
        ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
         ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
         ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
         ref.addEventListener('exit', function(event) { alert(event.type); });
        //var ref = window.open('https://moodle.ufsc.br/login/index.php?' , '_system', 'location=no');   
        console.log(ref);

        //var url = window.localStorage['url'] + '/login/token.php';
        /*
        var username = window.localStorage['username'];
        return $http({
                      url: url,
                      method: "GET",
                      params: {username: username,
                               password: pw,
                               service: "moodle_mobile_app"}

                });
        */
    };
}])

.service('SessionsService', ['$http', function ($http, $scope) {
    this.getSessions = function(_userid) {
        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "dc6d0690f70a922ea6350e4e6a31d201",
                               wsfunction: "mod_wsattendance_get_courses_with_today_sessions",
                               moodlewsrestformat: "json",
                               userid: _userid}

                });
    };

    this.getSession = function (_sessionid) {
        return $http({
                      url: "http://107.170.117.157/moodle29/webservice/rest/server.php",
                      method: "GET",
                      params: {wstoken: "dc6d0690f70a922ea6350e4e6a31d201",
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
                          wstoken: "dc6d0690f70a922ea6350e4e6a31d201",
                          wsfunction: "mod_wsattendance_take_attendance"
                      },
                      data: data_as_string
                      });
    };
}])