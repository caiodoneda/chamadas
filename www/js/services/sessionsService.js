angular.module('starter.controllers').service('SessionsService', ['$http', function ($http, $scope) {
    this.getSiteInfo = function() {
        var url = window.localStorage['url'] + '/webservice/rest/server.php';
        return $http({
                      url: url,
                      method: "GET",
                      params: {wsfunction: "core_webservice_get_site_info",
                               wstoken: window.localStorage['token'],
                               moodlewsrestformat: "json"}

        });
    };

    this.getSessions = function(_userid) {
        var url = window.localStorage['url'] + '/webservice/rest/server.php';
        return $http({
                      url: url,
                      method: "GET",
                      params: {wstoken: window.localStorage['token'],
                               wsfunction: "mod_wsattendance_get_courses_with_today_sessions",
                               moodlewsrestformat: "json",
                               userid: _userid}

        });
    };

    this.getSession = function (_sessionid) {
        var url = window.localStorage['url'] + '/webservice/rest/server.php';
        return $http({
                      url: url,
                      method: "GET",
                      params: {wstoken: window.localStorage['token'],
                               wsfunction: "mod_wsattendance_get_session_info",
                               moodlewsrestformat: "json",
                               sessionid: _sessionid}

        });
    };

    this.takeAttendance = function (_users, _session_info) {
        var url = window.localStorage['url'] + '/webservice/rest/server.php';
        //Moodle  does not support JSON parameters as input.
        data_as_string = 'session=' + _session_info +'&students='+ _users;

        return $http({
                      url: url,
                      method: "POST",
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                      },
                      params: {
                          wstoken: window.localStorage['token'],
                          wsfunction: "mod_wsattendance_take_attendance"
                      },
                      data: data_as_string
                      });
    };
}])