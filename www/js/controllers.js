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

.controller('MySessionsCtrl', function($scope, GetSessionsService, $state, $stateParams) {
    $scope.sessions = GetSessionsService.getSessions();
      
    $scope.loadSession = function(sessionid) {
        $state.go('session', {'sessionid': sessionid});
    };

})

.controller('MySessionCtrl', function($scope, GetSessionService, $state, $stateParams, $ionicModal) {
    $scope.session = GetSessionService.getSession($stateParams['sessionid']);
    $scope.statusOpt = [{"opt": "Presente", "color": "green"}, {"opt": "Atrasado", "color": "orange"}, {"opt": "Ausente", "color": "red"}];
    
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