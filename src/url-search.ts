/**
 * Simple polyfill for URLSearchParams standard, Defines utility methods to work with the query string of a URL.
 *
 * @see https://url.spec.whatwg.org/#dom-url-searchparams
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams
 * @class
 */
export default class URLSearch {
  private secret: { [key: string]: string[] } = {};

  /**
   * The constructor of URLSearch.
   *
   * @constructor
   * @param {String|Object|String[]} query The value to be create URLSearch instance.
   */
  constructor(query?: string | object | string[]) {
    const type = {}.toString
      .call(query)
      .slice(8, -1)
      .toLowerCase();
    if (type === 'string') {
      // 'search=pxy'
      if ((query as string).charAt(0) === '?') {
        (query as string) = (query as string).slice(1);
      }
      const pairs = (query as string).split('&');
      for (const pair of pairs) {
        const split = pair.split('=');
        // decodeURIComponent/encodeURIComponent
        this.append(split[0], split[1] || '');
      }
    } else if (type === 'array') {
      // [['search', 'pxy'], ['age', 20]]
      for (const vals of query as string[]) {
        this.append(vals[0], vals[1]);
      }
    } else if (type === 'object') {
      // {search: 'pxy', age: 20}
      for (const key in query as { [key: string]: string }) {
        if (query.hasOwnProperty(key)) {
          this.append(key, (query as any)[key]);
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
  append(name: string, values: string | string[]): URLSearch {
    if (!name || !values) {
      return this;
    }

    if (!this.secret[name]) {
      this.secret[name] = [];
    }
    const vals = typeof values === 'string' ? [values] : values;
    for (const val of vals) {
      this.secret[name].push(decodeURIComponent((val + '').replace(/\+/g, '')));
    }
  }

  /**
   * Deletes the given search parameter, and its associated value, from the list of all search parameters.
   *
   * @param  {String} name The name of the parameter to be deleted.
   * @returns {URLSearch}
   */
  delete(name: string): URLSearch {
    delete this.secret[name];
    return this;
  }

  /**
   * Returns the first value associated with the given search parameter.
   *
   * @param  {String} name The name of the parameter to return.
   * @returns {*}
   */
  get(name: string): any {
    return name in this.secret ? this.secret[name][0] : null;
  }

  /**
   * Returns all the values associated with a given search parameter.
   *
   * @param  {String} name The name of the parameter to return.
   * @returns {*[]}
   */
  getAll(name: string): any[] {
    return name in this.secret ? this.secret[name].slice(0) : [];
  }

  /**
   * Returns a Boolean indicating if such a given parameter exists.
   *
   * @param {String} name The name of the parameter to find.
   * @returns {Boolean}
   */
  has(name: string): boolean {
    return name in this.secret;
  }

  /**
   * Sets the value associated with a given search parameter to the given value.
   * If there are several values, the others are deleted.
   *
   * @param {String} name The name of the parameter to set.
   * @param {*} value The value of the parameter to set.
   * @returns {URLSearch}
   */
  set(name: string, value: string): URLSearch {
    this.secret[name] = ['' + value];
    return this;
  }

  /**
   * Allows iteration through all values contained in this object via a callback function.
   *
   * @param {Function} callback A callback function that is executed against each parameter, with the param value provided as its parameter.
   * @returns {URLSearch}
   */
  forEach(callback: (value: any, key: string) => void): URLSearch {
    const secret = this.secret;
    for (const name in secret) {
      if (secret.hasOwnProperty(name)) {
        const values = secret[name];
        for (let i = 0, l = values.length; i < l; i++) {
          callback && callback.call(this, values[i], name, this);
        }
      }
    }
    return this;
  }

  /**
   * Returns an array containing keys.
   *
   * @returns {String[]}
   */
  keys(): string[] {
    const names: string[] = [];

    for (const name in this.secret) {
      if (this.secret.hasOwnProperty(name)) {
        names.push(name);
      }
    }
    return names;
  }

  /**
   * Returns an array containing all values.
   *
   * @returns {*[]}
   */
  values(): any[] {
    const values: any[] = [];

    this.forEach(value => {
      values.push(value);
    });
    return values;
  }

  /**
   * Returns an iterator allowing to go through all key/value pairs contained in this object.
   *
   * @returns {*[]}
   */
  entries(): any[] {
    const iterator: any = [];
    this.forEach((value, name) => {
      iterator.push([name, value]);
    });
    return iterator;
  }

  /**
   * Returns a string containing a query string suitable for use in a URL.
   *
   * @returns {String}
   */
  toString(): string {
    const query: string[] = [];

    this.forEach((value, name) => {
      query.push(this.encodeURI(name) + '=' + this.encodeURI(value));
    });
    return query.join('&');
  }

  /**
   * Sorts all key/value pairs, if any, by their keys.
   *
   * @returns {URLSearch}
   */
  sort(): URLSearch {
    const keys = this.keys().sort();
    const temp: { [key: string]: string[] } = {};

    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      temp[key] = this.secret[key].sort();
    }
    this.secret = temp;
    return this;
  }

  /**
   * Encode the input.
   *
   * @private
   * @param {String} str The input to be encoded.
   * @returns {String}
   */
  private encodeURI(str: string): string {
    const replacePairs: { [key: string]: string } = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, match => {
      return replacePairs[match];
    });
  }
}
