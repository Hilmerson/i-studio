import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                dvere: resolve(__dirname, 'dvere/index.html'),
                podlahy: resolve(__dirname, 'podlahy/index.html'),
                skrine: resolve(__dirname, 'skrine/index.html'),
                kuchyne: resolve(__dirname, 'kuchyne/index.html'),
                nabytok: resolve(__dirname, 'nabytok/index.html'),
                obklady: resolve(__dirname, 'obklady/index.html'),
                kontakt: resolve(__dirname, 'kontakt/index.html'),
                realizacie: resolve(__dirname, 'realizacie/index.html'),
                nested404: resolve(__dirname, '404.html'),
            },
        },
    },

});
