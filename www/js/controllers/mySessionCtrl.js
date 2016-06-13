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
        $window.alert("Não foi possível obter dados desta sessão: \n \n =(");
    });


    function onNfc(nfcEvent) {
        $scope.onNfc(nfcEvent);
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

    $scope.onNfc = function(nfcEvent) {
        var tag = nfcEvent.tag;
        var tagId = nfc.bytesToHexString(tag.id);

        if ($scope.recordingTag) {
            $scope.associateRfidValue($scope.currentUser, tagId);

            $scope.confirmPopup.close();
            $scope.recordingTag = false;
            $scope.currentUser = null;
        } else {
            user = $scope.findUserByTagId(tagId);

            if (user) {
                $scope.sendUser(user, tagId);
            } else {
                message = "Identificador não encontrado, associe um identificador clicando no símbolo de NFC ao lado do estudante";
                $cordovaToast.show(message, 'long', 'bottom').then(function(success)
                {}, function (error) {});
            }
        }
    }

    $scope.recordTag = function(user) {
        if (user.rfid == '') { //Só executa se ainda não está cadastrado o rfid
            $scope.currentUser = user;
            $scope.recordingTag = true;
            $scope.confirmPopup = $ionicPopup.alert({
                title: 'Gravando tag',
                scope: $scope,
                template: '<p>Passe o cartão para confirmar a gravação</p>',
                buttons: [{text: 'Cancelar'}]
            });

            $scope.confirmPopup.then(function(res) {
                $scope.recordingTag = false;
            });
        }
    }

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

    $scope.changeStatus = function(user, status) {
        user.status = status.description;
        user.statusid = status.id;
        user.sentStatus = "sent";
    };

    //Manual change of status. Coming from modal.
    $scope.changeStatusManual = function(status) {
        $scope.sendUser($scope.currentUser, status);
        $scope.closeModal();
    }

    $scope.sendUser = function(user, status) {
        takenId = window.localStorage['userid'];
        statusset = $scope.getStatusSet();

        $service = SessionsService.updateUserStatus($scope.session.id, user.id, takenId, status.id, statusset);
        $service.then(function(resp) {
            data = angular.fromJson(resp.data);

            if (data == 200) {
                $scope.changeStatus(user, status);
            } else {
                user.sentStatus = "fail";
                $cordovaToast.show("Não foi possível enviar este estudante", 'short', 'bottom').then(function(success)
                {}, function (error) {});
            }
        }, function(err) {
            user.sentStatus = "fail";
            $cordovaToast.show("Não foi possível enviar este estudante", 'short', 'bottom').then(function(success)
            {}, function (error) {});
        });
    }

    $scope.associateRfidValue = function(student, rfid) {
        $service = SessionsService.associateRfidValue(student.id, rfid);
        $service.then(function(resp) {
            data = angular.fromJson(resp.data);
            console.log(data);
            //Dependendo da resposta, precisa enviar o estudante ou apresentar a mensagem de erro. Depois alterar o status dele

            //user.rfid = rfid;
            //$scope.sendUser(user, $scope.greaterStatus);
        }, function(err) {
            $cordovaToast.show("Não foi possível realizar a associação com este estudante", 'short', 'bottom').then(function(success)
            {}, function (error) {});
        });
    }

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
        angular.forEach($scope.session.users, function(user) {
            $scope.sendUser(user, status);
        });

        $scope.popover.hide();
    }

    // Funções auxiliares

    $scope.findUserByTagId = function(tag) {
        angular.forEach($scope.session.users, function(user) {
            if (user.rfid.toUpperCase() == tag.toUpperCase()) {
                return user;
            }
        });

        return null;
    }

    $scope.getStatusSet = function() {
        statusset = "";

        angular.forEach($scope.session.statuses, function(status) {
            if (statusset) {
                statusset = statusset + "," + status.id;
            } else {
                statusset = status.id;
            }
        });

        return statusset;
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
})
