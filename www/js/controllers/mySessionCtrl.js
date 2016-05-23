angular.module('starter.controllers').controller('MySessionCtrl', function($scope, $ionicLoading, SessionsService,
    $state, $stateParams, $ionicModal, $window, $ionicPopup, $ionicPopover, $ionicHistory, $cordovaToast) {

    $scope.nfcStatus = "NFC desabilitado";
    $scope.nfcClass = "nfc-disabled";
    $scope.recordingTag = false;

    $scope.$on("$ionicView.leave", function(event, data){
        // handle event
        if (typeof nfc !== 'undefined') nfc.removeTagDiscoveredListener(onNfc);
        $scope.$destroy();
    });

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $ionicHistory.nextViewOptions ({
        disableBack: true
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

    $scope.goBack = function() {
        $state.go('my_sessions');
    }

    $ionicModal.fromTemplateUrl('status-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.onHold = function(user) {
        $scope.currentUser = user;
        $scope.recordingTag = true;
        $scope.confirmPopup = $ionicPopup.alert({
            title: 'Gravando tag',
            scope: $scope,
            template: '<p>Passe o cartão para confirmar a gravação</p>',
            buttons: [{text: 'Cancelar'}]
        });
    }

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

    // Getting session info
    $service = SessionsService.getSession($stateParams['sessionid']);
    $service.then(function(resp) {
        $scope.session = (angular.fromJson(resp.data));

        if ($scope.session.users.length == 0) {
            $state.go('session_not_found');
        }

        updateSession($scope.session);
        $ionicLoading.hide();
    }, function(err) {
        $window.alert("Não foi possível obter esta sessão: \n \n =(");
    });

    function onNfc(nfcEvent) {
        $scope.onNfc(nfcEvent);
    }

    $scope.onNfc = function(nfcEvent) {
        var tag = nfcEvent.tag;
        var tagId = nfc.bytesToHexString(tag.id);

        if ($scope.recordingTag) {
            $scope.recordNewTag(tagId);
            $scope.confirmPopup.close();
            $scope.recordingTag = false;
            $scope.currentUser = null;
        }

        $scope.updateStatusNFC(tagId);
    }

    function win() {
        $scope.nfcStatus = "NFC habilitado";
        $scope.nfcClass = "nfc-enabled";
    }

    function fail(error) {
        $scope.nfcStatus = "NFC desabilitado";
        $scope.nfcClass = "nfc-disabled";
    }

    if (typeof nfc !== 'undefined') nfc.addTagDiscoveredListener(onNfc, win, fail);


    function updateSession(session) {
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

        //Marcando status com maior peso (presença via NFC)
        var bigger = session.statuses[0];
        angular.forEach(session.statuses, function(status){
            if (status.grade > bigger.grade) {
                bigger = status;
            }
        });

        $scope.greaterStatus = bigger;
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

    $scope.recordNewTag = function(tag) {
        angular.forEach($scope.session.users, function(user) {
            if (user.id == $scope.currentUser.id) {
                user.rfid = tag;
                user.newTag = true;
            }
        });
    }

    $scope.updateStatusNFC = function(tag) {
        angular.forEach($scope.session.users, function(user) {
            if (user.rfid.toUpperCase() == tag.toUpperCase()) {
                $scope.currentUser = user;
                $scope.changeStatus($scope.greaterStatus, tag);
                $cordovaToast.show(user.firstname + " " + user.lastname, 'short', 'bottom').then(function(success) {}, function (error) {});
            }
        });
    }

    $scope.changeStatus = function(status, tag) {
        $scope.currentUser.status = status.description;
        $scope.currentUser.statusid = status.id;

        $scope.closeModal();

        statusset = "";
        angular.forEach($scope.session.statuses, function(status) {
            if (statusset) {
                statusset = statusset + "," + status.id;
            } else {
                statusset = status.id;
            }
        });

        user = $scope.currentUser;
        user.sentStatus = "Enviando...";
        rfid = '';

        if (user.newTag) {
            rfid = tag;
        }

        $service = SessionsService.updateUserStatus($scope.session.id, user.id, window.localStorage['userid'], status.id, statusset, rfid);
        $service.then(function(resp) {
            $ionicLoading.hide();
            user.sentStatus = "Enviado";
        }, function(err) {
            user.sentStatus = "Falha ao enviar";
            $window.alert("Não foi possível enviar este usuário: \n \n =(");
            $ionicLoading.hide();
        });

        $scope.currentUser = null;
    };

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

        window.localStorage['token'] = '';

        ref.addEventListener('exit', function(event) {
            $state.go('login');
        });
    };

    $scope.updateAll = function(status) {
        statusset = "";
        angular.forEach($scope.session.statuses, function(status) {
            if (statusset) {
                statusset = statusset + "," + status.id;
            } else {
                statusset = status.id;
            }
        });

        angular.forEach($scope.session.users, function(user) {
            user.status = status.description;
            user.statusid = status.id;
            user.sentStatus = "Enviando...";

            $service = SessionsService.updateUserStatus($scope.session.id, user.id, window.localStorage['userid'], status.id, statusset);
            $service.then(function(resp) {
                user.sentStatus = "Enviado";
            }, function(err) {
                user.sentStatus = "Falha ao enviar";
            });
        });

        $scope.popover.hide();
    }
})
