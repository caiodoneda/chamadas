angular.module('starter.controllers').controller('SessionNotFound', function($scope, $ionicHistory, $window, $state) {
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });

    $scope.goBack = function() {
        $state.go('my_sessions');
    }
})
