angular.module('App.Filters', [])
  .filter('with_platform_currency', function() {
  return function(products, platform, currency) {
      return _.filter(products, function(product){
          return product.platform.getKey() == platform.getKey() &&
            product.currency == currency;
      });
  };
}).filter('with_transactions', function() {
  return function(currency, platform) {
    var transactions = $scope.platformTransactions(platform, currency);
    return transactions && transactions.length > 0;
  };
});
