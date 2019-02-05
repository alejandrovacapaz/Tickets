app.service('filterService', function ($http, $q) {

    this.save = function (data) {
        var defer = $q.defer();
        $http.post('/filterUsers/save', data).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getByUser = function (filter) {
        var defer = $q.defer();
        $http.post('/filterUsers/forid', filter).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});