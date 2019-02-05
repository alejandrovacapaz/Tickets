app.service('questionService', function ($http, $q) {

    this.save = function (question) {
        var defer = $q.defer();
        $http.post('/questions/create', question).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.update = function (question) {
        var defer = $q.defer();
        $http.post('/questions/update', question).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getAll = function () {
        var defer = $q.defer();
        $http.get('/questions?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.delete = function (question) {
        var defer = $q.defer();
        $http.post('/questions/delete', question).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.saveQuestionTicket = function (question) {
        var defer = $q.defer();
        $http.post('/questionTickets/create', question).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});