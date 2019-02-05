app.controller('searchController', function ($scope, $filter, $rootScope, $location, procedureService, filterService) {

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

    $scope.selectFilterMember = function (typeMemberFilter) {
        $scope.typeMemberFilter = typeMemberFilter;
        $scope.getDataFiltered();
    };

    $scope.selectOrderFilter = function (order) {
        $scope.order = order;
        $scope.getDataFiltered();
    };

    function getFullTextSearch(searchText) {
        var fullTextSearchQuery = $scope.search ? ' and '.concat(' (fullName like "%', $scope.search, '%" or maxCylinder like "%', $scope.search, '%" or numberId like "%', $scope.search, '%" or expireDate like "%', $scope.search, '%")') : '';
        return fullTextSearchQuery;
    }

    function getFilterRangeCylinder() {
        var minFilter = $scope.minRangeCountCylinder;
        var maxFilter = $scope.maxRangeCountCylinder;
        var queryFilterRangeCylinder = !$.isNumeric(minFilter) && $.isNumeric(maxFilter) ? ''.concat('( maxCylinder <= ', maxFilter, ')') :
            $.isNumeric(minFilter) && !$.isNumeric(maxFilter) ? ''.concat('( maxCylinder >=', minFilter, ')') :
                $.isNumeric(minFilter) && $.isNumeric(maxFilter) ? ''.concat('( maxCylinder >= ', minFilter, ' and  maxCylinder <=', maxFilter, ')') : '';
        return queryFilterRangeCylinder;
    }

    function getFilterRangeExpire() {
        var minFilter = $scope.minRangeExpire;
        var maxFilter = $scope.maxRangeExpire;

        if ($scope.dateRange && $scope.dateRange.id == 2) {
            minFilter = $.isNumeric(minFilter) ? minFilter * 30 : null;
            maxFilter = $.isNumeric(maxFilter) ? maxFilter * 30 : null;
        }
        if ($scope.dateRange && $scope.dateRange.id == 3) {
            minFilter = $.isNumeric(minFilter) ? minFilter * 360 : null;
            maxFilter = $.isNumeric(maxFilter) ? maxFilter * 360 : null;
        }

        var queryFilterRangeExpire = !$.isNumeric(minFilter) && $.isNumeric(maxFilter) ? ''.concat('( expireDate <= ', maxFilter, ')') :
            $.isNumeric(minFilter) && !$.isNumeric(maxFilter) ? ''.concat('( expireDate >=', minFilter, ')') :
                $.isNumeric(minFilter) && $.isNumeric(maxFilter) ? ''.concat('( expireDate >= ', minFilter, ' and  expireDate <=', maxFilter, ')') : '';

        $scope.rangeDateFilter = !$.isNumeric(minFilter) && $.isNumeric(maxFilter) ? ''.concat('Menor al: ', moment().add('days', -365).add('days', maxFilter).format('DD/MM/YYYY')) :
        $.isNumeric(minFilter) && !$.isNumeric(maxFilter) ? ''.concat('Mayor al: ', moment().add('days', -365).add('days', minFilter).format('DD/MM/YYYY')) :
            $.isNumeric(minFilter) && $.isNumeric(maxFilter) ? 'Del '.concat(moment().add('days', -365).add('days', minFilter).format('DD/MM/YYYY'), ' al ', moment().add('days', -365).add('days', maxFilter).format('DD/MM/YYYY')) : '';
        return queryFilterRangeExpire;
    }

    function getFilterIsMember() {
        var queryIsMemberFilter = $scope.typeMemberFilter == 2 ? '' : ''.concat(' isMember = ', $scope.typeMemberFilter);
        return queryIsMemberFilter;
    }

    function getOrderQuery() {
        var orderQuery = $scope.order == 2 ? " maxCylinder DESC, expireDate ASC " : " expireDate ASC, maxCylinder DESC ";
        return ' ORDER BY '.concat(orderQuery);
    }

    function generateWhereQuery() {
        var query = ' where length(mobile)>1 and status not in("\'"ANULADA"\'") and statusTicket in("\'"Notificado"\'","\'"Pendiente"\'") '
        orderQuery = '';
        if (getFullTextSearch())
            query = query.concat(getFullTextSearch($scope.search));

        if (getFilterRangeExpire()) {
            query = query.concat(' and ', getFilterRangeExpire());
        }
        if (getFilterRangeCylinder()) {
            query = query.concat(' and ', getFilterRangeCylinder());
        }
        if (getFilterIsMember()) {
            query = query.concat(' and ', getFilterIsMember());
        }

        return query.concat(getOrderQuery());
    }

    $scope.getDataFiltered = function () {

        if (($.isNumeric($scope.minRangeExpire) && $.isNumeric($scope.maxRangeExpire) && $scope.minRangeExpire > $scope.maxRangeExpire)
            || ($.isNumeric($scope.minRangeCountCylinder) && $.isNumeric($scope.maxRangeCountCylinder) && $scope.minRangeCountCylinder > $scope.maxRangeCountCylinder)) {
            toastr.warning('El filtro desde debe ser menor al filtro hasta');
            return;
        }

        var filters = {
            tableName: 'Customers',
            columnsName: ''.concat(' id,code,numberId,fullName,address,maxCylinder,expireDate,isMember,DATE_FORMAT(dateReprogram, "\'"%d/%m/%Y"\'") as dateReprogram '),
            pageSize: $scope.pageSize,
            currentPage: $scope.currentPage,
            where: generateWhereQuery()
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

    $scope.validateControls = function () {
        return $scope.dateRange == null && $scope.daysToExpire == null;
    };

    function getFilterByUser() {
        var filter = { idUser: $rootScope.currentUser.id };
        var response = filterService.getByUser(filter);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                if (!res.data) {
                    $scope.pageSize = 10;
                    $scope.typeMemberFilter = 2;
                    $scope.order = 1;
                } else {
                    $scope.pageSize = res.data.pageSize;
                    $scope.typeMemberFilter = res.data.typeMemberFilter;
                    $scope.order = res.data.orderList;
                    $scope.search = res.data.search;
                    $scope.minRangeExpire = res.data.minRangeExpire;
                    $scope.maxRangeExpire = res.data.maxRangeExpire;
                    $scope.minRangeCountCylinder = res.data.minRangeCountCylinder;
                    $scope.maxRangeCountCylinder = res.data.maxRangeCountCylinder;
                    $scope.dateRange = $scope.dateRanges.where(function (item) { return item.id == res.data.typeRange }).first();
                }
            }
            $scope.getDataFiltered();
        });
    };

    $scope.clearFilters = function () {
        $scope.search = null;
        $scope.maxRangeCountCylinder = null;
        $scope.minRangeCountCylinder = null;
        $scope.minRangeExpire = null;
        $scope.maxRangeExpire = null;
        $scope.typeMemberFilter = 2;
        $scope.currentPage = 1;
        $scope.dateRange = $scope.dateRanges[0];
        $scope.getDataFiltered();
        $scope.rangeDateFilter = null;
    };

    $scope.saveFilterByUser = function () {
        var data = {
            idUser: $rootScope.currentUser.id,
            pageSize: $scope.pageSize,
            typeMemberFilter: $scope.typeMemberFilter,
            typeRange: $scope.dateRange.id,
            order: $scope.order,
            search: $scope.search,
            minRangeExpire: $scope.minRangeExpire,
            maxRangeExpire: $scope.maxRangeExpire,
            minRangeCountCylinder: $scope.minRangeCountCylinder,
            maxRangeCountCylinder: $scope.maxRangeCountCylinder,
        }
        var response = filterService.save(data);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                toastr.success("Se actualizó correctamente");
            }
        });
    };

    $scope.openTicket = function (customer) {
        $location.path('/ticket/' + customer.id);
    };

    init();
    function init() {
        $scope.totalRows = 0;
        $scope.pagesForpage = [];
        $scope.currentPage = 1;
        dataCustomer();

        $scope.filterRowsByPage = [10, 25, 50, 100];
        $scope.dateRanges = [{ id: 1, range: 'Dia' }, { id: 2, range: 'Mes' }, { id: 3, range: 'Año' }];
        $scope.dateRange = $scope.dateRanges[0];
        $scope.pageSize = $scope.filterRowsByPage[0];

        $scope.rangeDateFilter = null;

        getFilterByUser();
    }
});