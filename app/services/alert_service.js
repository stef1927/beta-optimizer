'use strict';

app.factory('alert_service', function($rootScope) {
    var alertService = {};

    $rootScope.alerts = [];

    
    alertService.add = function(type, msg) {
      function get_class() {
        if (type == 'error')
          return 'alert-danger';
        else if (type == 'warning')
          return 'alert-warning';
        else if (type == 'success')
          return 'alert-success';

        return 'alert-info';
      }

      $rootScope.alerts.push({
        'type': type,
        'msg': msg, 
        'class' : get_class(), 
        'close' : function() { 
          alertService.close(this); 
        }
      });
    };

    alertService.close = function(alert) {
      var index = $rootScope.alerts.indexOf(alert);
      if (index > 0)
        $rootScope.alerts.splice(index, 1);
    };

    return alertService;
  });