// @ts-nocheck
import typescript from 'rollup-plugin-typescript2';
import { createFilter } from 'rollup-pluginutils';
const pkg = require('./package.json');
const prettier = require('prettier');
const UglifyJS = require('uglify-es');

function prettify(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'prettify',
    transform(code, id) {
      if (filter(id)) {
        return {
          code: prettier.format(code, options),
          map: {
            mappings: ''
          }
        };
      }
    }
  };
}

function uglify(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'uglify',
    transform(code, id) {
      if (filter(id)) {
        return {
          code: UglifyJS.minify(code, options).code || '',
          map: {
            mappings: ''
          }
        };
      }
    }
  };
}

const config = {
  input: 'src/url-search.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.es,
      format: 'es'
    },
    {
      file: pkg.umd,
      format: 'umd',
      name: 'UrlSearch'
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    }),
    // Run plugin with prettier options.
    prettify({
      tabWidth: 2,
      singleQuote: true,
      parser: 'typescript'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
