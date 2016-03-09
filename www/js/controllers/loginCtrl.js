angular.module('starter.controllers').controller('LoginCtrl', function($scope, SessionsService, $window, $ionicHistory, $state) {
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });

    var isLoggedIn = false;
    
    if ( 'token' in window.localStorage) {
        if (Boolean (window.localStorage['token'])) {
            $state.go('my_sessions');
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
                $state.go('my_sessions');
            }
        });
    }
})