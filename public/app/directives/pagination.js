
angular.module('uitls.paginate', [])
    .filter('paginate', function (Paginator, $filter) {
        return function (input, rowsPerPage, search) {
            if (!input) {
                return input;
            }

            if (input && search)
                input = $filter('filter')(input, search);

            if (rowsPerPage) {
                Paginator.rowsPerPage = rowsPerPage;
            }

            Paginator.itemCount = input.length;

            return input.slice(parseInt(Paginator.page * Paginator.rowsPerPage), parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1);
        }
    })

    .filter('forLoop', function () {
        return function (input, start, end) {
            input = new Array(end - start);
            for (var i = 0; start < end; start++ , i++) {
                input[i] = start;
            }

            return input;
        }
    })

    .service('Paginator', function ($rootScope) {
        this.page = 0;
        this.rowsPerPage = 8;
        this.itemCount = 0;

        this.setPage = function (page) {
            if (page > this.pageCount()) {
                return;
            }

            this.page = page;
        };

        this.onPageChanged = function () {
            $(document).trigger('onPageChanged', [{ page: this.page }]);
        }

        this.nextPage = function () {
            if (this.isLastPage()) {
                return;
            }
            this.page++;
            this.onPageChanged();
        };

        this.perviousPage = function () {
            if (this.isFirstPage()) {
                return;
            }
            this.page--;
            this.onPageChanged();
        };

        this.firstPage = function () {
            this.page = 0;
            this.onPageChanged();
        };

        this.lastPage = function () {
            this.page = this.pageCount() - 1;
            this.onPageChanged();
        };

        this.isFirstPage = function () {
            return this.page == 0;
        };

        this.isLastPage = function () {
            return this.page == this.pageCount() - 1;
        };

        this.pageCount = function () {
            return Math.ceil(parseInt(this.itemCount) / parseInt(this.rowsPerPage));
        };
    })

    .directive('paginator', function factory() {
        return {
            restrict: 'E',
            controller: function ($scope, Paginator) {
                $scope.pageSelected = 0;
                $scope.paginator = Paginator;
                $(document).on('onPageChanged', function (e, data) {
                    $scope.pageSelected = data.page;                    
                })

                $scope.changePage = function () {
                    Paginator.setPage($scope.pageSelected);
                }
            },
            templateUrl: '/app/partials/shared/pagination.html'
        };
    });