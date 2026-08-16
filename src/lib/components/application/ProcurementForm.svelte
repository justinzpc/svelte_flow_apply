<script lang="ts">
	import { Button, Input, Label, Textarea } from 'flowbite-svelte';
	import type { ProcurementContent, ProcurementItem } from '$lib/types/application';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		content: ProcurementContent;
		onchange: (content: ProcurementContent) => void;
	}

	let { content, onchange }: Props = $props();

	function updateItem(index: number, field: keyof ProcurementItem, value: string | number) {
		const newItems = content.items.map((item, i) =>
			i === index ? { ...item, [field]: value } : item
		);
		const totalBudget = newItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
		onchange({ ...content, items: newItems, totalBudget });
	}

	function addItem() {
		onchange({ ...content, items: [...content.items, { name: '', quantity: 1, unitPrice: 0 }] });
	}

	function removeItem(index: number) {
		const newItems = content.items.filter((_, i) => i !== index);
		const totalBudget = newItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
		onchange({ ...content, items: newItems, totalBudget });
	}

	function updatePurpose(value: string) {
		onchange({ ...content, purpose: value });
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('form.procurementInfo')}</h3>

	<!-- 物品列表 -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h4 class="font-medium text-gray-700 dark:text-gray-300">{t('form.procurementList')}</h4>
			<Button size="xs" color="blue" onclick={addItem}>{t('form.addItem')}</Button>
		</div>

		{#each content.items as item, index}
			<div class="grid grid-cols-12 items-end gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
				<div class="col-span-5">
					<Label for="item-name-{index}" class="mb-1">{t('form.itemName')}</Label>
					<Input
						id="item-name-{index}"
						value={item.name}
						oninput={(e) => updateItem(index, 'name', e.currentTarget.value)}
						placeholder={t('form.itemNamePlaceholder')}
					/>
				</div>
				<div class="col-span-2">
					<Label for="item-qty-{index}" class="mb-1">{t('form.quantity')}</Label>
					<Input
						id="item-qty-{index}"
						type="number"
						value={item.quantity}
						min="1"
						onchange={(e) => updateItem(index, 'quantity', Number(e.currentTarget.value))}
					/>
				</div>
				<div class="col-span-3">
					<Label for="item-price-{index}" class="mb-1">{t('form.unitPrice')}</Label>
					<Input
						id="item-price-{index}"
						type="number"
						value={item.unitPrice}
						min="0"
						onchange={(e) => updateItem(index, 'unitPrice', Number(e.currentTarget.value))}
					/>
				</div>
				<div class="col-span-2">
					<Button size="xs" color="red" onclick={() => removeItem(index)}>{t('form.delete')}</Button>
				</div>
			</div>
		{/each}

		{#if content.items.length === 0}
			<p class="text-center text-sm text-gray-500 dark:text-gray-400">{t('form.noItems')}</p>
		{/if}
	</div>

	<!-- 总预算 -->
	<div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			{t('form.totalBudget')}：<span class="text-lg font-bold text-gray-900 dark:text-white">¥{content.totalBudget.toFixed(2)}</span>
		</p>
	</div>

	<!-- 采购用途 -->
	<div>
		<Label for="procurement-purpose" class="mb-2">{t('form.procurementPurpose')}</Label>
		<Textarea
			id="procurement-purpose"
			rows={3}
			value={content.purpose}
			oninput={(e) => updatePurpose(e.currentTarget.value)}
			placeholder={t('form.procurementPurposePlaceholder')}
		/>
	</div>
</div>
