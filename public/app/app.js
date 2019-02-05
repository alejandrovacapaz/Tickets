var app = angular.module('callbackApp', ['ngRoute', 'uitls.paginate', 'ngStorage']);

app.run(function ($localStorage, $rootScope, $location, $timeout) {
    if ($localStorage.currentUser) {
        $rootScope.currentUser = $localStorage.currentUser;
        $rootScope.listMenuPermit = getModulesAndPages($rootScope.currentUser.permits);
        if ($rootScope.currentUser) {
            $rootScope.fullnameuser = $localStorage.currentUser.firstname + " " + $localStorage.currentUser.lastname;
            $rootScope.roleuser = $localStorage.currentUser.Role.title;
            //$timeout($enableSideBar, 500);
        }
    }
    else
        $location.path('/login');
});


app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: 'app/partials/home/home.html'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'app/partials/login.html'
        })
        .when('/role', {
            controller: 'roleController',
            templateUrl: 'app/partials/maintenance/role.html'
        })
        .when('/user', {
            controller: 'userController',
            templateUrl: 'app/partials/maintenance/user.html'
        })
        .when('/permit', {
            controller: 'permitController',
            templateUrl: 'app/partials/maintenance/permit.html'
        })
        .when('/search', {
            controller: 'searchController',
            templateUrl: 'app/partials/center/search.html'
        })
        .when('/searchQuality', {
            controller: 'searchQualityController',
            templateUrl: 'app/partials/center/searchQuality.html'
        })
        .when('/searchReprogram', {
            controller: 'searchReprogramController',
            templateUrl: 'app/partials/center/searchReprogram.html'
        })
        .when('/reportTicket', {
            controller: 'reportTicketController',
            templateUrl: 'app/partials/center/reportTicket.html'
        })
        .when('/reportByStatus', {
            controller: 'reportByStatusController',
            templateUrl: 'app/partials/center/reportByStatus.html'
        })
        .when('/ticket/:id', {
            controller: 'ticketController',
            templateUrl: 'app/partials/center/ticket.html'
        })
        .when('/garage', {
            controller: 'garageController',
            templateUrl: 'app/partials/center/garage.html'
        })
        .when('/cylinder', {
            controller: 'cylinderController',
            templateUrl: 'app/partials/center/cylinder.html'
        })
        .when('/car', {
            controller: 'carController',
            templateUrl: 'app/partials/center/car.html'
        })
        .when('/notice/confirmation/:id', {
            controller: 'notificationController',
            templateUrl: 'app/partials/home/notification.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                $(".loading").show();
                config.headers = config.headers || {};
                if ($localStorage.currentUser) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.currentUser.token;
                }
                return config;
            },
            'response': function (response) {

                $(".loading").hide();
                return response || $q.when(response);

            },
            'requestError': function (config) {
                console.log('requestError ', config.id, config);
                return q.reject(config);
                $(".loading").hide();
            },
            'responseError': function (response) {
                $(".loading").hide();
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);
});

function getModulesAndPages(permits) {
    if (permits && permits.length > 0) {
        var listpages = permits.select(function (item) {
            item.Page.moduleName = item.Page.Module.title;
            return item.Page;
        });

        var resultPages = listpages.groupBy(function (page) {
            return page.moduleName;
        })
        var listMenuPermit = resultPages.select(function (item) {
            return {
                moduleName: item.key,
                moduleClass: item.first().Module.class,
                pages: item.select(function (page) {
                    return {
                        path: page.path,
                        title: page.title
                    };
                })
            }
        });
        return listMenuPermit;
    } else {
        return listMenuPermit = {};
    }
}