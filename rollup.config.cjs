import * as pkg from './package.json'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

const buildDate = Date()
const banner = `/*
* project  : ${pkg.name}
* version  : ${pkg.version}
* author   : ${pkg.author.name}[${pkg.author.email}]
* license  : ${pkg.license}
* homepage : ${pkg.homepage}
* build    : ${buildDate}
*/`

export default [{
  input: './lib/index.js',
  output: [
    {
      file: './dist/snk.js',
      format: 'umd',
      name: 'snk',
      banner: banner,
    },
  ],
  plugins: [
    babel(),
  ]
}, {
  input: './lib/index.js',
  output: [
    {
      file: './dist/snk.min.js',
      format: 'umd',
      name: 'snk',
    },
  ],
  plugins: [
    terser({
      format: {
        preamble: banner
      }
    }),
  ]
}, {
  input: './lib/main.js',
  output: [
    {
      file: './dist/snk.esm.js',
      format: 'es',
      banner: banner,
    },
  ],
  plugins: [
    babel(),
  ]
}, {
  input: './lib/main.js',
  output: [
    {
      file: './dist/snk.node.js',
      format: 'cjs',
      banner: banner,
    },
  ],
  plugins: [
    babel(),
  ]
}]
