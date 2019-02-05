app.service('customerService', function ($http, $q) {

    this.save = function (customer) {
        var defer = $q.defer();
        $http.post('/customers/create', customer).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.update = function (customer) {
        var defer = $q.defer();
        $http.post('/customers/update', customer).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.updateStatus = function (customer) {
        var defer = $q.defer();
        $http.post('/customers/updateStatus', customer).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function (filters) {
        var defer = $q.defer();
        $http.post('/customers?', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getForIdCustomer = function (filters) {
        var defer = $q.defer();
        $http.post('/customers/forid', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getListForIdCustomer = function (filters) {
        var defer = $q.defer();
        $http.post('/customers/listByCustomer', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };   

    this.delete = function (customer) {
        var defer = $q.defer();
        $http.post('/customers/delete', customer).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});