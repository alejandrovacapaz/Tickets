app.service('garageService', function ($http, $q) {

    this.save = function (garage) {
        var defer = $q.defer();
        $http.post('/garages/create', garage).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.update = function (garage) {
        var defer = $q.defer();
        $http.post('/garages/update', garage).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function () {
        var defer = $q.defer();
        $http.get('/garages?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

      this.getByPartner = function () {
        var defer = $q.defer();
        $http.get('/garages/getByPartner?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.delete = function (garage) {
        var defer = $q.defer();
        $http.post('/garages/delete', garage).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});