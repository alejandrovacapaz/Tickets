app.controller('reportTicketController', function ($scope, $filter, $rootScope, $location, procedureService, userService, garageService) {

    function OpenWindowWithPost(url, name, params, windowOptions) {
        windowOptions = windowOptions || "center=yes,resizable=no,help=no,status=no,Width=930px,Height=650px,scrollbars=no";
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", url);
        form.setAttribute("target", name);

        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = i;
                input.value = params[i];
                form.appendChild(input);
            }
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    $scope.exportExcel = function () {
        $scope.filters = {};
        var protocol = location.protocol;
        var slashes = protocol.concat("//");
        var host = slashes.concat(window.location.hostname),
            port = window.location.port == "" ? "" : ":" + window.location.port;

        $scope.filters.dateIni = $scope.dateIni;
        $scope.filters.dateEnd = $scope.dateFin;

        var filter = getFilterByReport(true);
        if (filter) {
            $scope.filters.columnsName = filter.columnsName;
            $scope.filters.tableName = filter.tableName;
            $scope.filters.where = filter.where;

            setTimeout(function () {
                OpenWindowWithPost(host + port + "/exportExcel/reportTicketsExcel", "Reporte de Tickets", $scope.filters);
            }, 3000);
        }
    };

    function getListGarage() {
        var response = garageService.getAll();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.garageList = res.data;
                $scope.garageList.push({ id: 0, fullName: '[Todos]' });
                $scope.selectedGarage = $scope.garageList[(res.data.length - 1)];
            }
        });
    }

    function getListUser() {
        var response = userService.getAll();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.userList = res.data;
                $scope.userList.push({ id: 0, fullName: '[Todos]' });
                $scope.selectedUser = $scope.userList[(res.data.length - 1)];
            }
        });
    }

    function getFullTextSearch(searchText) {
        var fullTextSearchQuery = $scope.search ? ' and '.concat(' (c.fullName like "%',
            $scope.search, '%" or c.cellPhone like "%', $scope.search, '%" or t.numberPlate like "%',
            $scope.search, '%" or w.code like "%', $scope.search, '%" or go.fullName like "%', $scope.search,
            '%" or gd.fullName like "%', $scope.search, '%")') : '';
        return fullTextSearchQuery;
    }

    function getFilterRangeDate() {
        var minDate = moment($scope.dateIni + ' 00:00', 'DD/MM/YYYY HH:mm');
        var maxDate = moment($scope.dateFin + ' 23:59', 'DD/MM/YYYY HH:mm');

        var isMinDate = moment(minDate).isValid();
        var isMaxDate = moment(maxDate).isValid();

        var minDateFormat = moment(minDate).format('YYYY-MM-DD HH:mm');
        var maxDateFormat = moment(maxDate).format('YYYY-MM-DD HH:mm');

        var queryFilterRangeDate = !isMinDate && isMaxDate ? ''.concat('( dateRegister <= "', maxDateFormat, '")') :
            isMinDate && !isMaxDate ? ''.concat('( dateRegister >="', minDateFormat, '")') :
                isMinDate && isMaxDate ? ''.concat('( dateRegister >= "', minDateFormat, '" and  dateRegister <="', maxDateFormat, '")') : '';
        return queryFilterRangeDate;
    }

    function getFilterStatus() {
        var queryStatusFilter = '';

        if (!$scope.isAllSet) {
            angular.forEach($scope.listStatus, function (item) {
                if (item.isSelect) {
                    queryStatusFilter = queryStatusFilter.concat('"', item.id, '",');
                }
            });

            if (queryStatusFilter) return ' t.status in('.concat(queryStatusFilter.substr(0, queryStatusFilter.length - 1), ')');
        } else {
            return '';
        }
    }

    function getFilterUser() {
        var query = $scope.selectedUser.id == 0 ? '' : ''.concat(' idUser=' + $scope.selectedUser.id);
        return query;
    }

    function getFilterGarage() {
        var query = $scope.selectedGarage.id == 0 ? '' : ''.concat(' garageNew=' + $scope.selectedGarage.id);
        return query;
    }

    function getOrderQuery() {
        return " ORDER BY t.dateRegister DESC, t.orderBy ";
    }

    function generateWhereQuery() {
        var query = ' where t.idCustomer=c.id and t.idWorkOrder=w.id and t.idGarage=go.id and u.id=idUser ';

        if (getFullTextSearch())
            query = query.concat(getFullTextSearch($scope.search));

        if (getFilterRangeDate()) {
            query = query.concat(' and ', getFilterRangeDate());
        }

        if (getFilterStatus()) {
            query = query.concat(' and ', getFilterStatus())
        }

        if (getFilterUser()) {
            query = query.concat(' and ', getFilterUser())
        }

        if (getFilterGarage()) {
            query = query.concat(' and ', getFilterGarage())
        }

        return query.concat(getOrderQuery());
    }

    function validateFilterStatus() {
        var i = 0;
        var flag = false;
        while (i < $scope.listStatus.length && !flag) {
            if ($scope.listStatus[i].isSelect) flag = true;
            i++;
        }
        return flag;
    }

    function getFilterByReport(isBloquedYears) {
        var minDate = moment($scope.dateIni, 'DD/MM/YYYY');
        var maxDate = moment($scope.dateFin, 'DD/MM/YYYY');

        var isMinDate = moment(minDate).isValid();
        var isMaxDate = moment(maxDate).isValid();

        if (isMinDate && isMaxDate && moment(minDate).isAfter(maxDate)) {
            toastr.warning('El filtro desde debe ser menor al filtro hasta');
            return;
        }
        else {
            var monthDiff = moment(maxDate).diff(minDate, 'months');
            if(isBloquedYears){
                if (monthDiff > 11) {
                    toastr.warning('El reporte no puede ser de mas de 12 meses');
                    return;
                }
            }else{
                if (monthDiff > 2) {
                    toastr.warning('El reporte no puede ser de mas de 3 meses');
                    return;
                }
            }            
        }

        var filters = {
            tableName: 'Customers as c, Garages as go, WorkOrders as w, Users as u, Tickets as t LEFT JOIN Garages as gd ON t.garageNew=gd.id',
            columnsName: ''.concat(' t.id,c.fullName as nombre,c.cellPhone,go.fullName as origen,t.status,',
                't.detail,t.numberPlate,w.code,DATE_FORMAT(t.dateRegister, "\'"%d/%m/%Y %H:%i"\'") as dateRegister, ',
                'CONCAT(u.firstname, "\'" "\'",u.lastname) as userName, gd.fullName as destino'),
            where: generateWhereQuery()
        }
        return filters;
    }

    $scope.getDataFiltered = function () {
        if (validateFilterStatus()) {
            var filters = getFilterByReport();
            if (filters) {
                var response = procedureService.getListFilter(filters);
                response.then(function (res) {
                    if (!res.isSuccess) {
                        toastr.error(res.message);
                    }
                    else {
                        if (res.data) {
                            $scope.totalRows = res.data.length > 0 ? res.data[0].TotalRows : 0;
                            $scope.tickets = res.data;
                        }
                    }
                });
            }
        } else {
            $scope.tickets = null;
            $('#modal-alert').modal('show');
        }
    };

    $scope.clearFilters = function () {
        $scope.search = null;
        $scope.dateIni = moment().format('DD/MM/YYYY');
        $scope.dateFin = moment().format('DD/MM/YYYY');
        $scope.selectedGarage = $scope.garageList[($scope.garageList.length - 1)];
        $scope.selectedUser = $scope.userList[($scope.userList.length - 1)];
        $scope.getDataFiltered();
    };

    init();
    function init() {
        getListGarage();
        getListUser();

        $scope.dateRanges = [
            { id: 1, range: 'Hoy' },
            { id: 2, range: 'Desde ayer' },
            { id: 3, range: 'Semana ultima' },
            { id: 4, range: 'Mes ultimo' }
        ];

        $scope.dateRange = $scope.dateRanges[0];

        $scope.isAllSet = true;
        $scope.listStatus = [
            { id: 'Numero NO existe', title: '1. Numero NO existe', isSelect: true },
            { id: 'NO contesto', title: '2. NO contesto', isSelect: true },
            { id: 'Numero EQUIVOCADO', title: '3. Numero EQUIVOCADO', isSelect: true },
            { id: 'NO tiene vehiculo', title: '4. NO tiene vehiculo', isSelect: true },
            { id: 'CAMBIO Vehiculo', title: '5. CAMBIO Vehiculo', isSelect: true },
            { id: 'Recuperado de Taller NO socio', title: '6. Recuperado de Taller NO socio', isSelect: true },
            { id: 'Cambio de Taller SOCIO', title: '7. Cambio de Taller SOCIO', isSelect: true },
            { id: 'Mantiene Taller SOCIO', title: '8. Mantiene Taller SOCIO', isSelect: true },
            { id: 'Mantenimiento en Competencia', title: '9. Mantenimiento en Competencia', isSelect: true },
            { id: 'Mantenimiento en Taller SOCIO', title: '10. Mantenimiento en Taller SOCIO', isSelect: true },
            { id: 'Reprogramacion', title: '11. Reprogramacion', isSelect: true }
        ];

        $scope.dateIni = moment().format('DD/MM/YYYY');
        $scope.dateFin = moment().format('DD/MM/YYYY');

        $('#dateFin').datetimepicker({
            format: 'DD/MM/YYYY', ignoreReadonly: true
        }).on("dp.change", function (e) {
            $scope.dateFin = moment(e.date).format('DD/MM/YYYY');
        });

        $('#dateIni').datetimepicker({
            format: 'DD/MM/YYYY', ignoreReadonly: true
        }).on("dp.change", function (e) {
            $scope.dateIni = moment(e.date).format('DD/MM/YYYY');
        });

        $scope.totalRows = 0;
    }

    $scope.changeCheck = function () {
        var flag = true;
        angular.forEach($scope.listStatus, function (item) {
            if (!item.isSelect) { flag = false; }
        });
        return $scope.isAllSet = flag;
    };

    $scope.toggleAll = function () {
        angular.forEach($scope.listStatus, function (item) {
            item.isSelect = $scope.isAllSet;
        });
    };

    $scope.rangeDate = function () {
        if ($scope.dateRange) {
            switch ($scope.dateRange.id) {
                case 1:
                    $scope.dateIni = moment().format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
                    break;
                case 2:
                    $scope.dateIni = moment().add('days', -1).format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
                    break;
                case 3:
                    $scope.dateIni = moment().add('week', -1).format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
                    break;
                case 4:
                    $scope.dateIni = moment().add('months', -1).format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
                    break;
                default:
                    $scope.dateIni = moment().format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
            }
        }
    };
});