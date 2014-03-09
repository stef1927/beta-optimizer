
app.controller('NavController', function ($scope, $location) {
  $scope.isActive = function (route) { return route === $location.path(); };
});

app.controller('TransactionsController', function ($scope, data_factory, alert_service) {
  $scope.transactions = data_factory.getTransactions();
  $scope.products = data_factory.getProducts();
  $scope.platforms = data_factory.getPlatforms();
  $scope.sides = data_factory.getSides();
  $scope.new_transaction = data_factory.getDefaultTransaction();

  $scope.addTransaction = function () {
    console.log('Adding: ' + JSON.stringify($scope.new_transaction));
    var res = data_factory.addTransaction($scope.new_transaction);
    if (!res.ok) {
      alert_service.add("error", "Failed to add transaction: " + res.error);
    }
  };

  $scope.deleteTransaction = function (t) {
    console.log('Deleting: ' + JSON.stringify(t));
    var res = data_factory.deleteTransaction(t);
    if (!res.ok) {
      alert_service.add("error", "Failed to delete transaction: " + res.error);
    }
  };
});

app.controller('ProductsController', function ($scope, data_factory, alert_service) {
  $scope.products = data_factory.getProducts();
  $scope.platforms = data_factory.getPlatforms();
  $scope.new_product = data_factory.getDefaultProduct();

  $scope.addProduct = function () {
    console.log('Adding: ' + JSON.stringify($scope.new_product));
    var res = data_factory.addProduct($scope.new_product);
    if (!res.ok) {
      alert_service.add("error", "Failed to add product: " + res.error);
    }
  };

  $scope.deleteProduct = function (p) {
    console.log('Deleting: ' + JSON.stringify(p));
    var res = data_factory.deleteProduct(p);
    if (!res.ok) {
      alert_service.add("error", "Failed to delete product: " + res.error);
    }
  };

  $scope.productsArray = function () {
    var ret = [];
    for (var p in $scope.products) {
      ret.push($scope.products[p]);
    }
    return ret;
  };
});

app.controller('PlatformsController', function ($scope, data_factory, alert_service) {
  $scope.new_platform = data_factory.getDefaultPlatform();
  $scope.platforms = data_factory.getPlatforms();

  $scope.addPlatform = function () {
    console.log('Adding: ' + JSON.stringify($scope.new_platform));
    var res = data_factory.addPlatform($scope.new_platform);
    if (!res.ok)
      alert_service.add("error", "Failed to add platform: " + res.error);
  };

  $scope.deletePlatform = function (p) {
    console.log('Deleting: ' + JSON.stringify(p));
    var res = data_factory.deletePlatform(p);
    if (!res.ok)
      alert_service.add("error", "Failed to delete platform: " + res.error);
  };
});

app.controller('HoldingsController', function ($scope, data_factory) {
  $scope.sides = data_factory.getSides();

  $scope.platforms = {};
  $scope.products = {};

  init();
  
  function init() {
    data_factory.openDb().then(function() {
      $scope.platforms = data_factory.getPlatforms();
      $scope.products = data_factory.getProducts();
    }, function(err) {
      alert_service.add("error", "Failed to open database: " + err);
    });
  }

  $scope.net = function (transactions) {
    var getNet = function (t) {
      var net = t.quantity * t.price;
      return t.side === $scope.sides[0] ? net : net * -1;
    };

    var net = 0;
    for (var t in transactions) {
      net += getNet(transactions[t]);
    }
    return net;
  };

  $scope.average = function (transactions) {
    if (transactions.length === 0)
      return 0;

    return $scope.net(transactions) / transactions.length;
  };

  $scope.productsTransactions = function (products) {
    var ret = [];
    for (var p = 0; p < products.length; p++) {
      ret = ret.concat(products[p].transactions);
    }
    return ret;
  };

  $scope.totalTransactionsNum = function(products) {
    return $scope.productsTransactions(products).length;
  };

  $scope.totalAverage = function(products) {
    return $scope.average($scope.productsTransactions(products));
  };

  $scope.totalNet = function(products) {
    return $scope.net($scope.productsTransactions(products));
  };

});
