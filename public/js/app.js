var palletManagerApp;
var saliControllers;

function initAngular() {
    saliControllers = angular.module('saliControllers', []);

    palletManagerApp = angular.module('palletManagerApp', [
        'ngRoute',
        'pascalprecht.translate',
        'saliControllers'
    ]);
}

function configAngular() {
    palletManagerApp.config(['$routeProvider', '$compileProvider', '$httpProvider', '$translateProvider',
        function($routeProvider, $compileProvider, $httpProvider, $translateProvider) {
            var simpleRoutes = [
                "landing",
                "palletInsert",
                "palletRemoval"
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
            
            $translateProvider.preferredLanguage('fi');

            $translateProvider.useSanitizeValueStrategy('escape');

            //$httpProvider.defaults.withCredentials = true;
        }
    ]);
}