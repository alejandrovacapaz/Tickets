app.controller('cylinderController', function ($scope, $filter, cylinderService) {
   
    function dataCylinder() {
        $scope.editCylinder = { id: 0 };
    }

    function getList() {
        var response = cylinderService.getAll();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.cylinders = res.data; }
        });
    }

    $scope.saveCylinder = function () {
        $scope.editCylinder;
        if ($scope.editCylinder.id == 0) {
            var response = cylinderService.save($scope.editCylinder);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    getList();
                    dataCylinder();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = cylinderService.update($scope.editCylinder);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    getList();
                    dataCylinder();
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.deleteCylinder = function () {
        var response = cylinderService.delete($scope.editCylinder);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $("#modal-delete").modal("hide");
                dataCylinder();
                getList();
                toastr.success(res.message);
            }
        });
    };

    $scope.selectedCylinder = function (cylinder, option) {
        $scope.editCylinder = angular.copy(cylinder);
    };

    $scope.validateControls = function () {
        return $scope.editCylinder == null || $scope.editCylinder.code == null
        || $scope.editCylinder.license == null || $scope.editCylinder.marke == null
        || $scope.editCylinder.model == null || $scope.editCylinder.standard == null;
    };

    $scope.newCylinder = function () {
        dataCylinder();
    };

    init();
    function init() {
        getList();
        dataCylinder();
        $scope.filterRowsByPage = [10, 25, 50, 100];
        $scope.pageSize = $scope.filterRowsByPage[0];
    }
});