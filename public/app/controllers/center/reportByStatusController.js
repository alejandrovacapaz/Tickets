app.controller('reportByStatusController', function ($scope, $filter, $rootScope, $location, procedureService) {

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
        var list = angular.copy($scope.tickets);
        list.push({ status: 'Total', subTotal: $scope.total });
        $scope.filters.list = JSON.stringify(list);

        if ($scope.tickets && $scope.tickets.length > 0) {
            setTimeout(function () {
                OpenWindowWithPost(host + port + "/exportExcel/reportTicketsByStatusExcel", "Resumen por Estado", $scope.filters);
            }, 3000);
        } else {
            toastr.warning('Debe generar la lista para poder exportar a Excel');
            return;
        }
    };

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

            if (queryStatusFilter) return ' status in('.concat(queryStatusFilter.substr(0, queryStatusFilter.length - 1), ')');
        } else {
            return '';
        }
    }

    function getOrderQuery() {
        return " GROUP by status, orderBy ORDER BY orderBy ";
    }

    function generateWhereQuery() {
        var query = ' where 1 ';

        if (getFilterRangeDate()) {
            query = query.concat(' and ', getFilterRangeDate());
        }

        if (getFilterStatus()) {
            query = query.concat(' and ', getFilterStatus())
        }

        return query.concat(getOrderQuery());
    }

    $scope.getDataFiltered = function () {
        $scope.total = 0;

        var minDate = moment($scope.dateIni, 'DD/MM/YYYY');
        var maxDate = moment($scope.dateFin, 'DD/MM/YYYY');

        var isMinDate = moment(minDate).isValid();
        var isMaxDate = moment(maxDate).isValid();

        if (isMinDate && isMaxDate && moment(minDate).isAfter(maxDate)) {
            toastr.warning('El filtro desde debe ser menor al filtro hasta');
            return;
        }

        var filters = {
            tableName: ' Tickets ',
            columnsName: ''.concat(' orderby, status, COUNT(*) as subTotal '),
            where: generateWhereQuery()
        }
        var response = procedureService.getListGroup(filters);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                if (res.data) {
                    $scope.tickets = res.data;
                }
            }
        });
    };

    $scope.clearFilters = function () {
        $scope.dateIni = moment().format('DD/MM/YYYY');
        $scope.dateFin = moment().format('DD/MM/YYYY');
        $scope.getDataFiltered();
    };

    init();
    function init() {
        $scope.total = 0;

        $scope.dateRanges = [
            { id: 1, range: 'Hoy' },
            { id: 2, range: 'Desde ayer' },
            { id: 3, range: 'Semana ultima' },
            { id: 4, range: 'Mes ultimo' },
            { id: 5, range: 'Gestion ultima' }
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
    }

    $scope.toggleAll = function () {
        $scope.isAllSet = !$scope.isAllSet;
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
                case 5:
                    $scope.dateIni = moment().add('years', -1).format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
                    break;
                default:
                    $scope.dateIni = moment().format('DD/MM/YYYY');
                    $scope.dateFin = moment().format('DD/MM/YYYY');
            }
        }
    };
});