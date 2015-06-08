angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicHistory) {
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });

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

.controller('MySessionsCtrl', function($scope, SessionsService, $state, $stateParams) {
    $service = SessionsService.getSessions();
    $service.then(function(resp) {
        $scope.courses_with_sessions = (angular.fromJson(resp.data));
        console.log($scope.courses_with_sessions);
    }, function(err) {
        $window.alert("Não foi possível obter as sessões do dia: \n \n =(");
    });    

    $scope.loadSession = function(moduleid, session) {
        $state.go('session', {'moduleid': moduleid, 'sessionid': session.id, 
                              'groupid': session.groupid});
    };

})

.controller('MySessionCtrl', function($scope, SessionsService, $state, $stateParams, $ionicModal) {
    $service = SessionsService.getSession($stateParams['moduleid'], $stateParams['sessionid'], $stateParams['groupid']);
    $service.then(function(resp) {
        $scope.session = (angular.fromJson(resp.data));
        console.log($scope.session);
    }, function(err) {
        $window.alert("Não foi possível obter esta sessão: \n \n =(");
    }); 


    $ionicModal.fromTemplateUrl('status-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.openModal = function(user) {
        $scope.modal.show();
        $scope.currentUser = user;
    };
    
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.changeStatus = function(status) {
        $scope.currentUser.status = status;
        $scope.currentUser = null;
        $scope.closeModal();
    };
})