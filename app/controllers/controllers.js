
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
});  
