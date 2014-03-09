angular.module('App.Filters', [])
  .filter('with_currency', function() {
  return function(products, currency) {
      return _.filter(products, function(product){
          return product.currency == currency;
      });
  };
}).filter('with_transactions', function() {
  return function(currency, platform, scope) {
    var transactions = scope.platformTransactions(platform, currency);
    return transactions && transactions.length > 0;
  };
});
