angular.module('starter.controllers').service('SessionsService', ['$http', function ($http, $scope) {
    this.getSiteInfo = function() {
        var url = window.localStorage['siteUrl'] + '/webservice/rest/server.php';
        return $http({
                      url: url,
                      method: "GET",
                      params: {wsfunction: "core_webservice_get_site_info",
                               wstoken: window.localStorage['token'],
                               moodlewsrestformat: "json"}

        });
    };

    this.getSessions = function(_userid) {
        var url = window.localStorage['siteUrl'] + '/webservice/rest/server.php';
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
        var url = window.localStorage['siteUrl'] + '/webservice/rest/server.php';
        return $http({
                      url: url,
                      method: "GET",
                      params: {wstoken: window.localStorage['token'],
                               wsfunction: "mod_wsattendance_get_session",
                               moodlewsrestformat: "json",
                               sessionid: _sessionid}

        });
    };

    this.updateUserStatus = function (sessionid, studentid, takenbyid, statusid, statusset, rfid) {
        var url = window.localStorage['siteUrl'] + '/webservice/rest/server.php';
        //Moodle  does not support JSON parameters as input.
        data_as_string = 'sessionid=' + sessionid + '&studentid=' + studentid + '&takenbyid=' + takenbyid + '&statusid=' + statusid + '&statusset=' + statusset + '&rfid=' + rfid;

        return $http({
                      url: url,
                      method: "POST",
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                      },
                      params: {
                          moodlewsrestformat: "json",
                          wstoken: window.localStorage['token'],
                          wsfunction: "mod_wsattendance_update_user_status"
                      },
                      data: data_as_string
                      });
    };
}])
