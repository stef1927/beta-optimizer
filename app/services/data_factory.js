app.factory('data_factory', function (indexed_db_service) {
  var data_factory = {};

  var sides = [ 'Buy', 'Sell'];
  var currencies = ['HKD', 'CNY'];

  function Platform(name) {
    this.name = name;
    this.key = name.toUpperCase();
    
    this.products = [];
  }

  // Indexed by platform key
  var platforms = {
    //HSBC: new Platform("HSBC"),
    //STANCHART: new Platform("StanChart")
  };

  function Product(code, description, platform, currency, market_value, valuation_date) {
    this.code = code;
    this.key = code.toUpperCase();
    this.description = description;
    this.platform = platform;
    this.currency = currency;
    this.market_value = market_value;
    this.valuation_date = valuation_date;

    this.transactions = [];
  }

  // Indexed by product key
  var products = {
   // GOOG: new Product("GOOG", "Google", platforms.HSBC, "HKD", 700, new Date()),
   // BP: new Product("BP", "BP", platforms.STANCHART, "CNY", 1000, new Date()),
   // SONY: new Product("SONY", "Sony", platforms.HSBC, "HKD", 854, new Date()),
  };

  function Transaction(product, side, quantity, price, date) {
    this.product = product;
    this.side = side;
    this.quantity = quantity;
    this.price = price;
    this.date = date;
  }

  var transactions = [
   // new Transaction(products.GOOG, sides[0], 100, 750, new Date()),
   // new Transaction(products.BP, sides[1], 200, 150, new Date()),
   // new Transaction(products.SONY, sides[0], 300, 450, new Date())
  ];


  function Result(ok, error) {
    this.ok = ok;
    this.error = error;
  }

  data_factory.getSides = function () { return sides; };
  data_factory.getCurrencies = function () { return currencies; };
  data_factory.getPlatforms = function () { return platforms; };
  data_factory.getProducts = function () { return products; };
  data_factory.getTransactions = function () { return transactions; };

  data_factory.getDefaultPlatform = function () {
    return new Platform("");
  };

  data_factory.doAddPlatform = function (p) {
    platforms[p.key] = p; 
  };

  data_factory.addPlatform = function (p) {
    var new_platform = new Platform(p.name);

    if (!new_platform.key)
      return new Result(false, "Please specify a name");

    if (!(new_platform.key in platforms)) {
      data_factory.doAddPlatform(new_platform);

      indexed_db_service.addPlatform(new_platform);
      return new Result(true);
    }
    return new Result(false, 'Platform already exists');
  };
  
  data_factory.deletePlatform = function (p) {
    if (p.products.length > 0) {
      return new Result(false, 'Platform still has ' + p.products.length + ' products');
    }

    indexed_db_service.deletePlatform(p);
    delete platforms[p.key];
    return new Result(true);
  };

  data_factory.getDefaultProduct = function () { 
    var platform = Object.keys(platforms).length > 0 ? platforms[Object.keys(platforms)[0]] : undefined;
    //console.log("Default platform : " + JSON.stringify(platform));
    return new Product("", "", platform, "HKD", 0, new Date()); 
  };

  data_factory.doAddProduct = function(p) {
    if (!(_.contains(currencies, p.currency)))
        currencies.push(p.currency);

      platforms[p.platform].products.push(p);
      products[p.key] = p;
  };

  data_factory.addProduct = function (p) {
    var new_product = new Product(p.code.toUpperCase(), p.description, 
      p.platform.key, p.currency.toUpperCase(), p.market_value, p.valuation_date);

    if (!new_product.key)
      return new Result(false, "Please specify a code");

    if (!(new_product.key in products)) {
      data_factory.doAddProduct(new_product);
      indexed_db_service.addProduct(new_product);
      return new Result(true);
    }

    return new Result(false, 'Product already exists');
  };
  
  data_factory.deleteProduct = function (p) {
    if (p.transactions.length > 0) {
      return new Result(false, 'Product still has ' + p.transactions.length + ' transactions');
    }

    platofmrs[p.platform].products = _without(platforms[p.platform].products, p);
    indexed_db_service.deleteProduct(p);
    delete products[p.key];

    return new Result(true);
  };

  data_factory.getDefaultTransaction = function () { 
    var product = Object.keys(products).length > 0 ? products[Object.keys(products)[0]] : undefined;
    return new Transaction(product, sides[0], 0, 0, new Date()); 
  };

  data_factory.doAddTransaction = function (t) {
    products[t.product].transactions.push(t);
    transactions.push(t); 
  };

  data_factory.addTransaction = function (t) {
    var new_transaction = new Transaction(t.product.key, t.side, t.quantity, t.price, t.date);
    data_factory.doAddTransaction(new_transaction);
    indexed_db_service.addTransaction(new_transaction);
    return new Result(true);
  };

  data_factory.deleteTransaction = function (t) {
    products[t.product].transactions = _without(products[t.product].transactions, t);
    transactions = _without(transactions, t);
    indexed_db_service.deleteTransaction(t);
    return new Result(true);
  };

  data_factory.openDb = function () {
    indexed_db_service.open(function () {
      
      indexed_db_service.getPlatforms(function (plat) {
        if (plat) {
          data_factory.doAddPlatform(plat);
        }
        else {
          indexed_db_service.getProducts(function (prod) {
            if (prod) {
              data_factory.doAddProduct(prod);
            }
            else {
              indexed_db_service.getTransactions(function (tran) {
                if (tran) {
                  data_factory.doAddTransaction(tran);
                }
              });
            }
          });
        }
      });
     });
  };

  data_factory.openDb();
  return data_factory;
});