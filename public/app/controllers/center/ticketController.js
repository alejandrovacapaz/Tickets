app.controller('ticketController', function ($scope, $window, $location, $routeParams, $rootScope, ticketService, customerService, workOrderService, carService) {

    function dataTicket() {
        $scope.editTicket = { id: 0 };
        $scope.editOrder = { id: 0 };
        $scope.listOrder = [];
        $scope.listQuestionTicket = [];
        $scope.isClickResult;
        $scope.isAfirmative;
    }

    function getTicketsForCustomer() {
        var filters = { idCustomer: $scope.idCustomer };
        var response = customerService.getListForIdCustomer(filters);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.tickets = res.data.listTickets;
                $scope.workOrders = res.data.listOrders;
                $scope.editCustomer = res.data.custumerData;
                $scope.questions = res.data.listQuestions;
                $scope.garages = res.data.listGarages;
                $scope.currentQuestion = $scope.questions[0].id;
            }
        });
    }

    $scope.checkAll = function () {
        angular.forEach($scope.workOrders, function (order) {
            order.isChecked = $scope.selectAll;
        });
    };

    var type = {
        existNumber: 1,
        answeredCall: 2,
        numberCorrect: 3,
        hasvehicles: 4,
        buyANewvehicule: 5,
        hasMantenaince: 6,
        garageIsMember: 8,
        likeSameGarage: 9,
        garageWasMember: 7
    }

    var statusClient = {
        DERIVADO_COMPLETAMENTE: 'Derivado',
        DERIVADO_PARCIAL: 'Notificado',
        PENDIENTE: 'Pendiente',
        ANULADO: 'Anulado'
    }

    $scope.statusTicket = {
        NUMEROINEXISTENTE: 'Numero NO existe',
        NOCONTESTO: 'NO contesto',
        NUMEROINCORRECTO: 'Numero EQUIVOCADO',
        NOTIENEVEHICULOS: 'NO tiene vehiculo',
        CAMBIOVEHICULO: 'CAMBIO Vehiculo',
        DERIVADOTALLERSOCIO: 'Recuperado de Taller NO socio',
        DERIVADOMISMOTALLERSOCIO: 'Mantiene Taller SOCIO',
        DERIVAOTROTALLERSOCIO: 'Cambio de Taller SOCIO',
        HIZOMANTENIMIENTOOTROTALLER: 'Mantenimiento en Competencia',
        HIZOMANTENIMIENTOENTALLERSOCIO: 'Mantenimiento en Taller SOCIO',
        VOLVERALLAMAR: 'Reprogramacion'
    };

    $scope.openRuat = function (order) {
        if (!$scope.allowEdit) {
            $scope.currentOrder = order;
            window._globals.numberPlate = order.numberPlate;
            popup = openWindowPopup('/app/partials/shared/windowsPopup.html', 'CallBack System', '1024', '600');
            popup.focus();
        }
    };

    $scope.copyNumberPlate = function (order) {
        copyToClipboard(order.numberPlate);
    };

    $(document).off('onWindowSendData').on('onWindowSendData', function (e, data) {
        var carInfo = data;
        loadInformation(carInfo);
    })

    function loadInformation(carInfo) {
        var car = {};
        car.numberPlate = window._globals.numberPlate;
        car.make = carInfo['Marca'];
        car.model = carInfo['Tipo'];
        car.type = carInfo['Clase'];
        car.numberEngine = carInfo['Cilindrada (Cc.)'];
        car.color = carInfo['Color'];
        car.annum = carInfo['Modelo']
        car.detail = 'Traccion '.concat(carInfo['Tracción'], ', Servicio ', carInfo['Servicio']);

        carService.updateByNumberPlate(car).then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                var filters = { idCustomer: $scope.idCustomer };
                var response = workOrderService.getByCustomer(filters);
                response.then(function (res) {
                    if (!res.isSuccess) {
                        toastr.error(res.message);
                    }
                    else {
                        $scope.workOrders = res.data;
                        $scope.selectAll = false;
                        $scope.selectAll = true;
                        $scope.checkAll();
                    }
                });

                window._globals.numberPlate = {};
                toastr.success(res.message);
            }
        });
    }

    $scope.executeQuestionYes = function (question) {
        $scope.editTicket.detail = '';
        $scope.isAfirmative = true;
        $scope.currentQuestion = question.yesAction ? question.id : question.nextNumber;
        switch (question.id) {
            case type.existNumber:
                $scope.editTicket.detail = null;
                actions.actionOnExistNumber(question);
                break;
            case type.answeredCall:
                $scope.editTicket.detail = null;
                actions.actionOnAnswerCall(question);
                break;
            case type.numberCorrect:
                actions.actionOnNumberCorrect(question);
                break;
            case type.hasvehicles:
                break;
            case type.hasMantenaince:
                actions.actionOnHasMantenaince(question);
                break;
            case type.garageIsMember:
                actions.actionOnIsMember(question);
                break;
            case type.likeSameGarage:
                actions.actionSameGarage(question);
                break;
            case type.garageWasMember:
                actions.actionWasMember(question);
                break;
            case type.buyANewvehicule:
                actions.actionOnBuyNewVehicule(question);
                break;
        }
    };

    $scope.executeQuestionNo = function (question) {
        $scope.editTicket.detail = '';
        $scope.isClickResult = true;
        $scope.isAfirmative = false;
        $scope.currentQuestion = question.noAction ? question.id : question.nextNumber;
        switch (question.id) {
            case type.existNumber:
                actions.actionOnNotExistNumber(question);
                break;
            case type.answeredCall:
                actions.actionOnNotAnswerCall(question);
                break;
            case type.numberCorrect:
                actions.actionOnNotNumberCorrect(question);
                break;
            case type.hasvehicles:
                actions.actionOnHasNotVehicles(question);
                break;
            case type.hasMantenaince:
                actions.actionOnHasNotMantenaince(question);
                $scope.isClickResult = false;
                break;
            case type.likeSameGarage:
                actions.actionOnNotRemoveClient(question);
                break;
            case type.garageIsMember:
                break;
            case type.garageWasMember:
                $scope.isClickResult = true;
                break;
            case type.buyANewvehicule:
                actions.actionOnNotBuyNewVehicule(question);
                break;
        }
    };

    $scope.openModalMap = function () {
        var scope = $scope;
        $('.modal-wide').on('show.bs.modal', function () {
            var height = $(window).height() - 200;
            $(this).find('.modal-body').css('max-height', height);
        });
        $rootScope.$broadcast('showModalMap');
    };

    $scope.asignGarageToCustomer = function (garage) {
        $scope.garageCustomer = garage;
    };

    function getCylinderNextToExpired() {
        var dateExpired = '';
        if ($scope.workOrders) {
            var i = 0;
            while (i < $scope.workOrders.length) {
                if ($scope.workOrders[i].isChecked && $scope.workOrders[i].expireDate > 0) {
                    return ''.concat(' Placa Nro: ', $scope.workOrders[i].numberPlate,
                        ' vencimiento el: ', moment(($scope.workOrders[i].lastDate).formatDate()).add('years', 1).format('DD/MM/YYYY'));
                }
                i += 1;
            }
            if (!dateExpired) {
                return ''.concat(' Placa Nro: ', $scope.workOrders.first().numberPlate,
                    ' vencimiento el: ', moment(($scope.workOrders.first().lastDate).formatDate()).add('years', 1).format('DD/MM/YYYY'));
            }
        } else {
            return dateExpired;
        }
    }

    $scope.openWathsapWebModal = function () {
        var urlWathsapp = 'https://api.whatsapp.com/send?phone=591' + $scope.editCustomer.cellPhone + '&text=' + $rootScope.urlToSend;
        window.open(urlWathsapp, '_blank');
    };

    $scope.openWathsapWebModalGarage = function () {
        var messageText = 'Hemos derivado al *cliente:* '.concat($scope.editCustomer.fullName, ' con *teléfono:* ', $scope.editCustomer.cellPhone,
            ' para el mantenimiento de su equipo de gas del vehiculo ', getCylinderNextToExpired(), ' *Saludos, el CLUB del GNV*');
        var urlWathsapp = 'https://api.whatsapp.com/send?phone=591' + $scope.garageCustomer.mobile + '&text=' + messageText;
        window.open(urlWathsapp, '_blank');
    };

    function getCylinderTemplate() {
        var templateCylinders = '';
        angular.forEach($scope.workOrders, function (order) {
            if (order.isChecked) {
                templateCylinders += '- Cilindro # ' + order.codeCylinder;
            }
        });
        return templateCylinders;
    }

    $scope.asignGarageAndSendNotificacion = function (status) {
        //to: 'enarcil.srl@gmail.com,ricardo@std-srl.com' + mailGarage,
        //to: 'ricardo@std-srl.com',
        var mailGarage = $scope.garageCustomer.email ? ',' + $scope.garageCustomer.email : '';
        var dataMail = {
            from: 'Enarcil <enarcil.rectificadora@gmail.com>',
            to: 'enarcil.srl@gmail.com,ricardo@std-srl.com' + mailGarage,
            subject: 'Envio de cliente',
            client: $scope.editCustomer.fullName,
            cellPhone: $scope.editCustomer.cellPhone,
            garage: $scope.garageCustomer.fullName,
            carData: getCylinderNextToExpired()
        }

        $scope.editTicket.sendMail = true;
        ticketService.notificate(dataMail).then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else { $scope.saveTicket(status); }
        });
    };

    var actions = {
        actionOnExistNumber: function (question) {
            $scope.isClickResult = false;
        },
        actionOnAnswerCall: function (question) {
            $scope.isClickResult = false;
        },
        actionOnNumberCorrect: function (question) {
            $scope.isClickResult = false;
        },
        actionOnHasVehicles: function (question) {
            if (!thereIsOrdersSelecteds()) {
                $scope.currentQuestion = 4;
                toastr.warning('No existen ningun vehiculo seleccionado.');
            } else {
                $scope.allowEdit = true;
                $scope.isClickResult = true;
            }
        },
        actionOnHasMantenaince: function (question) {
            loadGarages();
            $('#datemaintenance').datetimepicker({
                format: 'DD/MM/YYYY', maxDate: 'now', ignoreReadonly: true
            }).on('dp.change', function (e) {
                $scope.lastDate = moment(e.date).format('DD/MM/YYYY');
            });
            $('.starrr').starrr();
            $('.ratable').on('starrr:change', function (e, value) {
                if (value) {
                    $scope.rate = value + '.0';
                    $scope.$apply();
                } else {
                    $scope.rate = 0 + '.0';
                    $scope.$apply();
                }
            });
            $scope.isClickResult = true;
        },
        actionOnRemoveClient: function (question) {
        },
        actionOnNotExistNumber: function (question) {
            $scope.selectAll = true;
            $scope.allowEdit = true;
            $scope.checkAll();
        },
        actionOnNotAnswerCall: function (question) {
            $scope.selectAll = true;
            $scope.allowEdit = true;
            $scope.checkAll();
        },
        actionOnNotNumberCorrect: function (question) {
            $scope.selectAll = true;
            $scope.allowEdit = true;
            $scope.checkAll();
        },
        actionOnHasNotVehicles: function (question) {
            if (!thereIsOrdersSelecteds()) {
                $scope.currentQuestion = 4;
                toastr.warning('No existen ningun vehiculo seleccionado.');
            } else {
                $scope.isClickResult = false;
                $scope.currentQuestion = 5;
                $scope.allowEdit = true;
            }
        },
        actionOnHasNotMantenaince: function (question) {
            loadGarages();

            if ($scope.workOrders.length > 0) {
                var isMember = $scope.workOrders.first().Garage.isPartner;
            }

            if (isMember) { $scope.currentQuestion = 9; }
            else {
                var obviateQuestion = $scope.questions[7];
                $scope.executeQuestionNo(obviateQuestion);
            }
        },
        actionOnNotRemoveClient: function (question) {
            loadGarages();
            $('.starrr').starrr();
            $('.ratable').on('starrr:change', function (e, value) {
                if (value) {
                    $scope.rate = value + '.0';
                    $scope.$apply();
                } else {
                    $scope.rate = 0 + '.0';
                    $scope.$apply();
                }
            });

            var garageFirstCheckedListOrder = getOrderFirstChecked();
            $scope.garageFirstChecked = garageFirstCheckedListOrder ? garageFirstCheckedListOrder.Garage.fullName : '';
        },
        actionOnIsMember: function (question) {
            loadGarages();
        },
        actionSameGarage: function (question) {
            if (!thereIsOrdersSelecteds()) {
                toastr.warning('Por favor seleccione al menos un cilindro');
            } else {
                loadGarages();
                var orderFirstChecked = $scope.workOrders.where(function (order) {
                    return order.isChecked;
                });

                var garageSelectedFromOrder = $scope.garages.where(function (item) {
                    return orderFirstChecked.length > 0 && item.id == orderFirstChecked.first().idGarage;
                });

                if (garageSelectedFromOrder && garageSelectedFromOrder.length > 0) {
                    $scope.garageCustomer = garageSelectedFromOrder.first();

                    var urlMap = 'La dirección del taller: '.concat($scope.garageCustomer.fullName, ' es: ', $scope.garageCustomer.shortUrlMaps, ' *Saludos,  El Club del GNV*');
                    $rootScope.urlToSend = urlMap;
                }
                $scope.isClickResult = true;
            }
        },
        actionWasMember: function (question) {
            $scope.isClickResult = true;
        },
        actionOnBuyNewVehicule: function (question) {
            $scope.isClickResult = true;
            $scope.editTicket.numberPlate = '';
            $scope.selectAll = true;
            $scope.allowEdit = true;
            $scope.checkAll();
        },
        actionOnNotBuyNewVehicule: function (question) {
            $scope.editTicket.numberPlate = '';
            $scope.selectAll = true;
            $scope.allowEdit = true;
            $scope.checkAll();
        }
    }

    function getOrderFirstChecked() {
        var orderFirstChecked = $scope.workOrders.where(function (order) {
            return order.isChecked;
        });
        return orderFirstChecked.first();
    }

    $scope.closeTicketBuyNewVehicule = function (status) {
        $scope.isClickResult = false;
        $scope.saveVehicule(status);
    };

    $scope.saveVehicule = function (status) {
        if (thereIsOrdersSelecteds()) {

            var filter = {};
            filter.numberPlate = $scope.editTicket.numberPlate;

            var response = carService.findByNumberPlate(filter);
            response.then(function (resCar) {
                if (!resCar.isSuccess) { toastr.error(resCar.message); }
                else {
                    if (resCar.data) {
                        $('#modal-plate-exists').modal('show');
                    }
                    else {
                        if ($scope.editTicket.numberPlate) {
                            $scope.editCar = { id: 0 };
                            $scope.editCar.codeCustomer = $scope.editCustomer.code;
                            $scope.editCar.idCustomer = $scope.editCustomer.id;
                            $scope.editCar.numberPlate = $scope.editTicket.numberPlate;
                        }
                        $scope.saveTicket(status);
                    }
                }
            });
        }
        else {
            toastr.warning('Por favor seleccione al menos un vehiculo');
        }
    };

    $scope.closeTicketWithoutSavingVehicle = function (status) {
        if (thereIsOrdersSelecteds()) {
            $scope.saveTicket(status);
        }
        else {
            toastr.warning('Por favor seleccione al menos un vehiculo');
        }
    };

    $scope.saveCustomer = function () {
        if ($scope.editCustomer.phone && $scope.editCustomer.phone.length < 7) {
            toastr.warning('Numero de telefono no valido');
            return;
        }
        if ($scope.editCustomer.cellPhone && $scope.editCustomer.cellPhone.length < 8) {
            toastr.warning('Numero de WhatsApp no valido');
            return;
        }
        if ($scope.idCustomer > 0) {
            var response = customerService.update($scope.editCustomer);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.saveTicket = function (status) {
        if (thereIsOrdersSelecteds()) {
            $scope.editTicket.status = status ? status : $scope.editTicket.status;

            var listNewTicket = [];
            var orders = $scope.workOrders.where(function (order) {
                if (order.isChecked) {
                    $scope.editTicket.type = 1;
                    $scope.editTicket.dateRegister = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
                    $scope.editTicket.codeCylinder = order.codeCylinder;
                    $scope.editTicket.numberPlate = order.numberPlate;
                    $scope.editTicket.idCustomer = order.idCustomer;
                    $scope.editTicket.idCar = order.idCar;
                    $scope.editTicket.idGasCylinder = order.idGasCylinder;
                    if ($scope.editTicket.status == 'Mantenimiento en Competencia' || $scope.editTicket.status == 'Mantenimiento en Taller SOCIO') {
                        var garageNew = $('#idGarage').val();
                        $scope.editTicket.idGarage = order.idGarage;
                        $scope.editTicket.garageNew = garageNew;
                    } else {
                        if ($scope.editTicket.status == 'Mantiene Taller SOCIO' || $scope.editTicket.status == 'Recuperado de Taller NO socio' || $scope.editTicket.status == 'Cambio de Taller SOCIO') {
                            $scope.editTicket.garageNew = $scope.garageCustomer.id;
                            $scope.editTicket.idGarage = order.idGarage;
                        } else {
                            $scope.editTicket.idGarage = order.idGarage;
                        }
                    }
                    $scope.editTicket.idWorkOrder = order.id;
                    $scope.editTicket.rate = $scope.rate;
                    $scope.editTicket.idUser = $rootScope.currentUser.id;
                    $scope.editTicket.orderBy = getOrderByTicket($scope.editTicket.status);
                    listNewTicket.push($scope.editTicket);
                }
            });

            //validar status cliente
            var statusCustomerEdit = '';
            switch ($scope.editTicket.status) {
                case 'Numero NO existe':
                    statusCustomerEdit = statusClient.ANULADO;
                    break;
                case 'Numero EQUIVOCADO':
                    statusCustomerEdit = statusClient.ANULADO;
                    break;
                case 'NO contesto':
                    statusCustomerEdit = statusClient.ANULADO;
                    break;
                case 'NO tiene vehiculo':
                    if ($scope.workOrders.length == listNewTicket.length) {
                        statusCustomerEdit = statusClient.ANULADO;
                    }
                    else {
                        statusCustomerEdit = statusClient.DERIVADO_PARCIAL;
                    }
                    break;
                case 'Reprogramacion':
                    statusCustomerEdit = statusClient.PENDIENTE;
                default:
                    if (!statusCustomerEdit) {
                        if ($scope.workOrders.length == listNewTicket.length) {
                            statusCustomerEdit = statusClient.DERIVADO_COMPLETAMENTE;
                        }
                        else {
                            statusCustomerEdit = statusClient.DERIVADO_PARCIAL;
                        }
                    }
                    break;
            }

            var data = { details: listNewTicket, statusCustomer: statusCustomerEdit, dataCar: $scope.editCar };
            if (listNewTicket.length > 0) {
                var response = ticketService.save(data);
                response.then(function (res) {
                    if (!res.isSuccess) { toastr.error(res.message); }
                    else {
                        toastr.success(res.message);
                    }
                    $('#modal-delete').modal('hide');
                    $('#modal-reprogram').modal('hide');
                    $('.modal-backdrop').remove();
                    $location.path('/search');
                });
            }
        }
        else {
            toastr.warning('Por favor seleccione al menos un cilindro');
        }
    };

    $scope.selectedOrder = function (order, e) {
        order.isChecked = e.currentTarget.checked;
    };

    function thereIsOrdersSelecteds() {
        var orders = $scope.workOrders.where(function (order) {
            return order.isChecked == true;
        })
        return orders.length <= 0 ? false : true;
    }

    $scope.confirmClose = function (status) {
        $scope.editTicket.status = status;
        if (!thereIsOrdersSelecteds()) {
            toastr.warning('Por favor seleccione al menos un cilindro');
        } else {
            if (status == $scope.statusTicket.NUMEROINEXISTENTE) {
                $scope.mensajeModalEliminar = 'No existe el numero. Quiere dar de baja al cliente';
            }
            if (status == $scope.statusTicket.NUMEROINCORRECTO) {
                $scope.mensajeModalEliminar = 'Numero incorrecto. Quiere dar de baja al cliente';
            }
            if (status == $scope.statusTicket.NOTIENEVEHICULOS) {
                $scope.mensajeModalEliminar = 'No tiene el vehiculo. Quiere dar de baja al cliente';
            }
            if (status == $scope.statusTicket.NOCONTESTO) {
                $scope.mensajeModalEliminar = 'No contesto. Quiere dar de baja al cliente';
            }
            $('#modal-delete').modal('show');
        }
    };

    $scope.saveMantenaince = function () {
        $scope.isClickResult = false;
        $scope.currentQuestion = 7;

        var idGarageNew = $('#idGarage').val();
        var validateGarageIsParner = $scope.garages.where(function (item) { return item.id == idGarageNew }).first();

        var listNewOrder = [];

        var orders = $scope.workOrders.where(function (order, index) {
            if (order.isChecked) {
                $scope.editOrder = { id: 0 };
                $scope.editOrder.code = 'MA ' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' ' + order.codeCylinder + ' ' + index;
                $scope.editOrder.typeOrder = 'Mantenimiento';
                $scope.editOrder.status = 'Cancelado';
                $scope.editOrder.lastDate = $scope.lastDate;
                $scope.editOrder.statusTicket = $scope.statusTicket.HIZOMANTENIMIENTOOTROTALLER;
                $scope.editOrder.codeCylinder = order.codeCylinder;
                $scope.editOrder.numberPlate = order.numberPlate;
                $scope.editOrder.idCustomer = order.idCustomer;
                $scope.editOrder.idCar = order.idCar;
                $scope.editOrder.idGasCylinder = order.idGasCylinder;
                $scope.editOrder.idGarage = idGarageNew;
                listNewOrder.push($scope.editOrder);
            }
        });

        var data = { details: listNewOrder };
        if (listNewOrder.length > 0) {
            var response = workOrderService.saveManyOrders(data);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    if (!validateGarageIsParner.isPartner) {
                        $scope.saveTicket($scope.statusTicket.HIZOMANTENIMIENTOOTROTALLER);
                    } else {
                        toastr.success(res.message);
                        var obviateQuestion = $scope.questions[6];
                        $scope.executeQuestionYes(obviateQuestion);
                    }
                }
            });
        }
    };

    $scope.openWindowANH = function () {
        $scope.currentQuestion = 6;
        popup = openWindowPopup('/app/partials/shared/modalANH.html', 'CallBack System', '1024', '600');
        popup.focus();
    };

    $scope.reProgram = function (status) {
        $scope.isClickResult = false;
        $scope.saveTicket(status);
    };

    $scope.validateCustomerControls = function () {
        return $scope.editCustomer == null || $scope.editCustomer.numberId == null
            || $scope.editCustomer.fullName == null;
    };

    function loadGarages() {
        var data = $scope.garages.select(function (garage) {
            var title = garage.isPartner == true ? garage.fullName + ' - [Socio]' : garage.fullName;
            return { id: garage.id, text: title };
        });

        $('#idGarage').select2({
            data: data
        }).on('select2:select', function (e) {
            //if (e.params.data.id == 0) TODO: validar taller inhabilitado                
        });
    }

    $scope.validateControlsGarage = function () {
        return $scope.editGarage.fullName == null;
    };

    function getOrderByTicket(status) {
        var orderBy;
        switch (status) {
            case 'Numero NO existe':
                orderBy = 1;
                break;
            case 'NO contesto':
                orderBy = 2;
                break;
            case 'Numero EQUIVOCADO':
                orderBy = 3;
                break;
            case 'NO tiene vehiculo':
                orderBy = 4;
                break;
            case 'CAMBIO Vehiculo':
                orderBy = 5;
                break;
            case 'Recuperado de Taller NO socio':
                orderBy = 6;
                break;
            case 'Cambio de Taller SOCIO':
                orderBy = 7;
                break;
            case 'Mantiene Taller SOCIO':
                orderBy = 8;
                break;
            case 'Mantenimiento en Competencia':
                orderBy = 9;
                break;
            case 'Mantenimiento en Taller SOCIO':
                orderBy = 10;
                break;
            case 'Reprogramacion':
                orderBy = 11;
                break;
        }
        return orderBy;
    }

    $scope.back = function(){
        $window.history.back();
    };

    init();
    function init() {
        $rootScope.urlToSend = null;

        $scope.idCustomer = $routeParams.id;
        getTicketsForCustomer();
        dataTicket();
        $scope.AllSelectedItems = false;
        $scope.NoSelectedItems = false;

        $('#birthdate').datetimepicker({
            format: 'DD/MM/YYYY', maxDate: 'now', viewMode: 'years', ignoreReadonly: true
        }).on('dp.change', function (e) {
            if (e.date) {
                $scope.editCustomer.birthdate = moment(e.date).format('DD/MM/YYYY');
            } else {
                $scope.editCustomer.birthdate = null;
            }
        });

        $('#dateReprogram').datetimepicker({
            format: 'DD/MM/YYYY', minDate: 'now', ignoreReadonly: true
        }).on('dp.change', function (e) {
            if (e.date) {
                $scope.editTicket.dateReprogram = moment(e.date).format('DD/MM/YYYY');
            } else {
                $scope.editTicket.dateReprogram = null;
            }
        });

        $scope.rate = '0.0';
        $scope.editGarage = { id: 0, isPartner: false };
    }
});