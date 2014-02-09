angular.module('App.Filters', [])
  .filter('with_platform_currency', function() {
  return function(products, platform, currency) {
      return _.filter(products, function(product){
          return product.platform.getKey() == platform.getKey() &&
            product.currency == currency;
      });
  }
}).filter('with_product', function() {
  return function(transactions, product) {
      return _.filter(transactions, function(transaction){
          return transaction.product.getKey() == product.getKey();
      });
  }
}).filter('with_product', function() {
  return function(transactions, product) {
      return _.filter(transactions, function(transaction){
          return transaction.product.getKey() == product.getKey();
      });
  }
});
