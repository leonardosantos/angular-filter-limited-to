angular.module('filterLimitedTo', []).filter('filterLimitedTo', function() {
  return function(array, expression, comparator, limit) {
    if (!Array.isArray(array)) return array;

    var comparatorType = typeof(comparator),
        predicates = [];

    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };

    if(comparatorType === 'number' && typeof limit != 'number'){
      limit = comparator;
      delete comparator;
    }

    if (comparatorType !== 'function') {
      if (comparatorType === 'boolean' && comparator) {
        comparator = function(obj, text) {
          return angular.equals(obj, text);
        };
      } else {
        comparator = function(obj, text) {
          if (obj && text && typeof obj === 'object' && typeof text === 'object') {
            for (var objKey in obj) {
              if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) &&
                  comparator(obj[objKey], text[objKey])) {
                return true;
              }
            }
            return false;
          }
          text = (''+text).toLowerCase();
          return (''+obj).toLowerCase().indexOf(text) > -1;
        };
      }
    }

    var search = function(obj, text){
      if (typeof text == 'string' && text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
        case "boolean":
        case "number":
        case "string":
          return comparator(obj, text);
        case "object":
          switch (typeof text) {
            case "object":
              return comparator(obj, text);
            default:
              for ( var objKey in obj) {
                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                  return true;
                }
              }
              break;
          }
          return false;
        case "array":
          for ( var i = 0; i < obj.length; i++) {
            if (search(obj[i], text)) {
              return true;
            }
          }
          return false;
        default:
          return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        // Set up expression object and fall through
        expression = {$:expression};
        // jshint -W086
      case "object":
        // jshint +W086
        for (var key in expression) {
          (function(path) {
            if (typeof expression[path] === 'undefined') return;
            predicates.push(function(value) {
              return search(path == '$' ? value : (value && value[path]), expression[path]);
            });
          })(key);
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
      if(limit && filtered.length == limit)
        break;
    }
    return filtered;
  };
});
