<script lang="ts">
	import * as echarts from 'echarts';
	import type { Application } from '$lib/types/application';

	interface Props {
		applications: Application[];
	}

	let { applications }: Props = $props();

	let chartRef: HTMLDivElement;

	$effect(() => {
		if (!chartRef) return;

		const chart = echarts.init(chartRef);

		// 按月统计
		const monthMap = new Map<string, number>();
		for (const app of applications) {
			const date = new Date(app.createdAt);
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
		}

		const sortedMonths = Array.from(monthMap.keys()).sort();
		const values = sortedMonths.map((m) => monthMap.get(m) ?? 0);

		chart.setOption({
			tooltip: { trigger: 'axis' },
			grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
			xAxis: {
				type: 'category',
				data: sortedMonths,
				axisLabel: { rotate: 30 }
			},
			yAxis: { type: 'value', name: '申请数量', minInterval: 1 },
			series: [
				{
					type: 'line',
					data: values,
					smooth: true,
					lineStyle: { width: 3, color: '#3B82F6' },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
							{ offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
						])
					},
					itemStyle: { color: '#3B82F6' }
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
