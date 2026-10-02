import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

process.env.PUBLIC_SITE_URL ||= '';

export default defineConfig({
  plugins: [sveltekit()]
});
