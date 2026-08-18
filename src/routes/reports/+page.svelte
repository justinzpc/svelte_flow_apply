<script lang="ts">
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import {t} from '$lib/i18n/index.svelte';
 import {browser} from '$app/environment';

 let statusCounts = $derived(applicationStore.countByStatus());
 let allApplications = $derived(applicationStore.getAll());
 let totalCount = $derived(allApplications.length);

 // 懒加载图表组件，避免首屏加载 ECharts
 let StatusPieChart = $state<typeof import('$lib/components/charts/StatusPieChart.svelte').default | null>(null);
 let DepartmentBarChart = $state<typeof import('$lib/components/charts/DepartmentBarChart.svelte').default | null>(null);
 let MonthlyTrendChart = $state<typeof import('$lib/components/charts/MonthlyTrendChart.svelte').default | null>(null);
 let chartsReady = $state(false);

 $effect(() => {
  if (browser) {
   Promise.all([
    import('$lib/components/charts/StatusPieChart.svelte'),
    import('$lib/components/charts/DepartmentBarChart.svelte'),
    import('$lib/components/charts/MonthlyTrendChart.svelte')
   ]).then(([pie, bar, line]) => {
    StatusPieChart = pie.default;
    DepartmentBarChart = bar.default;
    MonthlyTrendChart = line.default;
    chartsReady = true;
   });
  }
 });
</script>
<svelte:head>
	<title>{t('reports.pageTitle')}</title>
</svelte:head>
<div class="space-y-8 bg-white p-6">
	<!-- 页面标题 -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">{t('reports.title')}</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">{t('reports.subtitle')}</p>
	</div>
	<!-- 概览卡片 -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-blue-600">{totalCount}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('reports.totalApplications')}</p>
		</div>
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-green-600">{statusCounts.approved}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('reports.approved')}</p>
		</div>
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-red-600">{statusCounts.rejected}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('reports.rejected')}</p>
		</div>
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('reports.pending')}</p>
		</div>
	</div>
	<!-- 图表区域：懒加载 -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- 状态分布饼图 -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.statusDistribution')}</h2>
			{#if chartsReady && StatusPieChart}
				<StatusPieChart data={statusCounts}/>
			{:else}
				<div class="h-80 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700"></div>
			{/if}
		</div>
		<!-- 部门申请量柱状图 -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.departmentVolume')}</h2>
			{#if chartsReady && DepartmentBarChart}
				<DepartmentBarChart applications={allApplications}/>
			{:else}
				<div class="h-80 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700"></div>
			{/if}
		</div>
	</div>
	<!-- 月度趋势 -->
	<div class="bg-white rounded-lg shadow-lg p-6">
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.monthlyTrend')}</h2>
		{#if chartsReady && MonthlyTrendChart}
			<MonthlyTrendChart applications={allApplications}/>
		{:else}
			<div class="h-80 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700"></div>
		{/if}
	</div>
</div>
