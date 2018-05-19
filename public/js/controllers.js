function initControllers() {
	palletManagerControllers.controller('landingCtrl', ['$scope', '$timeout', '$location', '$filter', '$translate', 'DataStoreService',
		function ($scope, $timeout, $location, $filter, $translate, dataStore, gymVisitService) {
			$scope.currentLang = $translate.use();
			$scope.theOtherLang = "";

			$scope.currentLang == "fi" ? $scope.theOtherLang = "ru" : $scope.theOtherLang = "fi";

			var t = $filter("translate");

			$scope.switchLanguage = function () {
				if ($scope.currentLang == "ru") {
					$translate.use("fi");
					$scope.currentLang = "fi";
					$scope.theOtherLang = "ru";
					localStorage.storedLang = "fi";
				} else {
					$translate.use("ru");
					$scope.currentLang = "ru";
					$scope.theOtherLang = "fi";
					localStorage.storedLang = "ru";
				}
			}

			$scope.toPalletInsert = function() {
				$location.path("/palletInsert");
			}

			$scope.toPalletRemoval = function() {
				$location.path("/palletRemoval");
			}

			$scope.toDataExport = function() {
				$location.path("/dataExport");
			}
		}
	]);

	palletManagerControllers.controller('palletInsertCtrl', ['$scope', '$location', '$filter', 'BackEndService',
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
						$location.path("/landing");
					}, function () {
						$scope.validationErrors.push(t("general.validationErrors.slotNotEmpty"));
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

	palletManagerControllers.controller('palletRemovalCtrl', ['$scope', '$location', '$translate', 'BackEndService',
		function ($scope, $location, $translate, BackEndService) {
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

	palletManagerControllers.controller('dataExportCtrl', ['$scope', '$location', 'BackEndService',
		function ($scope, $location, BackEndService) {
			$scope.exportData = function () {
				window.open("/api/exportSlots");
			}

			$scope.toLanding = function() {
				$location.path("/landing");
			}
		}
	]);
}