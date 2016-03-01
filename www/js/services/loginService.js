angular.module('starter.controllers').service('LoginService', ['$http', function ($http, $scope) {
    this.checkUrl = function() {
        var url = window.localStorage['url'] + '/login/token.php';
        return $http({
                      url: url,
                      method: "GET",
                      params: {username: "username",
                               password: "pw",
                               service: "local_mobile"}

        });
    };

    this.getUserToken = function(pw) { 
        var url = window.localStorage['url'] + '/login/token.php';
        var username = window.localStorage['username'];
        return $http({
                      url: url,
                      method: "GET",
                      params: {username: username,
                               password: pw,
                               service: "local_mobile"}

        });
    };
}])