<script lang="ts">
	import { Input, Label, Textarea, Datepicker } from 'flowbite-svelte';
	import type { TravelContent } from '$lib/types/application';
	import { t, getLocale } from '$lib/i18n/index.svelte';

	interface Props {
		content: TravelContent;
		onchange: (content: TravelContent) => void;
	}

	let { content, onchange }: Props = $props();

	let datepickerLocale = $derived(getLocale() === 'zh' ? 'zh-CN' : 'en-US');

	function update(field: keyof TravelContent, value: string | number) {
		onchange({ ...content, [field]: value });
	}

	function toDateStr(date: Date): string {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function parseDate(str: string): Date | undefined {
		if (!str) return undefined;
		const [y, m, d] = str.split('-').map(Number);
		return new Date(y, m - 1, d);
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('form.travelInfo')}</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<Label for="travel-destination" class="mb-2">{t('form.destination')}</Label>
			<Input
				id="travel-destination"
				value={content.destination}
				oninput={(e) => update('destination', e.currentTarget.value)}
				placeholder={t('form.destinationPlaceholder')}
			/>
		</div>
		<div>
			<Label for="travel-budget" class="mb-2">{t('form.budget')}</Label>
			<Input
				id="travel-budget"
				type="number"
				value={content.budget}
				min="0"
				onchange={(e) => update('budget', Number(e.currentTarget.value))}
			/>
		</div>
		<div>
			<Label for="travel-start" class="mb-2">{t('form.departureDate')}</Label>
			<Datepicker
				value={parseDate(content.startDate)}
				onselect={(date) => update('startDate', toDateStr(date as Date))}
				locale={datepickerLocale}
				placeholder={t('form.departureDate')}
			/>
		</div>
		<div>
			<Label for="travel-end" class="mb-2">{t('form.returnDate')}</Label>
			<Datepicker
				value={parseDate(content.endDate)}
				onselect={(date) => update('endDate', toDateStr(date as Date))}
				locale={datepickerLocale}
				placeholder={t('form.returnDate')}
			/>
		</div>
	</div>
	<div>
		<Label for="travel-purpose" class="mb-2">{t('form.travelPurpose')}</Label>
		<Textarea
			id="travel-purpose"
			rows={3}
			value={content.purpose}
			oninput={(e) => update('purpose', e.currentTarget.value)}
			placeholder={t('form.travelPurposePlaceholder')}
		/>
	</div>
</div>
