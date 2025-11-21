import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components'),
            pages: path.resolve(__dirname, 'src/pages'),
            contexts: path.resolve(__dirname, 'src/contexts'),
            api: path.resolve(__dirname, 'src/api'),
            'menu-items': path.resolve(__dirname, 'src/menu-items'),
            hooks: path.resolve(__dirname, 'src/hooks'),
            themes: path.resolve(__dirname, 'src/themes'),
            layout: path.resolve(__dirname, 'src/layout'),
            routes: path.resolve(__dirname, 'src/routes'),
            config: path.resolve(__dirname, 'src/config.js'),
            utils: path.resolve(__dirname, 'src/utils'),
            assets: path.resolve(__dirname, 'src/assets'),
            sections: path.resolve(__dirname, 'src/sections')
        }
    }
});
