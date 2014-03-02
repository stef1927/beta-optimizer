
app.controller('NavController', function ($scope, $location) {
  $scope.isActive = function (route) { return route === $location.path(); };
});

app.controller('TransactionsController', function ($scope, data_factory, alert_service) {
  $scope.transactions = data_factory.getTransactions();
  $scope.products = data_factory.getProducts();
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
  $scope.platforms = data_factory.getPlatforms();
  $scope.new_platform = data_factory.getDefaultPlatform();

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
  $scope.platforms = data_factory.getPlatforms();
  $scope.products = data_factory.getProducts();
  $scope.sides = data_factory.getSides();

  $scope.transactions = {};
  $scope.currencies = {};

  init();

  function init() {
    initTransactions();
    initCurrencies();
  }

  function initTransactions() {
    for (var t = 0; t < data_factory.getTransactions().length; t++) {
      var transaction = data_factory.getTransactions()[t];
      var product = transaction.product;
      var platform = product.platform;
      if (!($scope.transactions[platform.key])) {
        $scope.transactions[platform.key] = {};
      }
      if (!($scope.transactions[platform.key][product.currency])) {
        $scope.transactions[platform.key][product.currency] = {};
      }
      if (!($scope.transactions[platform.key][product.currency][product.key] )) {
        $scope.transactions[platform.key][product.currency][product.key]  = [];
      }
      if (!($scope.transactions[platform.key][product.currency].ALL_PRODUCTS)) {
        $scope.transactions[platform.key][product.currency].ALL_PRODUCTS = [];
      }
      $scope.transactions[platform.key][product.currency][product.key].push(transaction);
      $scope.transactions[platform.key][product.currency].ALL_PRODUCTS.push(transaction); 
    }
  }

  function initCurrencies() {
    for (var p in data_factory.getPlatforms()) {
      var platform = data_factory.getPlatforms()[p];
      $scope.currencies[platform.key] = [];

      if (platform.key in $scope.transactions) {
        for (var currency in $scope.transactions[platform.key]) {
          $scope.currencies[platform.key].push(currency);
        }
      }
     }
  }

  $scope.transactionsNet = function (transactions) {
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

  $scope.productTransactions = function (product) {
    return $scope.transactions[product.platform.key][product.currency][product.key];
  };

  $scope.productNet = function (product) {
    return $scope.transactionsNet($scope.productTransactions(product));
  };

  $scope.productAverage = function (product) {
    var transactions = $scope.productTransactions(product);
    if (transactions.length === 0)
      return 0;

    return $scope.transactionsNet(transactions) / transactions.length;
  };

  $scope.platformCurrencies = function (platform) {
    return $scope.currencies[platform.key];
  };

  $scope.platformTransactions = function (platform, currency) {
    if ((platform.key in $scope.transactions) && 
        (currency in $scope.transactions[platform.key])) {
        return $scope.transactions[platform.key][currency].ALL_PRODUCTS;
    }
    return [];  
  };

  $scope.platformNet = function (platform, currency) {
    return $scope.transactionsNet($scope.platformTransactions(platform, currency));
  };

  $scope.platformAverage = function (platform, currency) {
    var transactions = $scope.platformTransactions(platform, currency);
    if (transactions.length === 0)
      return 0;

    return $scope.transactionsNet(transactions) / transactions.length;
  };

});
