<script lang="ts">
	import { Input, Label, Textarea } from 'flowbite-svelte';
	import type { OvertimeContent } from '$lib/types/application';

	interface Props {
		content: OvertimeContent;
		onchange: (content: OvertimeContent) => void;
	}

	let { content, onchange }: Props = $props();

	function update(field: keyof OvertimeContent, value: string | number) {
		onchange({ ...content, [field]: value });
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">加班信息</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<Label for="overtime-start" class="mb-2">开始日期</Label>
			<Input
				id="overtime-start"
				type="date"
				value={content.startDate}
				onchange={(e) => update('startDate', e.currentTarget.value)}
			/>
		</div>
		<div>
			<Label for="overtime-end" class="mb-2">结束日期</Label>
			<Input
				id="overtime-end"
				type="date"
				value={content.endDate}
				onchange={(e) => update('endDate', e.currentTarget.value)}
			/>
		</div>
		<div>
			<Label for="overtime-hours" class="mb-2">加班时长（小时）</Label>
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
		<Label for="overtime-reason" class="mb-2">加班原因</Label>
		<Textarea
			id="overtime-reason"
			rows={3}
			value={content.reason}
			oninput={(e) => update('reason', e.currentTarget.value)}
			placeholder="请详细说明加班原因..."
		/>
	</div>
</div>
