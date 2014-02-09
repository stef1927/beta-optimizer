
app.controller('NavController', function ($scope, $location) {  
  $scope.isActive = function(route) { return route == $location.path(); }
});

app.controller('TransactionsController', function ($scope, data_factory, alert_service){
  $scope.transactions = data_factory.getTransactions();
  $scope.products = data_factory.getProducts();
  $scope.sides = data_factory.getSides();
  $scope.new_transaction = data_factory.getDefaultTransaction();

  $scope.addTransaction = function(){
    console.log('Adding: ' + JSON.stringify($scope.new_transaction));
    var res = data_factory.addTransaction($scope.new_transaction);
    if (!res.ok)
      alert_service.add("error", "Failed to add transaction: " + res.error);
  };

  $scope.deleteTransaction = function(t){
    console.log('Deleting: ' + JSON.stringify(t));
    var res = data_factory.deleteTransaction(t);
    if (!res.ok)
      alert_service.add("error", "Failed to delete transaction: " + res.error);
  };
});

app.controller('ProductsController', function ($scope, data_factory, alert_service){
  $scope.products = data_factory.getProducts();
  $scope.platforms = data_factory.getPlatforms();
  $scope.new_product = data_factory.getDefaultProduct();

  $scope.addProduct = function(){
    console.log('Adding: ' + JSON.stringify($scope.new_product));
    var res = data_factory.addProduct($scope.new_product);
    if (!res.ok)
      alert_service.add("error", "Failed to add product: " + res.error);
  };

  $scope.deleteProduct = function(p){
    console.log('Deleting: ' + JSON.stringify(p));
    var res = data_factory.deleteProduct(p);
    if (!res.ok)
      alert_service.add("error", "Failed to delete product: " + res.error);
  };

  $scope.productsArray = function() {
    var ret = [];
    for (p in $scope.products)
      ret.push($scope.products[p]);

    return ret;
  };
});

app.controller('PlatformsController', function ($scope, data_factory, alert_service){
  $scope.platforms = data_factory.getPlatforms();
  $scope.new_platform = data_factory.getDefaultPlatform();

  $scope.addPlatform = function(){
    console.log('Adding: ' + JSON.stringify($scope.new_platform));
    var res = data_factory.addPlatform($scope.new_platform);
    if (!res.ok)
      alert_service.add("error", "Failed to add platform: " + res.error);
  };

  $scope.deletePlatform = function(p){
    console.log('Deleting: ' + JSON.stringify(p));
    var res = data_factory.deletePlatform(p);
    if (!res.ok)
      alert_service.add("error", "Failed to delete platform: " + res.error);
  };
});

app.controller('HoldingsController', function ($scope, data_factory){
  $scope.platforms = data_factory.getPlatforms();
  $scope.currencies = data_factory.getCurrencies();
  $scope.products = data_factory.getProducts();

  $scope.getTransactions = function(product) {
    return _.filter(transactions, function(transaction){
      return transaction.product.getKey() == product.getKey();
    });
  }

  $scope.getNet = function(product) {
    var net = 0;
    var transactions = $scope.getTransactions(product);
    for (t in transactions) {
      net += transactions[t].getNet();
    }
    return net;
  }

  $scope.getAverage = function(product) {
    var transactions = $scope.getTransactions(product);
    if (transactions.length == 0)
      return 0;

    return $scope.getNet(transactions) / transactions.length;
  }

  $scope.getTransactions = function(platform, currency) {
    return _.filter(transactions, function(transaction){
      return transaction.product.platform.getKey() == platform.getKey() &&
        transaction.product.currency == currency;
    });
  }

  $scope.getNet = function(platform, currency) {
    var net = 0;
    var transactions = $scope.getTransactions(platform, currency);
    for (t in transactions) {
      net += transactions[t].getNet();
    }
    return net;
  }

  $scope.getAverage = function(platform, currency) {
    var transactions = $scope.getTransactions(platform, currency);
    if (transactions.length == 0)
      return 0;

    return $scope.getNet(transactions) / transactions.length;
  }

});  
