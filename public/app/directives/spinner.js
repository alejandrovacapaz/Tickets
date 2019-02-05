app.directive('numberSpin', [function () {
    return {
        restrict: 'E',
        scope: {
            "ngModel": '=',
            "functionToExecute": '@',
            "mode": '@',
            "minvalue": '@'
        },
        templateUrl: '/app/partials/shared/spinner.html',
        link: function (scope, elem, attrs) {

            scope.onlyNumbers = scope.mode == "decimal" ? /[^\d.]/g : scope.mode == "negative" ? /[^\d-]/g : /[^\d]/g

            elem.on("keyup", function (e) {                
                var inputValue = $(elem).find("input[type=text]").val();
                var transformedInput = inputValue ? inputValue.replace(scope.onlyNumbers, '') : null;
                scope.ngModel = transformedInput;
                scope.$apply();
            })

            scope.plus = function () {
                if (!$.isNumeric(scope.ngModel)) {
                    scope.ngModel = 0;
                }

                scope.ngModel = parseInt(scope.ngModel) + 1;
            }

            scope.minus = function () {
                if (!$.isNumeric(scope.ngModel)) {
                    scope.ngModel = 0;
                }

                scope.ngModel = parseInt(scope.ngModel) - 1;

                if (scope.minvalue && scope.ngModel < parseInt(scope.minvalue))
                    scope.ngModel = 1;
            }
        }
    }
}]);