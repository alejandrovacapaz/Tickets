app.directive('validate', [function () {
    return {
        require: "ngModel",
        link: function (scope, elm, attrs, ctrl) {

            var validate = $(elm).attr("validate");
            var validateRE = "";
            var nameinput = attrs.ngModel.substr(attrs.ngModel.lastIndexOf('.') + 1);
            var name = nameinput + "alert";
            var message = "";
            ctrl.$parsers.unshift(function (viewValue) {
                switch (validate) {
                    case 'text':
                        message = "Solo se permiten letras";
                        validateRE = /^[A-Za-z\sÑñ]*$/;
                        break;
                    case 'text-we':
                        message = "Solo se permiten letras";
                        validateRE = /^[A-Za-z\s]*$/;
                        break;
                    case 'text-number':
                        message = "Solo se permite letras y numeros";
                        validateRE = /^[A-Za-z\s0-9]*$/;
                        break;
                    case 'text-number-hour':
                        message = "Solo se permite letras y numeros";
                        validateRE = /^[A-Za-z\s0-9:]*$/;
                        break;
                    case 'number':
                        message = "No es un número válido";
                        validateRE = /^[0-9.]*$/;
                        break;
                    case 'number-integer':
                        message = "No es un número válido";
                        validateRE = /^[0-9]*$/;
                        break;
                    case 'telephone-number':
                        message = "No es un número de celular válido";
                        validateRE = /^[s0-9]{8}$/;
                        break;
                    case 'telephone':
                        message = "No es un número telefono válido";
                        validateRE = /^[s0-9]{7}$/;
                        break;
                    case 'real':
                        message = "No es un número válido";
                        validateRE = /^[+-]?\d+([,.]\d+)?$/;
                        break;
                    case 'mail':
                        message = "No es una direccion de correo válida";
                        validateRE = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
                        break;
                    case 'user':
                        message = "Usuario no válido";
                        validateRE = /^[a-z\d_]{4,20}$/i;
                        break;
                    case 'password':
                        message = "Contraseña [Minimo 6 caracteres: numeros, letras, mayuscula y un caracter especial]";
                        validateRE = /(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
                        break;
                    case 'fecha':
                        message = "Fecha no válida";
                        validateRE = /^([0][1-9]|[12][0-9]|3[01])(\/|-)([0][1-9]|[1][0-2])\2(\d{4})$/;
                        break;
                    case 'nameformula':
                        message = "Nombre no valido";
                        validateRE = /^[A-z\\\_][\w\.]?.{0,62}$/;
                        break;
                    case 'url':
                        message = "URL no válida";
                        validateRE = /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/;
                        break;
                    case 'decimal':
                        message = "No es un número válido";
                        validateRE = /^[0-9]*\,?[0-9]*$/;
                        break;
                    default:
                        validateRE = /./;
                }

                var ngShow = "<span style='color: red;' class='error validationerror' id='" + name + "'>&nbsp;" + message + "</span>";

                $(elm).focusout(function () {
                    // $("#" + name).fadeOut();
                });

                if ($(elm).attr("required") && $(elm).val() === '') {
                    var textTranslated = "campo requerido";
                    message = textTranslated;
                    if (!$("#" + name).length) {
                        $(elm).after(ngShow);
                    }
                    $("#" + name).css('display', 'block').text(message);
                    $("#" + name).fadeIn();

                } else
                    if (validateRE.test(viewValue) || $(elm).val() === '') {
                        ctrl.$setValidity('validate', true);
                        if ($("#" + name).length) {
                            $("#" + name).fadeOut();
                        }
                    }
                    else {
                        ctrl.$setValidity('validate', false);
                        if (!$("#" + name).length) {
                            $(elm).after(ngShow);
                        } else {
                            $("#" + nameinput).addClass("validateInput");
                            $("#" + name).css('display', 'block').text(message);
                            $("#" + name).fadeIn();
                        }
                        return undefined;
                    }

                $("#" + nameinput).removeClass("validateInput");
                return viewValue;
            });
        }
    };
}]);