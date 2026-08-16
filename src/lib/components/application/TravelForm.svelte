<script lang="ts">
	import { Input, Label, Textarea } from 'flowbite-svelte';
	import type { TravelContent } from '$lib/types/application';

	interface Props {
		content: TravelContent;
		onchange: (content: TravelContent) => void;
	}

	let { content, onchange }: Props = $props();

	function update(field: keyof TravelContent, value: string | number) {
		onchange({ ...content, [field]: value });
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">差旅信息</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<Label for="travel-destination" class="mb-2">目的地</Label>
			<Input
				id="travel-destination"
				value={content.destination}
				oninput={(e) => update('destination', e.currentTarget.value)}
				placeholder="请输入目的地"
			/>
		</div>
		<div>
			<Label for="travel-budget" class="mb-2">预算（元）</Label>
			<Input
				id="travel-budget"
				type="number"
				value={content.budget}
				min="0"
				onchange={(e) => update('budget', Number(e.currentTarget.value))}
			/>
		</div>
		<div>
			<Label for="travel-start" class="mb-2">出发日期</Label>
			<Input
				id="travel-start"
				type="date"
				value={content.startDate}
				onchange={(e) => update('startDate', e.currentTarget.value)}
			/>
		</div>
		<div>
			<Label for="travel-end" class="mb-2">返回日期</Label>
			<Input
				id="travel-end"
				type="date"
				value={content.endDate}
				onchange={(e) => update('endDate', e.currentTarget.value)}
			/>
		</div>
	</div>
	<div>
		<Label for="travel-purpose" class="mb-2">出差事由</Label>
		<Textarea
			id="travel-purpose"
			rows={3}
			value={content.purpose}
			oninput={(e) => update('purpose', e.currentTarget.value)}
			placeholder="请详细说明出差事由..."
		/>
	</div>
</div>
