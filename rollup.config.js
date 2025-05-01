import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default {
  input: 'lib/src/index.js',
  output: {
    file: 'lib/index.umd.js',
    format: 'umd',
    name: 'WebPhone',
  },
  plugins: [
    json(),
    polyfillNode(),
    nodeResolve({ extensions: ['.js'] }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      presets: ['@babel/preset-env'],
    }),
  ],
};
