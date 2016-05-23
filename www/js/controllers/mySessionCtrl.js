angular.module('starter.controllers').controller('MySessionCtrl', function($scope, $ionicLoading,
    SessionsService, $state, $stateParams, $ionicModal, $window, $ionicPopup, $ionicPopover, $ionicHistory, $cordovaToast) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.nfcStatus = "NFC desabilitado";
    $scope.nfcClass = "nfc-disabled";
    $scope.recordingTag = false;

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

    function onNfc(nfcEvent) {
        var tag = nfcEvent.tag;
        var tagId = nfc.bytesToHexString(tag.id);

        if ($scope.recordingTag) {
            $scope.currentTag = tagId;
            window.localStorage['nfcTags'][$scope.currentUser.id] = tagId;
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

    $service = SessionsService.getSession($stateParams['sessionid']);
    $service.then(function(resp) {
        $scope.session = (angular.fromJson(resp.data));

        if ($scope.session.users.length == 0) {
            $state.go('session_not_found');
        }

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

        //Marcando status com maior peso (presença via NFC)
        var bigger = session.statuses[0];
        angular.forEach(session.statuses, function(status){
            if (status.grade > bigger.grade) {
                bigger = status;
            }
        });

        $scope.biggerStatus = bigger;
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

    $scope.onHold = function(user) {
        $scope.currentUser = user;
        $scope.currentTag = "";
        $scope.recordingTag = true;
        var confirmPopup = $ionicPopup.alert({
            title: 'Gravando tag',
            template: '<p>Aguardando cartão...</p><p>Tag:' +" "+ $scope.currentTag + "</p>"
        });

        confirmPopup.then(function(res) {
            $scope.currentTag = "";
            $scope.recordingTag = false;
            $scope.currentUser = null;
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

    $scope.updateStatusNFC = function(tag) {
        angular.forEach($scope.session.users, function(user) {
            if (user.rfid == tag) {
                $scope.currentUser = user;
                $scope.changeStatus($scope.biggerStatus);
                $cordovaToast.show(user.firstname + " " + user.lastname, 'short', 'bottom').then(function(success) {}, function (error) {});
            }
        });
    }

    $scope.changeStatus = function(status) {
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

        $service = SessionsService.updateUserStatus($scope.session.id, user.id, window.localStorage['userid'], status.id, statusset);
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
