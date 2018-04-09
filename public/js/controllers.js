function initControllers() {
	saliControllers.controller('landingCtrl', ['$scope', '$timeout', '$location', '$filter', 'DataStoreService',
		function ($scope, $timeout, $location, $filter, dataStore, gymVisitService) {
			var storedRoutines = dataStore.get("routines");

			var t = $filter("translate");

			$scope.toPalletInsert = function() {
				$location.path("/palletInsert");
			}

			$scope.toPalletRemoval = function() {
				$location.path("/palletRemoval");
			}
		}
	]);

	saliControllers.controller('palletInsertCtrl', ['$scope', '$location', '$filter', 'BackEndService',
		function ($scope, $location, $filter, BackEndService) {
			$scope.validationErrors = [];
			$scope.pallet = {
				productName: "",
				productCount: "",
				warehouseSlot: "",
				notes: "",
				dateInserted: moment()
			}

			var t = $filter("translate");

			$scope.confirmInsert = function () {
				var fieldsAreValid = validate();

				if (fieldsAreValid) {
					BackEndService.insertPallet($scope.pallet).then(function (pallet) {
						console.log(pallet);

						$location.path("/landing");
					}, function () {
						// TODO: Error handling
					});
				}
			}

			$scope.toLanding = function() {
				$location.path("/landing");
			}

			function validate() {
				$scope.validationErrors = [];

				if ($scope.pallet.productName == "") {
					$scope.validationErrors.push(t("general.validationErrors.productNameEmpty"));
				}

				if ($scope.pallet.productCount == "") {
					$scope.validationErrors.push(t("general.validationErrors.productCountEmpty"));
				}

				if (!$.isNumeric($scope.pallet.productCount)) {
					$scope.validationErrors.push(t("general.validationErrors.productCountNotNumeric"));
				}

				if ($scope.pallet.warehouseSlot == "") {
					$scope.validationErrors.push(t("general.validationErrors.warehouseSlotEmpty"));
				}

				return $scope.validationErrors.length == 0;
			}
		}
	]);

	saliControllers.controller('palletRemovalCtrl', ['$scope', '$location', 'BackEndService',
		function ($scope, $location, BackEndService) {
			$scope.selectedSlot;
			$scope.searchTerm = "";
			$scope.searchResults = [];

			$scope.searchSlots = function () {
				BackEndService.searchSlots($scope.searchTerm).then(function (results) {
					$scope.selectedSlot = null;
					$scope.searchResults = results;
				}, function () {
					// TODO: Error handling
				});
			}

			$scope.selectSlot = function (selectedSlot) {
				$.each($scope.searchResults, function (index, slot) {
					slot.selected = slot.location == selectedSlot.location;
				});

				$scope.selectedSlot = selectedSlot;
			}

			$scope.confirmRemoval = function () {
				if (!$scope.selectedSlot) {
					return;
				}

				BackEndService.removePallet($scope.selectedSlot.id).then(function (pallet) {
					$location.path("/landing");
				}, function () {
					// TODO: Error handling
				});
			}

			$scope.toLanding = function() {
				$location.path("/landing");
			}
		}
	]);
}