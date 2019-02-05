app.controller('searchReprogramController', function ($scope, $filter, $rootScope, $location, procedureService, filterService) {

    function dataCustomer() {
        $scope.editCustomer = { id: 0 };
        $scope.dateRange = 2;
    };

    function loadPages(countPages) {
        $scope.pagesForpage = [];
        for (var i = 1; i <= countPages; i++) {
            $scope.pagesForpage.push(i);
        }
        if (!$scope.currentPage) $scope.currentPage = countPages == 0 ? 1 : $scope.pagesForpage[0];
        else $scope.currentPage = $scope.currentPage;
    }

    $scope.nextPage = function () {
        $scope.currentPage = $scope.currentPage + 1;
        $scope.getDataFiltered();
    };

    $scope.previousPage = function () {
        $scope.currentPage = $scope.currentPage - 1;
        $scope.getDataFiltered();
    };

    $scope.selectRerprogramFilter = function (onlyReprogram) {
        $scope.onlyReprogram = onlyReprogram;
        $scope.getDataFiltered();
    };

    function getFilterRangeDate() {
        var minDate = moment($scope.dateIni + ' 00:00', 'DD/MM/YYYY HH:mm');
        var maxDate = moment($scope.dateFin + ' 23:59', 'DD/MM/YYYY HH:mm');

        var isMinDate = moment(minDate).isValid();
        var isMaxDate = moment(maxDate).isValid();

        var minDateFormat = moment(minDate).format('YYYY-MM-DD HH:mm');
        var maxDateFormat = moment(maxDate).format('YYYY-MM-DD HH:mm');

        var queryFilterRangeDate = !isMinDate && isMaxDate ? ''.concat('( dateReprogram <= "', maxDateFormat, '")') :
            isMinDate && !isMaxDate ? ''.concat('( dateReprogram >="', minDateFormat, '")') :
                isMinDate && isMaxDate ? ''.concat('( dateReprogram >= "', minDateFormat, '" and  dateReprogram <="', maxDateFormat, '")') : '';
        return queryFilterRangeDate;
    }

    function getFullTextSearch(searchText) {
        var fullTextSearchQuery = $scope.search ? ' and '.concat(' (fullName like "%', $scope.search, '%" or maxCylinder like "%', $scope.search, '%" or numberId like "%', $scope.search, '%" or expireDate like "%', $scope.search, '%")') : '';
        return fullTextSearchQuery;
    }

    function getFilterOnlyReprogram() {
        var query = $scope.onlyReprogram == 0 ? '' : ''.concat();
        return query;
    }

    function generateWhereQuery() {
        var query = ' where length(mobile)>1 and status not in("\'"ANULADA"\'") and statusTicket in("\'"Notificado"\'","\'"Pendiente"\'") '.
            concat(' and dateReprogram is not null');

        if (getFilterRangeDate()) {
            query = query.concat(' and ', getFilterRangeDate());
        }

        if (getFullTextSearch())
            query = query.concat(getFullTextSearch($scope.search));

        return query;
    }

    $scope.getDataFiltered = function () {

        if (($.isNumeric($scope.minRangeExpire) && $.isNumeric($scope.maxRangeExpire) && $scope.minRangeExpire > $scope.maxRangeExpire)
            || ($.isNumeric($scope.minRangeCountCylinder) && $.isNumeric($scope.maxRangeCountCylinder) && $scope.minRangeCountCylinder > $scope.maxRangeCountCylinder)) {
            toastr.warning('El filtro desde debe ser menor al filtro hasta');
            return;
        }

        var filters = {
            tableName: 'Customers',
            columnsName: ''.concat(' id,code,numberId,fullName,address,maxCylinder,expireDate,isMember,DATE_FORMAT(dateReprogram, "\'"%d/%m/%Y"\'") as reprogramDate '),
            pageSize: $scope.pageSize,
            currentPage: $scope.currentPage,
            where: generateWhereQuery().concat(' Order by dateReprogram asc ')
        }
        var response = procedureService.getListPaging(filters);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                if (res.data) {
                    $scope.totalRows = res.data.length > 0 ? res.data[0].TotalRows : 0;
                    $scope.customers = res.data;
                    $scope.numberOfPages = $scope.totalRows > 0 ? Math.ceil($scope.totalRows / $scope.pageSize) : 0;
                    loadPages($scope.numberOfPages);
                }
            }
        });
    };

    $scope.clearFilters = function () {
        $scope.search = null;
        $scope.dateIni = moment().format('DD/MM/YYYY');
        $scope.dateFin = moment().format('DD/MM/YYYY');
        $scope.currentPage = 1;
        $scope.getDataFiltered();
    };

    $scope.openTicket = function (customer) {
        $location.path('/ticket/' + customer.id);
    };    

    init();
    function init() {
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
        $scope.pagesForpage = [];
        $scope.currentPage = 1;
        dataCustomer();

        $scope.filterRowsByPage = [10, 25, 50, 100];
        $scope.dateRanges = [{ id: 1, range: 'Dia' }, { id: 2, range: 'Mes' }, { id: 3, range: 'Año' }];
        $scope.dateRange = $scope.dateRanges[0];
        $scope.pageSize = $scope.filterRowsByPage[0];
    }
});