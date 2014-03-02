app.factory('indexed_db_service', function () {
  var db = null;

  function openDatabase(db_name, db_version, stores, success_callback) {
    console.log('Opening database ' + db_name + ' at version ' + db_version + '...');

    var req = indexedDB.open(db_name, db_version);
    req.onsuccess = function (event) {
      db = this.result;
      console.log('Open database succeeded');

      for (var i in stores) {
        var store = stores[i];
        if(db.objectStoreNames.contains(store.name)) {
          getObjects(store.name, success_callback);
        }
      }
    };

    req.onerror = function (event) {
      console.error('Failed to open database: ' + event.target.error.message);
    };

    req.onupgradeneeded = function (event) {
      console.log('Upgrading database...');

      db = event.currentTarget.result;

      for (var i in stores) {
        var store = stores[i];
        if(db.objectStoreNames.contains(store.name)) {
          console.log('Deleting ' + store.name);
          db.deleteObjectStore(store.name); //TODO - copy objects for migrations
        }

        createStore(store);
      }
    };
  }

  function createStore(store) {
    if(db) {
        console.log('Creating store ' + store.name);
        var store_obj = db.createObjectStore(store.name, {keyPath: "id", autoIncrement: true});
        if (store.indexes) {
          for (var j in store.indexes) {
            var index_name = store.indexes[j];
            store_obj.createIndex(index_name, index_name, {unique: true});
          }
        }
    }
  }
  function getStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    console.log("Got tx for " + store_name);
    return tx.objectStore(store_name);
  }

  function clearStore(store_name) {
    var store = getStore(store_name, 'readwrite');

    var req = store.clear();
    req.onsuccess = function(event) {
      console.log('Store ' + store_name + ' cleared');
    };

    req.onerror = function (event) {
      console.error("Failed to clear store: ", event.target.error.message);
    };
  }

  function addObject (store_name, obj) {
    var store = getStore(store_name, 'readwrite');

    var req = store.put(obj);
    req.onsuccess = function (event) {
      console.log('Added object to ' + store_name);
    };

    req.onerror = function (event) {
      console.error("Failed to add object: ", event.target.error.message);
    };
  }

  function deleteObject(store_name, id) {
    var store = getStore(store_name, 'readwrite');

    var req = store.delete(id);
    req.onsuccess = function (e) {
      console.log('Deleted object from ' + store_name);
    };

    req.onerror = function (e) {
      console.error("Failed to delete object: ", event.target.error.message);
    };
  }

  function getObject(store_name, key, success_callback) {
    var store = getStore(store_name, 'readonly');

    var req = store.get(key);
    req.onsuccess = function (event) {
      var value = event.target.result;
      if (value)
        success_callback(store_name, value);
    };

    req.onerror = function (event) {
      console.error("Failed to get object: ", event.target.error.message);
    };
  }

  function getObjects(store_name, success_callback) {
    console.log('Get all objects from store: ' + store_name);

    var store = getStore(store_name, 'readonly');

    var req = store.count();
    req.onsuccess = function (event) {
      console.log(store_name + ' has ' + event.target.result + ' objects');
    };

    req.onerror = function (event) {
      console.error("Failed to get number of objects: ", event.target.error.message);
    };

    var curs = store.openCursor();
    curs.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        console.log('Got cursor for ' + store_name);
        
        var req = store.get(cursor.key);
        req.onsuccess = function (event) {
          var value = event.target.result;
          success_callback(store_name, value);
        };

        req.onerror = function (event) {
          console.error("Failed to get object: ", event.target.error.message);
        };

        cursor.continue();
      }
      else {
        console.log("No more entries");
      }
    };

    curs.onerror = function (event) {
      console.error("Failed to open cursor: ", event.target.error.message);
    };
  }

  var db_service = {};

  db_service.db_name = 'beta_optimizer';
  db_service.db_version = 3;
  db_service.stores = [
    {name: 'Platforms', indexes: ['key']},
    {name: 'Products', indexes: ['key']},
    {name: 'Transactions', indexes: []},
  ];

  db_service.open= function (success_callback) {
    openDatabase(this.db_name, this.db_version, this.stores, success_callback);
  };

  db_service.addPlatform = function (platform) { addObject(this.stores[0].name, platform); };
  db_service.deletePlatform = function (platform) { deleteObject(this.stores[0].name, platform.id); };
  db_service.getPlatforms = function (success_callback) { getObjects(this.stores[0].name, success_callback); };

  db_service.addProduct = function (product) { addObject(this.stores[1].name, product); };
  db_service.deleteProduct = function (product) { deleteObject(this.stores[1].name, product.id); };
  db_service.getProducts = function (success_callback) { getObjects(this.stores[1].name, success_callback); };

  db_service.addTransaction = function (transaction) { addObject(this.stores[2].name, transaction); };
  db_service.deleteTransaction = function (transaction) { deleteObject(this.stores[2].name, transaction.id); };
  db_service.getTransactions = function (success_callback) { getObjects(this.stores[2].name, success_callback); };

  return db_service;
});
