app.service('carService', function ($http, $q) {

    this.save = function (car) {
        var defer = $q.defer();
        $http.post('/cars/create', car).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.update = function (car) {
        var defer = $q.defer();
        $http.post('/cars/update', car).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.updateByNumberPlate = function (car) {
        var defer = $q.defer();
        $http.post('/cars/updateByNumberPlate', car).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function () {
        var defer = $q.defer();
        $http.get('/cars?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.findByNumberPlate = function (car) {
        var defer = $q.defer();
        $http.post('/cars/forNumberPlate', car).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.delete = function (car) {
        var defer = $q.defer();
        $http.post('/cars/delete', car).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };   
});