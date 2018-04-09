function initFilters() {
    palletManagerApp.filter('formatDate', function ($filter) {
        return function (date) {
            var t = $filter("translate");
            var dateFormat = t("general.dateFormat");

            var momentDate = moment(date);
            
            if (momentDate.isValid()) {
                return momentDate.format(dateFormat);
            } else {
                return t("general.errorMessages.invalidDate");
            }
        }
    });
}