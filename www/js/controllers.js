angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('my_sessions', {'id':$scope.data.username});
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('MySessionsCtrl', function($scope, GetSessionsService, $state, $stateParams) {
    $scope.sessions = GetSessionsService.getSessions();
    
    $scope.loadSession = function(sessionid) {
        $state.go('session', {'sessionid': sessionid});
    };

})

.controller('MySessionCtrl', function($scope, GetSessionService, $state, $stateParams) {
    $scope.session = GetSessionService.getSession($stateParams['sessionid']);
})