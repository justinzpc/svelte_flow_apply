<script lang="ts">
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import StatusPieChart from '$lib/components/charts/StatusPieChart.svelte';
 import DepartmentBarChart from '$lib/components/charts/DepartmentBarChart.svelte';
 import MonthlyTrendChart from '$lib/components/charts/MonthlyTrendChart.svelte';
 import {t} from '$lib/i18n/index.svelte';

 let statusCounts = $derived(applicationStore.countByStatus());
 let allApplications = $derived(applicationStore.getAll());
 let totalCount = $derived(allApplications.length);
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
	<!-- 图表区域 -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- 状态分布饼图 -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.statusDistribution')}</h2>
			<StatusPieChart data={statusCounts}/>
		</div>
		<!-- 部门申请量柱状图 -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.departmentVolume')}</h2>
			<DepartmentBarChart applications={allApplications}/>
		</div>
	</div>
	<!-- 月度趋势 -->
	<div class="bg-white rounded-lg shadow-lg p-6">
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.monthlyTrend')}</h2>
		<MonthlyTrendChart applications={allApplications}/>
	</div>
</div>
