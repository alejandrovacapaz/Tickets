app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13 && !scope.validateControls()) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('ngPressEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngPressEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('panelCollapse', function () {
    return function (scope, element, attrs) {
        $(element).collapsePanel();
    };
});