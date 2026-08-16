import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, 'src/lib'),
			'$app/navigation': path.resolve(__dirname, 'src/__mocks__/$app/navigation.ts')
		},
		conditions: ['browser']
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['src/__tests__/setup.ts'],
		globals: true
	}
});
