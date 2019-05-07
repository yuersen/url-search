'use strict';

/**
 * Simple polyfill for URLSearchParams standard, Defines utility methods to work with the query string of a URL.
 *
 * @see https://url.spec.whatwg.org/#dom-url-searchparams
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams
 * @class
 */
var URLSearch = /** @class */ (function() {
  /**
   * The constructor of URLSearch.
   *
   * @constructor
   * @param {String|Object|String[]} query The value to be create URLSearch instance.
   */
  function URLSearch(query) {
    this.secret = {};
    var type = {}.toString
      .call(query)
      .slice(8, -1)
      .toLowerCase();
    if (type === 'string') {
      // 'search=pxy'
      if (query.charAt(0) === '?') {
        query = query.slice(1);
      }
      var pairs = query.split('&');
      for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
        var pair = pairs_1[_i];
        var split = pair.split('=');
        // decodeURIComponent/encodeURIComponent
        this.append(split[0], split[1] || '');
      }
    } else if (type === 'array') {
      // [['search', 'pxy'], ['age', 20]]
      for (var _a = 0, _b = query; _a < _b.length; _a++) {
        var vals = _b[_a];
        this.append(vals[0], vals[1]);
      }
    } else if (type === 'object') {
      // {search: 'pxy', age: 20}
      for (var key in query) {
        if (query.hasOwnProperty(key)) {
          this.append(key, query[key]);
        }
      }
    }
    return this;
  }
  /**
   * Appends a specified key/value pair as a new search parameter.
   *
   * @param  {String} name The name of the parameter to append.
   * @param  {String|String[]} values The value of the parameter to append.
   * @returns {URLSearch}
   */
  URLSearch.prototype.append = function(name, values) {
    if (!name || !values) {
      return this;
    }
    if (!this.secret[name]) {
      this.secret[name] = [];
    }
    var vals = typeof values === 'string' ? [values] : values;
    for (var _i = 0, vals_1 = vals; _i < vals_1.length; _i++) {
      var val = vals_1[_i];
      this.secret[name].push(decodeURIComponent((val + '').replace(/\+/g, '')));
    }
  };
  /**
   * Deletes the given search parameter, and its associated value, from the list of all search parameters.
   *
   * @param  {String} name The name of the parameter to be deleted.
   * @returns {URLSearch}
   */
  URLSearch.prototype['delete'] = function(name) {
    delete this.secret[name];
    return this;
  };
  /**
   * Returns the first value associated with the given search parameter.
   *
   * @param  {String} name The name of the parameter to return.
   * @returns {*}
   */
  URLSearch.prototype.get = function(name) {
    return name in this.secret ? this.secret[name][0] : null;
  };
  /**
   * Returns all the values associated with a given search parameter.
   *
   * @param  {String} name The name of the parameter to return.
   * @returns {*[]}
   */
  URLSearch.prototype.getAll = function(name) {
    return name in this.secret ? this.secret[name].slice(0) : [];
  };
  /**
   * Returns a Boolean indicating if such a given parameter exists.
   *
   * @param {String} name The name of the parameter to find.
   * @returns {Boolean}
   */
  URLSearch.prototype.has = function(name) {
    return name in this.secret;
  };
  /**
   * Sets the value associated with a given search parameter to the given value.
   * If there are several values, the others are deleted.
   *
   * @param {String} name The name of the parameter to set.
   * @param {*} value The value of the parameter to set.
   * @returns {URLSearch}
   */
  URLSearch.prototype.set = function(name, value) {
    this.secret[name] = ['' + value];
    return this;
  };
  /**
   * Allows iteration through all values contained in this object via a callback function.
   *
   * @param {Function} callback A callback function that is executed against each parameter, with the param value provided as its parameter.
   * @returns {URLSearch}
   */
  URLSearch.prototype.forEach = function(callback) {
    var secret = this.secret;
    for (var name_1 in secret) {
      if (secret.hasOwnProperty(name_1)) {
        var values = secret[name_1];
        for (var i = 0, l = values.length; i < l; i++) {
          callback && callback.call(this, values[i], name_1, this);
        }
      }
    }
    return this;
  };
  /**
   * Returns an array containing keys.
   *
   * @returns {String[]}
   */
  URLSearch.prototype.keys = function() {
    var names = [];
    for (var name_2 in this.secret) {
      if (this.secret.hasOwnProperty(name_2)) {
        names.push(name_2);
      }
    }
    return names;
  };
  /**
   * Returns an array containing all values.
   *
   * @returns {*[]}
   */
  URLSearch.prototype.values = function() {
    var values = [];
    this.forEach(function(value) {
      values.push(value);
    });
    return values;
  };
  /**
   * Returns an iterator allowing to go through all key/value pairs contained in this object.
   *
   * @returns {Object}
   */
  URLSearch.prototype.entries = function() {
    var iterator = [];
    this.forEach(function(value, name) {
      iterator.push([name, value]);
    });
    return iterator;
  };
  /**
   * Returns a string containing a query string suitable for use in a URL.
   *
   * @returns {String}
   */
  URLSearch.prototype.toString = function() {
    var _this = this;
    var query = [];
    this.forEach(function(value, name) {
      query.push(_this.encodeURI(name) + '=' + _this.encodeURI(value));
    });
    return query.join('&');
  };
  /**
   * Sorts all key/value pairs, if any, by their keys.
   *
   * @returns {URLSearch}
   */
  URLSearch.prototype.sort = function() {
    var keys = this.keys().sort();
    var temp = {};
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      temp[key] = this.secret[key].sort();
    }
    this.secret = temp;
    return this;
  };
  /**
   * Encode the input.
   *
   * @private
   * @param {String} str The input to be encoded.
   * @returns {String}
   */
  URLSearch.prototype.encodeURI = function(str) {
    var replacePairs = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(
      match
    ) {
      return replacePairs[match];
    });
  };
  return URLSearch;
})();

module.exports = URLSearch;
