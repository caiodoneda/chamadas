angular.module('starter.controllers').controller('LoginCtrl', function($scope, SessionsService, $window, $ionicHistory, $state) {
    //window.localStorage['siteUrl'] = 'https://moodle.ufsc.br';
    window.localStorage['siteUrl'] = 'http://caiodoneda.servebeer.com/moodle29';
    
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });

    $scope.login = function() {
        var passport = Math.random() * 1000;
        
        url = window.localStorage['siteUrl'] + '/local/mobile/launch.php?service=local_mobile&passport=' + passport;
        
        var ref = window.open(url, '_blank');
        ref.addEventListener('loadstop', function(event) { 
            if (event.url.match('token')) {
                returnUrl = event.url.replace('moodlemobile://token=', '');
                params = window.atob(returnUrl).split(':::');
                window.localStorage['token'] = params[1];
                ref.close();
            }
        });
        
        ref.addEventListener('exit', function(event) {
            $state.go('my_sessions');
        });
    }
})