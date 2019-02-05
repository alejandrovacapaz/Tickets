app.service('workOrderService', function ($http, $q) {

    this.save = function (workOrder) {
        var defer = $q.defer();
        $http.post('/workOrders/create', workOrder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.saveManyOrders = function (workOrder) {
        var defer = $q.defer();
        $http.post('/workOrders/createManyOrders', workOrder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.update = function (workOrder) {
        var defer = $q.defer();
        $http.post('/workOrders/update', workOrder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function () {
        var defer = $q.defer();
        $http.get('/workOrders?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getForIdCustomer = function (filters) {
        var defer = $q.defer();
        $http.post('/workOrders/forid', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getByCustomer = function (filters) {
        var defer = $q.defer();
        $http.post('/workOrders/findByCustomer', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.delete = function (workOrder) {
        var defer = $q.defer();
        $http.post('/workOrders/delete', workOrder).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});