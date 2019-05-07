# url-search

Simple polyfill for URLSearchParams standard, Defines utility methods to work with the query string of a URL. Support for all major browsers.

- Works in IE8+
- Accepts any character
- Heavily tested
- No dependency
- Supports CommonJS/ES Module/UMD

## Installation

### Direct download

Download the script from `dist/url-search.umd.js` and include it.

```html
<script src="/path/to/url-search.umd.js"></script>
```

### Package Managers

```
npm install url-search --save
```

## Basic Usage

### UMD

```javascript
const search = new URLSearch('?name=pxy&version=1.0.0');
search.append('name', 'fiy');
```

### CJS / ES

```javascript
import { URLSearch } from 'url-search';

const search = new URLSearch('?name=pxy&version=1.0.0');
search.append('name', 'fiy');
```

## API

| Method             | Parameter  | Returns  | Describe     |
| ------------------ | --------------- | -------- | ---------------- |
| constructor | (query?: string | object | string[]) | void | The constructor of URLSearch. |
| append | (name: string, values: string | string[]) | URLSearch | Appends a specified key/value pair as a new search parameter. |
| delete | (name: string) | URLSearch | Deletes the given search parameter, and its associated value, from the list of all search parameters. |
| get | (name: string) | * | Returns the first value associated with the given search parameter. |
| getAll | (name: string) | *[] | Returns all the values associated with a given search parameter. |
| has | (name: string | Boolean | Returns a Boolean indicating if such a given parameter exists. |
| set | (name: string, value: string) | URLSearch | Sets the value associated with a given search parameter to the given value. If there are several values, the others are deleted.|
| forEach | (callback: (value: any, key: string) => void) | URLSearch | Allows iteration through all values contained in this object via a callback function. |
| keys | () | String[] | Returns an array containing keys. |
| values | () | *[] | Returns an array containing all values. |
| entries | () | *[] | Returns an iterator allowing to go through all key/value pairs contained in this object. |
| toString | () | String | Returns a string containing a query string suitable for use in a URL. |
| sort | () | URLSearch | Sorts all key/value pairs, if any, by their keys. |