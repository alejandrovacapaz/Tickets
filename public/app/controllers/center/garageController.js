app.controller('garageController', function ($scope, $filter, $rootScope, garageService) {

    function dataGarage() {
        $scope.editGarage = { id: 0, isPartner: false };
    }

    function getList() {
        var response = garageService.getAll();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.garages = res.data; }
        });
    }

    $scope.openModalMap = function () {
        $rootScope.$broadcast('showModalMap');
    };

    $scope.selectCoordinate = function (coordinates) {
        $scope.editGarage.latitude = coordinates.latitude;
        $scope.editGarage.longitude = coordinates.longitude;
    };

    $scope.confirmAction = function () {
    };

    $scope.saveGarage = function () {
        $scope.editGarage;
        $scope.editGarage.enabled = $scope.selectedEnabled.id;
        if ($scope.editGarage.id == 0) {
            var response = garageService.save($scope.editGarage);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    getList();
                    dataGarage();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = garageService.update($scope.editGarage);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    getList();
                    dataGarage();
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.deleteGarage = function () {
        var response = garageService.delete($scope.editGarage);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $("#modal-delete").modal("hide");
                dataGarage();
                getList();
                toastr.success(res.message);
            }
        });
    };

    $scope.selectedGarage = function (garage) {
        $scope.editGarage = angular.copy(garage);
        $scope.selectedEnabled = $scope.garageStatus.where(function (item) { return item.id == garage.enabled }).first();
    };

    $scope.validateControls = function () {
        return $scope.editGarage == null || $scope.editGarage.code == null
            || $scope.editGarage.license == null || $scope.editGarage.fullName == null
            || $scope.editGarage.address == null || $scope.selectedEnabled == null;
    };

    $scope.newGarage = function () {
        dataGarage();
    };

    init();
    function init() {
        getList();
        dataGarage();

        $scope.filterRowsByPage = [10, 25, 50, 100];
        $scope.pageSize = $scope.filterRowsByPage[0];

        $scope.garageStatus = [
            { id: 'Habilitado', text: 'Habilitado' },
            { id: 'Inhabilitado', text: 'Inhabilitado' },
            { id: 'Cerrado', text: 'Cerrado' }
        ];
    }
});