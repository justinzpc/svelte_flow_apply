<script lang="ts">
	import echarts from './echarts';
	import type { ApplicationStatus } from '$lib/types/application';
	import { STATUS_CONFIG } from '$lib/types/application';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		data: Record<ApplicationStatus, number>;
	}

	let { data }: Props = $props();

	let chartRef: HTMLDivElement;

	const colorMap: Record<string, string> = {
		draft: '#6B7280',
		pending: '#F59E0B',
		approved: '#10B981',
		rejected: '#EF4444',
		cancelled: '#8B5CF6'
	};

	$effect(() => {
		if (!chartRef) return;

		const chart = echarts.init(chartRef);
		const entries = Object.entries(data).filter(([, v]) => v > 0);

		chart.setOption({
			tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
			legend: { bottom: 0 },
			series: [
				{
					type: 'pie',
					radius: ['40%', '70%'],
					center: ['50%', '45%'],
					avoidLabelOverlap: false,
					itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
					label: { show: true, formatter: '{b}\n{c}' },
					data: entries.map(([key, value]) => ({
						name: t('status.' + STATUS_CONFIG[key as ApplicationStatus].label),
						value,
						itemStyle: { color: colorMap[key] }
					}))
				}
			]
		});

		const handleResize = () => chart.resize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			chart.dispose();
		};
	});
</script>

<div bind:this={chartRef} class="h-80 w-full"></div>
