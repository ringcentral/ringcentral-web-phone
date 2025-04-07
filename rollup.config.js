import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.umd.js',
    format: 'umd',
    name: 'WebPhone',
  },
  plugins: [
    json(),
    polyfillNode(),
    nodeResolve({ extensions: ['.ts', '.js'] }),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      presets: ['@babel/preset-typescript', '@babel/preset-env'],
    }),
  ],
};
