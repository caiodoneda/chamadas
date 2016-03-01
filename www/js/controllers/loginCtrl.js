angular.module('starter.controllers').controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicHistory, $window) {
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });
    
    $scope.errors = {};
    $scope.data = {};
    $scope.data.url = 'http://caiodoneda.servebeer.com/moodle29';
    $scope.data.username = window.localStorage['username'] || '';
    $scope.data.password = '';


    $scope.login = function() {
        var passport = Math.random() * 1000;
        url = 'https://moodle.ufsc.br/local/mobile/launch.php?service=local_mobile';
        url += '&passport=' + passport
        var ref = window.open(url, '_blank', 'location=yes');
        ref.addEventListener('loadstart', function(event) { 
            alert(event.url); 
        });
        ref.addEventListener('loadstop', function(event) { 
                alert(event.url);
        });
        // window.localStorage['url'] = $scope.data.url;
        // window.localStorage['username'] = $scope.data.username;
        // $service = LoginService.checkUrl(); 
        // $service.then(function(resp) {
        //     $service = LoginService.getUserToken($scope.data.password);
        //     $service.then(function(resp) {
        //         if (resp.data.error) {
        //             alert('Problemas de identificação, verifique suas credenciais!');
        //         } else {
        //             window.localStorage['token'] = resp.data.token;
        //             $state.go('my_sessions');
        //         }
        //     });
        // }, function(err) {
        //     $window.alert("URL Inválida!");
        // });
    }
})