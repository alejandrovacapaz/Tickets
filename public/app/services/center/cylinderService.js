app.service('cylinderService', function ($http, $q) {

    this.save = function (cylinder) {
        var defer = $q.defer();
        $http.post('/cylinders/create', cylinder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.update = function (cylinder) {
        var defer = $q.defer();
        $http.post('/cylinders/update', cylinder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function () {
        var defer = $q.defer();
        $http.get('/cylinders?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.delete = function (cylinder) {
        var defer = $q.defer();
        $http.post('/cylinders/delete', cylinder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});