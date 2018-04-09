function initServices() {
	palletManagerApp.factory('DataStoreService', function() {
		function store (key, data) {
			localStorage[key] = JSON.stringify(data);
		}

		function get(key) {
			if (typeof(localStorage[key]) == "undefined") {
				return false;
			}

			var jsonString = localStorage[key];
			var json;

			try {
				json = JSON.parse(jsonString);
			} catch (exception) {
				return false;
			};

			return json;
		}

		function remove(key) {
			localStorage.removeItem(key);
		}

		return {
			store: store,
			get: get,
			remove: remove
		}
	});

	palletManagerApp.factory('BackEndService', function($q, $http) {
		function makeRequest(reqData) {
			return $q(function (resolve, reject) {
				$http(reqData).then(function (response) {
					resolve(response.data);
				}, function (response) {
					reject(response);
				});
			});
		}

		return {
			insertPallet: function (pallet) {
				return makeRequest({
					url: "api/insertToSlot",
					method: "POST",
					data: {
						pallet: pallet
					}
				});
			},
			removePallet: function (slotId) {
				return makeRequest({
					url: "api/removeFromSlot/" + slotId,
					method: "DELETE"
				});
			},
			searchSlots: function (searchTerm) {
				return makeRequest({
					url: "api/searchSlots",
					method: "GET",
					params: {
						searchTerm: searchTerm
					}
				});
			}
		}
	});
}