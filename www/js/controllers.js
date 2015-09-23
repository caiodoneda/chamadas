angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicHistory) {
    $ionicHistory.nextViewOptions ({
        disableBack: true
    });

    $scope.data = {};
    $scope.data.url = window.localStorage['url'] || '';
    $scope.data.username = window.localStorage['username'] || '';
    $scope.data.password = '';

    $scope.login = function() {
        window.localStorage['url'] = $scope.data.url;
        window.localStorage['username'] = $scope.data.username;
        LoginService.getUserToken($scope.data.password); /*.success(function(data) {
            console.log(data.hasOwnProperty('error'));
            if (data.hasOwnProperty('error')) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Falha ao autenticar! =/',
                    template: 'Por favor, verifique suas credenciais!'
                });
            } else {
                
            } */
            //$state.go('my_sessions', {'id':$scope.data.username});
       // });
    }
})

.controller('MySessionsCtrl', function($scope, $ionicLoading, SessionsService, $state, $stateParams, $ionicPopover, $ionicHistory) {
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
    
    $service = SessionsService.getSessions(103);
    $service.then(function(resp) {
        $scope.courses_with_sessions = (angular.fromJson(resp.data));
        $ionicLoading.hide();
    }, function(err) {
        $window.alert("Não foi possível obter as sessões do dia: \n \n =(");
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

.controller('MySessionCtrl', function($scope, $ionicLoading, SessionsService, $state, $stateParams, $ionicModal, $window, $ionicPopover, $ionicHistory) {

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

    function onNfc(nfcEvent) {
        var tag = nfcEvent.tag;
        var tagId = nfc.bytesToHexString(tag.id);
        alert(tagId);
    }

    function win() {
        console.log("Listening for NFC Tags");
    }

    function fail(error) {
        alert("Error adding NFC listener");
    }

    if (typeof nfc !== 'undefined') nfc.addTagDiscoveredListener(onNfc, win, fail);

    $service = SessionsService.getSession($stateParams['sessionid']);
    $service.then(function(resp) {
        $scope.session = (angular.fromJson(resp.data));
        updateStatus($scope.session);
        $ionicLoading.hide();
    }, function(err) {
        $window.alert("Não foi possível obter esta sessão: \n \n =(");
    }); 

    function updateStatus(session) {
        attendance_log = [];
        angular.forEach(session.attendance_log, function(log){
            attendance_log[log.studentid] = log.statusid;
        });

        if (session.attendance_log) {
            angular.forEach(session.users, function(user) {
                user.statusid = attendance_log[user.id];
                user.status = findStatus(session.statuses, parseInt(user.statusid));
            });
        }
    }

    function findStatus(statuses, statusid) {
        description = ""
        angular.forEach(statuses, function(status) {
            if (status.id == statusid) {
                description = status.description;
            }
        });

        return description;
    }

    $ionicModal.fromTemplateUrl('status-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.openModal = function(user) {
        var radios = document.getElementsByClassName("radio-icon");

        for(var i = 0; i < radios.length; i++) {
            radios[i].style.visibility = "hidden";
        }
        
        $scope.modal.show();
        $scope.currentUser = user;
    };
    
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.changeStatus = function(status) {
        $scope.currentUser.status = status.description;
        $scope.currentUser.statusid = status.id;
        $scope.currentUser = null;
        $scope.closeModal();
    };

    $scope.takeAttendance = function (session) {
        var users = {};
        var session_info = {};
        var proceed = true;

        angular.forEach(session.users, function(user) {
            if (typeof user.statusid == 'undefined') {
                proceed = false;
            }
            
            var current_user = {"id": user.id, "statusid": user.statusid, "remarks": ""};
            users[user.id] = current_user;
        });

        statusset = "";
        angular.forEach(session.statuses, function(status) {
            if (statusset) {
                statusset = statusset + "," + status.id;
            } else {
                statusset = status.id;
            }
        });

        var d = new Date();
        var time = d.getTime();
        session_info = {"statusset": statusset, "id": session.id, "timetaken": time, "takenby": 103};

        if (proceed) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            $service = SessionsService.takeAttendance(angular.toJson(users), angular.toJson(session_info));
            $service.then(function(resp) {
                $ionicLoading.hide();
                $window.alert("Sucesso!!");
                $state.go('my_sessions', {'id':103});
            }, function(err) {
                $window.alert("Não foi possível enviar esta sessão: \n \n =(");
                $ionicLoading.hide();    
            });
        } else {
            $window.alert("Ainda existem usuários com estado indefinido!!!");
        }
    }

    $scope.logout = function() {
        $ionicHistory.nextViewOptions ({
            disableBack: true
        });

        $scope.popover.hide();
        $state.go('login');
    };

    $scope.updateAll = function(status) {
        angular.forEach($scope.session.users, function(user) {
            user.status = status.description;
            user.statusid = status.id;
        });

        $scope.popover.hide();
    }
})
