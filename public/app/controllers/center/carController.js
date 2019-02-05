app.controller('carController', function ($scope, $filter, carService, commonService, procedureService) {

    $(document).on('onWindowSendData', function (e, data) {
        var carInfo = data;
        loadInformation(carInfo);
    })

    function loadInformation(carInfo) {
        $scope.editCar.make = carInfo['Marca'];
        $scope.editCar.model = carInfo['Tipo'];
        $scope.editCar.type = carInfo['Clase'];
        $scope.editCar.numberEngine = carInfo['Cilindrada (Cc.)'];
        $scope.editCar.color = carInfo['Color'];
        $scope.editCar.annum = carInfo['Modelo']
        $scope.editCar.detail = "Traccion ".concat(carInfo['Tracción'], ', Servicio ', carInfo['Servicio']);
        $scope.$apply();
    }

    $scope.openWindowRuat = function () {
        popup = openWindowPopup("/app/partials/shared/windowsPopup.html", 'CallBack System', '1024', '600');
        popup.focus();
    };

    function dataCar() {
        $scope.editCar = { id: 0 };
    }

    $scope.changeItem = function (item) {
        $scope.editCar.type = item;
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

    function getFullTextSearch(searchText) {
        var fullTextSearchQuery = $scope.search ? ''.concat(' (numberPlate like "%', $scope.search, '%" or make like "%', $scope.search, '%" or model like "%', $scope.search, '%" or type like "%', $scope.search, '%" or detail like "%', $scope.search, '%")') : '';
        return fullTextSearchQuery;
    }

    function generateWhereQuery() {
        var query = '';
        if (getFullTextSearch())
            query = query.concat(' where', getFullTextSearch($scope.search));

        return query;
    }

    $scope.getDataFiltered = function () {
        var filters = {
            tableName: 'Cars',
            columnsName: ''.concat(' numberPlate, make, model, type, detail '),
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
                    $scope.cars = res.data;
                    $scope.numberOfPages = $scope.totalRows > 0 ? Math.ceil($scope.totalRows / $scope.pageSize) : 0;
                    loadPages($scope.numberOfPages);
                }
            }
        });
    };

    $scope.saveCar = function () {
        $scope.editCar;
        if ($scope.editCar.id == 0) {
            var response = carService.save($scope.editCar);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    dataCar();
                    $scope.getDataFiltered();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = carService.updateByNumberPlate($scope.editCar);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    dataCar();
                    $scope.getDataFiltered();
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.deleteCar = function () {
        var response = carService.delete($scope.editCar);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $("#modal-delete").modal("hide");
                dataCar();
                $scope.getDataFiltered();
                toastr.success(res.message);
            }
        });
    };

    $scope.selectedCar = function (car, option) {
        $scope.editCar = angular.copy(car);
    };

    $scope.validateControls = function () {
        return $scope.editCar == null || $scope.editCar.numberPlate == null;
    };

    $scope.newCar = function () {
        dataCar();
    };

    init();
    function init() {
        $scope.totalRows = 0;
        $scope.pagesForpage = [];
        $scope.currentPage = 1;
        dataCar();

        $scope.filterRowsByPage = [10, 25, 50, 100];
        $scope.dateRanges = [{ id: 1, range: 'Dia' }, { id: 2, range: 'Mes' }, { id: 3, range: 'Año' }];
        $scope.dateRange = $scope.dateRanges[0];
        $scope.pageSize = $scope.filterRowsByPage[0];

        $scope.types = ['Auto', 'Camion', 'Jeep', 'Vagoneta'];

        $('#make').autocomplete({
            lookup: commonService.makesarray(),
            onSelect: function (item) {
                $scope.editCar.make = item.value;
            }
        });

        $('#color').autocomplete({
            lookup: commonService.colorsarray(),
            onSelect: function (item) {
                $scope.editCar.color = item.value;
            }
        });

        $scope.getDataFiltered();
    }
});