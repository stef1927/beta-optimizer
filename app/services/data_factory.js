app.factory('data_factory', function() {
  var data_factory = {};

  var sides = [ 'Buy', 'Sell'];
  
  function Platform(name) {
    this.name = name;
    this.currencies = {};

    this.getKey = function() { 
      return this.name.toUpperCase(); 
    }

    this.getProducts = function() { 
      var ret = {};
      for(p in products) {
        if (products[p].platform.getKey() == this.getKey()) {
          var currency = products[p].currency;
          console.log(currency);
          if (!(currency.name in ret)) {
            ret[currency.name] = [];
            this.currencies[currency.name] = currency;
          }
          ret[currency.name].push(products[p]);
        }
      }
      console.log(ret);
      return ret;
    }

    this.getNet = function(products) {
      console.log(products);
      var net = 0;
      for (p in products) {
        net += products[p].getNet();
      }
      return net;
    }

    this.getAverage = function(products) {
      console.log(products);
      if (products.length == 0)
        return 0;

      return this.getNet(products) / products.length;
    }

    this.getTransactions = function(products) {
      var ret = [];
      for (p in products) {
        var product_transactions = products[p].getTransactions();
        for (t in product_transactions)
          ret.push(product_transactions[t]);
      }
      return ret;
    }
  };

  var platforms = {
    HSBC: new Platform("HSBC"),
    STANCHART: new Platform("StanChart")
  };

  function Currency(name) {
    this.name = name;
    this.symbol = name + ' ';
  };

  function Product(code, description, platform, currency, market_value, valuation_date) {
    this.code = code;
    this.description = description;
    this.platform = platform;
    this.currency = currency;
    this.market_value = market_value;
    this.valuation_date = valuation_date;

    this.getKey = function() { 
      return this.code.toUpperCase(); 
    }

    this.getTransactions = function() { 
      var ret = [];
      for(t in transactions) {
        if (transactions[t].product.getKey() == this.getKey()) {
          ret.push(transactions[t]);
        }
      }
      return ret;
    }

    this.getNet = function() {
      var net = 0;
      var transactions = this.getTransactions();
      for (t in transactions) {
        net += transactions[t].getNet();
      }
      return net;
    }

    this.getAverage = function() {
      var transactions = this.getTransactions();
      if (transactions.length == 0)
        return 0;

      return this.getNet() / transactions.length;
    }
  };

  var products = {
    GOOG: new Product("GOOG", "Google", platforms.HSBC, new Currency("HKD"), 700, new Date()),
    BP: new Product("BP", "BP", platforms.STANCHART, new Currency("CNY"), 1000, new Date()),
    SONY: new Product("SONY", "Sony", platforms.HSBC, new Currency("HKD"), 854, new Date()),
  };

  function Transaction(product, side, quantity, price, date) {
    this.product = product;
    this.side = side;
    this.quantity = quantity;
    this.price = price;
    this.date = date;

    this.currencySymbol = product.currency.symbol;

    this.getNet = function() {
      var net = this.quantity * this.price;
      return this.side == sides[0] ? net : net * -1;
    }
  };

  var transactions = [
    new Transaction(products.GOOG, sides[0], 100, 750, new Date()),
    new Transaction(products.BP, sides[1], 200, 150, new Date()),
    new Transaction(products.SONY, sides[0], 300, 450, new Date())
  ];


  function Result(ok, error) {
    this.ok = ok;
    this.error = error;
  }

  data_factory.getSides = function() { return sides; }
  data_factory.getPlatforms = function() { return platforms; }
  data_factory.getProducts = function() { return products; }
  data_factory.getTransactions = function() { return transactions; }

  data_factory.getDefaultPlatform = function() { 
    return new Platform(""); 
  }
  
  data_factory.addPlatform = function(p) {
    if (!(p.getKey() in platforms)) {
      platforms[p.getKey()] = new Platform(p.name);
      return new Result(true, '');
    }
    return new Result(false, 'already exists');
  }
  
  data_factory.deletePlatform = function(p) {
    var products = p.getProducts();
    if (products.length > 0) {
      return new Result(false, 'platform still has ' + products.length + ' products');
    }

    delete platforms[p.getKey()];
    return new Result(true, '');
  }

  data_factory.getDefaultProduct = function() { 
    var platform = Object.keys(platforms).length > 0 ? platforms[Object.keys(platforms)[0]] : undefined;
    console.log("Default platform : " + JSON.stringify(platform));
    return new Product("", "", platform, new Currency("HKD"), 0, new Date()); 
  }

  data_factory.addProduct = function(p) {
    if (!(p.getKey() in products)) {
      products[p.getKey()] = new Product
        (p.code.toUpperCase(), p.description, p.platform, new Currency(p.currency.name.toUpperCase()), p.market_value, p.valuation_date);
      return new Result(true, '');
    }

    return new Result(false, 'already exists');
  }
  
  data_factory.deleteProduct = function(p) {
    var transactions = p.getTransactions();
    if (transactions.length > 0) {
      return new Result(false, 'product still has ' + transactions.length + ' transactions');
    }

    delete products[p.getKey()];
    return new Result(true, '');
  }

  data_factory.getDefaultTransaction = function() { 
    var product = Object.keys(products).length > 0 ? products[Object.keys(products)[0]] : undefined;
    console.log("Default product : " + JSON.stringify(product));
    return new Transaction(product, sides[0], 0, 0, new Date()); 
  }

  data_factory.addTransaction = function(t) {
    transactions.push(new Transaction(t.product, t.side, t.quantity, t.price, t.date)); 
    return new Result(true, '');
  }

  data_factory.deleteTransaction = function(t) {
    var index = transactions.indexOf(t);
    if (index > -1) {
      transactions.splice(index, 1);
      return new Result(true, '');
    }

    return new Result(false, 'not found');
  }

  return data_factory;
});