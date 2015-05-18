angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('my_courses');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('MyCoursesCtrl', function($scope, GetCoursesService, $state) {
    $scope.my_courses = GetCoursesService.getCourses();
    
    $scope.chooseSession = function() {
      $state.go('my_sessions');
    };

    $scope.my_sessions = GetCoursesService.getSessions();
})