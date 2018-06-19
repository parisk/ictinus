import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/main.ts',
  output: {
    format: 'umd',
    name: 'ictinus',
    file: 'ictinus.js',
    dir: 'dist',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
        }
      }
    }),
  ]
};
