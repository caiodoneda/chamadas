angular.module('starter.controllers').controller('MySessionsCtrl', function($scope, $ionicLoading, SessionsService, $state, $stateParams, $ionicPopover, $ionicHistory, $window) {
    window.localStorage['url'] = 'http://moodle.ufsc.br';

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

        url = window.localStorage['siteUrl'] + '/login/logout.php';
    
        var ref = window.open(url, '_blank');
        
        ref.addEventListener('loadstart', function(event) {
            if (!event.url.match('logout')) ref.close();
        });

        ref.addEventListener('exit', function(event) {
            $state.go('login');
        });
    };

    $scope.loadSession = function(session) {
        $state.go('session', {'sessionid': session.id});
    };

})