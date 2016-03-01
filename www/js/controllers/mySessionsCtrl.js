angular.module('starter.controllers').controller('MySessionsCtrl', function($scope, $ionicLoading, SessionsService, $state, $stateParams, $ionicPopover, $ionicHistory, $window) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.popover = $ionicPopover.fromTemplate({
        scope: $scope
     });

    $ionicPopover.fromTemplateUrl('settings.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    
    $service = SessionsService.getSiteInfo();
    $service.then(function(resp) {
        console.log(resp.data);
        var userid = angular.fromJson(resp.data).userid;
        $service = SessionsService.getSessions(userid);
        $service.then(function(resp) {
            $scope.courses_with_sessions = (angular.fromJson(resp.data));
            $ionicLoading.hide();
        }, function(err) {
            $window.alert("Não foi possível obter as sessões do dia: \n \n =(");
            $ionicLoading.hide();    
        });
    }, function(err) {
        $window.alert("Não foi possível obter as sessões do dia: \n \n =(");
        $ionicLoading.hide();     
    });

    $scope.logout = function() {
        $ionicHistory.nextViewOptions ({
            disableBack: true
        });

        $scope.popover.hide();
        $state.go('login');
    };

    $scope.loadSession = function(session) {
        $state.go('session', {'sessionid': session.id});
    };

})