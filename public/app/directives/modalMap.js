app.directive('modalMap', ["$compile", "$rootScope",
    function ($compile, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                titleModal: '@titleModal',
                confirmAction: '&',
                cancelAction: '&',
                selectAction: '&',
                buttonAccept: '=',
                buttonCancel: '=',
                location: '=',
                listData: '=',
                mode: '@mode',
            },
            templateUrl: '/app/partials/shared/modalMap.html',
            link: function (scope, element, attrs) {
                scope.latlng = {};
                scope.map = {};
                scope.selectedGarage = null;
                $rootScope.urlToSend = null;

                $rootScope.$on("showModalMap", showModalMessage);

                function closeMarkers() {
                    angular.forEach(scope.listData, function (garage) {
                        if (garage.infowindow)
                            garage.infowindow.close();
                    })
                }

                scope.selectGarage = function (garage) {
                    if (garage.marker) {
                        closeMarkers();
                        google.maps.event.trigger(garage.marker, 'click');
                        $('#garage-' + garage.id).closest('.gm-style-iw').prev().find('div:nth-child(3)').next().effect("highlight", { color: "#62cb31" }, 3000);
                    }
                }

                scope.hideOrDisplayPartners = function () {
                    scope.showOnlyPartners = !scope.showOnlyPartners;
                }


                scope.asignGarage = function (garage) {
                    scope.selectedGarage = garage;
                    scope.confirmAction({ garage: scope.selectedGarage });
                    scope.selectedGarage.message = copyAndGetCoordinates();
                    $('.modal-map').modal('hide');
                }

                function showModalMessage(e, data) {
                    scope.lastCoordinates = angular.copy(scope.location);
                    loadAndDisplayMap();
                }

                function loadAndDisplayMap() {
                    loadMap();
                    $('.modal-map').modal('show');
                    rescaleMap();
                }

                scope.onConfirmAction = function (args) {
                    if (scope.selectAction && scope.mode != 'table') {
                        $('.modal-map').modal('hide');
                    } else {
                        scope.selectedGarage.message = copyAndGetCoordinates();
                        scope.confirmAction({ garage: scope.selectedGarage });
                        $('.modal-map').modal('hide');
                    }
                };

                scope.onCancelAction = function () {
                    scope.latlng = scope.lastCoordinates ? scope.lastCoordinates : {};
                    scope.selectAction({ coordinates: scope.latlng });
                    if (scope.cancelAction) {
                        $('.modal-map').modal('hide');
                        scope.cancelAction();
                    }
                    else {
                        $('.modal-map').modal('hide');
                    }
                };

                function copyAndGetCoordinates() {
                    var urlMap = "La dirección del taller: ".concat(scope.selectedGarage.fullName, " es: ", scope.selectedGarage.shortUrlMaps, " *Saludos,  El Club del GNV*");
                    $rootScope.urlToSend = urlMap;

                    $('#urlmap').html(urlMap);
                    return urlMap;
                }

                function rescaleMap() {
                    setTimeout(function () {
                        var size = { width: $(window).width(), height: $(window).height() }
                        var offset = 20;
                        var offsetBody = 150;
                        var modal = $('.modal-map');
                        modal.css('height', size.height - offset);
                        modal.find('.modal-body').css('height', size.height - (offset + offsetBody));
                        modal.find('.modal-lg').css({ 'margin-top': '5px', 'margin-bottom': '5px' })
                        modal.closest('.modal').css('padding-right', '0')
                        $('#map-canvas').height('100%');
                    }, 500);
                }

                function loadMap() {
                    setTimeout(function () {
                        var markers = [];
                        var mapOptions = {
                            center: new google.maps.LatLng(parseFloat(-17.800201), parseFloat(-63.181585)),
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                        if (scope.selectAction && scope.mode != 'table') {
                            google.maps.event.addListener(map, 'click', function (args) {
                                scope.latlng.latitude = args.latLng.lat();
                                scope.latlng.longitude = args.latLng.lng();
                                scope.selectAction({ coordinates: scope.latlng });
                                loadMarkerForCurrentCoordinate(args.latLng, markers);
                                scope.$apply();
                            });
                        }

                        if (scope.mode == 'table') {
                            setMarkers(map, scope.listData)

                        } else {
                            if (scope.location.latitude && scope.location.longitude) {
                                var larlng = new google.maps.LatLng(scope.location.latitude, scope.location.longitude);
                                loadMarkerForCurrentCoordinate(larlng, markers)
                                scope.$apply();
                            }
                        }
                    }, 1000)
                }

                function getLatLngFromString(data) {
                    return new google.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude));
                }

                function setMapOnAll(status, markers) {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(status);
                    }
                }

                scope.highlightGarage = function (garage) {
                    scope.selectedGarage = garage;
                    angular.forEach(scope.listData, function (currentGarage) {
                        currentGarage.hasClassSelected = false;
                    });
                    garage.hasClassSelected = true;
                }

                function clearMarkers(markers) {
                    setMapOnAll(null, markers);
                    markers = [];
                }

                function loadMarkerForCurrentCoordinate(location, markers) {
                    clearMarkers(markers);
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map
                    });
                    markers.push(marker);
                }

                function safeApply(scope, fn) {
                    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
                }

                function setMarkers(map, locations) {
                    var marker, i

                    for (i = 0; i < locations.length; i++) {
                        var currentLocation = locations[i];
                        if (currentLocation.latitude != null && currentLocation.longitude != null) {
                            latlngset = getLatLngFromString(currentLocation);
                            var marker = new google.maps.Marker({
                                map: map, title: currentLocation.fullName, position: latlngset
                            });
                            map.setCenter(marker.getPosition())

                            var content = "<div  class='info-window' id=garage-" + currentLocation.id + ">" + currentLocation.fullName + "</div>";
                            var infowindow = new google.maps.InfoWindow()

                            currentLocation.marker = marker;
                            currentLocation.infowindow = infowindow;
                            infowindow.currentGarage = currentLocation;
                            google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                                return function () {
                                    safeApply(scope, function () {
                                        closeMarkers();
                                        scope.highlightGarage(infowindow.currentGarage);
                                        infowindow.setContent(content);
                                        infowindow.open(map, marker);
                                    })

                                };
                            })(marker, content, infowindow));
                        } else {

                        }
                    }
                }
            }
        };
    }]);