 angular.module('App.Filters', []).filter('replace_decimals_with_zeros', function() {
  return function(val, num_decimals) {
    if (!num_decimals)
      num_decimals = 2
    
    var ret = val.toFixed(num_decimals);
    var m = ret.match(/\.0+$/) || ret.match(/0+$/) || [];
    if (m.length > 0) {
      var len = m[0].length;
      return ret.slice(0, -len) + Array(len + 1).join('\xA0');
    } else {
      return ret;
    }
  };
});
