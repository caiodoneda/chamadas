angular.module('starter.controllers').controller('LoginCtrl', function($scope, SessionsService, $window, $ionicHistory, $state) {
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });

    var isLoggedIn = false;

    //window.localStorage['token'] = 'ae3df09049bd1de701fabad9a8d6f059';

    if ( 'token' in window.localStorage) {
        if (Boolean (window.localStorage['token'])) {
            //Verificando se o token ainda é válido.
            $service = SessionsService.getSiteInfo();
            $service.then(function(resp) {
                message = 'token expired';
                console.log(resp.data.errorcode);

                if (resp.data.errorcode == 'invalidtoken') {
                    window.localStorage['token'] = '';
                } else {
                    $state.go('my_sessions');
                }
            }, function(err) {});

            //$state.go('my_sessions');
        }
    }

    $scope.login = function() {
        var passport = Math.random() * 1000;
        url = window.localStorage['siteUrl'] + '/local/mobile/launch.php?service=local_mobile&passport=' + passport;
        var ref = window.open(url, '_blank', 'hidden=yes');

        ref.addEventListener('loadstart', function(event) {
            if (event.url.match('sistemas.ufsc.br') || event.url.match('caio')) {
                ref.show();
            }
        });

        ref.addEventListener('loadstop', function(event) {
            if (event.url.match('token')) {
                returnUrl = event.url.replace('moodlemobile://token=', '');
                params = window.atob(returnUrl).split(':::');
                window.localStorage['token'] = params[1];
                isLoggedIn = true;
                ref.close();
            }
        });

        ref.addEventListener('exit', function(event) {
            if (isLoggedIn) {
                $service = SessionsService.getSiteInfo();
                $service.then(function(resp) {
                    data = (angular.fromJson(resp.data));
                    window.localStorage['userid'] = data.userid;
                    window.localStorage['username'] = data.username;
                    $state.go('my_sessions');
                }, function(err) {});
            }
        });
    }
})
