app.service('ticketService', function ($http, $q) {

    this.save = function (ticket) {
        var defer = $q.defer();
        $http.post('/tickets/create', ticket).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function () {
        var defer = $q.defer();
        $http.get('/tickets?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getForIdCustomer = function (filters) {
        var defer = $q.defer();
        $http.post('/tickets/forid', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.delete = function (ticket) {
        var defer = $q.defer();
        $http.post('/tickets/delete', ticket).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.notificate = function (dataMail) {
        var defer = $q.defer();
        $http.post('/tickets/notificate', dataMail).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});