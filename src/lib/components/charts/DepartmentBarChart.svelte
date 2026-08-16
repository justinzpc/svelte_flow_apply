<script lang="ts">
	import * as echarts from 'echarts';
	import type { Application, ApplicationType } from '$lib/types/application';
	import { departments, getUserById } from '$lib/data/mock';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		applications: Application[];
	}

	let { applications }: Props = $props();

	let chartRef: HTMLDivElement;

	$effect(() => {
		if (!chartRef) return;

		const chart = echarts.init(chartRef);

		// 按部门和类型统计
		const deptNames = departments.map((d) => d.name);
		const types: ApplicationType[] = ['overtime', 'travel', 'procurement'];
		const typeLabels: Record<ApplicationType, string> = {
			overtime: t('type.overtime'),
			travel: t('type.travel'),
			procurement: t('type.procurement')
		};
		const typeColors = ['#3B82F6', '#10B981', '#F59E0B'];

		const series = types.map((type, idx) => ({
			name: typeLabels[type],
			type: 'bar' as const,
			stack: 'total',
			barWidth: '50%',
			itemStyle: { color: typeColors[idx], borderRadius: idx === types.length - 1 ? [4, 4, 0, 0] : undefined },
			data: departments.map((dept) => {
				return applications.filter((app) => {
					const user = getUserById(app.applicantId);
					return user?.departmentId === dept.id && app.type === type;
				}).length;
			})
		}));

		chart.setOption({
			tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
			legend: { bottom: 0 },
			grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
			xAxis: { type: 'category', data: deptNames },
			yAxis: { type: 'value', name: t('reports.totalApplications') },
			series
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
