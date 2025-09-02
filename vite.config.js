import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ReactDragGrid', // Nome da variável global (para UMD)
      fileName: (format) => `react-drag-grid.${format}.js`,
    },
    rollupOptions: {
      // Garanta que o React não seja empacotado junto com a biblioteca
      external: ['react', 'react-dom'],
      output: {
        // Variáveis globais para usar na build UMD
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});