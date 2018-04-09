function initDirectives() {
	palletManagerApp.directive('exerciseRow',
		function () {
			return {
				templateUrl: "templates/directives/exerciseRow.html",
				restrict: "E",
				controller: 'exerciseRowCtrl',
				scope: {
					exercise: "="
				}
			}
		}
	);

	palletManagerApp.directive('exerciseChart',
		function () {
			return {
				templateUrl: "templates/directives/exerciseChart.html",
				restrict: "E",
				controller: 'exerciseChartCtrl',
				scope: {
					exerciseId: "="
				}
			}
		}
	);
}