import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5001', // The address of your Flask backend
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
