app.filter('filterGarage', function () {
    return function (items, isPartner) {
        if (!isPartner) return items;

        var filtered = [];

        angular.forEach(items, function (item) {
            if (item.isPartner)
                filtered.push(item)
        });

        return filtered;
    }
});