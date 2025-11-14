import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            config: path.resolve(__dirname, 'src/config'),
            hooks: path.resolve(__dirname, 'src/hooks'),
            layout: path.resolve(__dirname, 'src/layout'),
            menu: path.resolve(__dirname, 'src/menu-items'),
            routes: path.resolve(__dirname, 'src/routes'),
            store: path.resolve(__dirname, 'src/store'),
            themes: path.resolve(__dirname, 'src/themes'),
            uiComponent : path.resolve(__dirname, 'src/ui-component'),
            utils: path.resolve(__dirname, 'src/utils'),
            assets: path.resolve(__dirname, 'src/assets'),
            menuItems: path.resolve(__dirname, 'src/menu-items') 
        }
    }
})
