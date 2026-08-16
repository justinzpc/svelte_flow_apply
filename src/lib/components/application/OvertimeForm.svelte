<script lang="ts">
	import { Input, Label, Textarea, Datepicker } from 'flowbite-svelte';
	import type { OvertimeContent } from '$lib/types/application';
	import { t, getLocale } from '$lib/i18n/index.svelte';

	interface Props {
		content: OvertimeContent;
		onchange: (content: OvertimeContent) => void;
	}

	let { content, onchange }: Props = $props();

	let datepickerLocale = $derived(getLocale() === 'zh' ? 'zh-CN' : 'en-US');

	function update(field: keyof OvertimeContent, value: string | number) {
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
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('form.overtimeInfo')}</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<Label for="overtime-start" class="mb-2">{t('form.startDate')}</Label>
			<Datepicker
				value={parseDate(content.startDate)}
				onselect={(date) => update('startDate', toDateStr(date as Date))}
				locale={datepickerLocale}
				placeholder={t('form.startDate')}
			/>
		</div>
		<div>
			<Label for="overtime-end" class="mb-2">{t('form.endDate')}</Label>
			<Datepicker
				value={parseDate(content.endDate)}
				onselect={(date) => update('endDate', toDateStr(date as Date))}
				locale={datepickerLocale}
				placeholder={t('form.endDate')}
			/>
		</div>
		<div>
			<Label for="overtime-hours" class="mb-2">{t('form.overtimeHours')}</Label>
			<Input
				id="overtime-hours"
				type="number"
				value={content.hours}
				min="1"
				onchange={(e) => update('hours', Number(e.currentTarget.value))}
			/>
		</div>
	</div>
	<div>
		<Label for="overtime-reason" class="mb-2">{t('form.overtimeReason')}</Label>
		<Textarea
			id="overtime-reason"
			rows={3}
			value={content.reason}
			oninput={(e) => update('reason', e.currentTarget.value)}
			placeholder={t('form.overtimeReasonPlaceholder')}
		/>
	</div>
</div>
