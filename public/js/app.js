var palletManagerApp;
var palletManagerControllers;

function initAngular() {
    palletManagerControllers = angular.module('palletManagerControllers', []);

    palletManagerApp = angular.module('palletManagerApp', [
        'ngRoute',
        'pascalprecht.translate',
        'palletManagerControllers'
    ]);
}

function configAngular() {
    palletManagerApp.config(['$routeProvider', '$compileProvider', '$httpProvider', '$translateProvider',
        function($routeProvider, $compileProvider, $httpProvider, $translateProvider) {
            var simpleRoutes = [
                "landing",
                "palletInsert",
                "palletRemoval",
                "dataExport"
            ]
            
            $.each(simpleRoutes, function(index, route) {
                $routeProvider.when("/" + route, {
                    templateUrl: "templates/" + route + ".html",
                    controller: route + "Ctrl"
                });
            });

            $routeProvider.otherwise({
                redirectTo: '/landing'
            });

            $translateProvider.useStaticFilesLoader({
                prefix: 'lang/',
                suffix: '.json'
            });
            
            var storedLang = localStorage.storedLang;

            if (!storedLang) {
                $translateProvider.preferredLanguage('ru');
            } else {
                $translateProvider.preferredLanguage(storedLang);
            }

            $translateProvider.useSanitizeValueStrategy('escape');

            //$httpProvider.defaults.withCredentials = true;
        }
    ]);
}