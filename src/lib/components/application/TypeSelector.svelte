<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import type { ApplicationType } from '$lib/types/application';
	import { APPLICATION_TYPES } from '$lib/types/application';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		selected?: ApplicationType;
		onselect?: (type: ApplicationType) => void;
	}

	let { selected, onselect }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
	{#each APPLICATION_TYPES as type}
		<Card
			role="button"
			tabindex="0"
			class="cursor-pointer h-full transition-all {selected === type.value
				? 'border-blue-500 ring-2 ring-blue-500'
				: 'hover:shadow-lg'}"
			onclick={() => onselect?.(type.value)}
			onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onselect?.(type.value); } }}
		>
			<div class="text-center">
				<div class="mb-3 text-4xl">
					{#if type.value === 'overtime'}
						⏰
					{:else if type.value === 'travel'}
						✈️
					{:else}
						🛒
					{/if}
				</div>
				<h3 class="text-lg font-bold text-gray-900 dark:text-white">{t('type.' + type.value)}</h3>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('typedesc.' + type.value)}</p>
			</div>
		</Card>
	{/each}
</div>
