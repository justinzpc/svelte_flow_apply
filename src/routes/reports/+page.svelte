<script lang="ts">
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import StatusPieChart from '$lib/components/charts/StatusPieChart.svelte';
 import DepartmentBarChart from '$lib/components/charts/DepartmentBarChart.svelte';
 import MonthlyTrendChart from '$lib/components/charts/MonthlyTrendChart.svelte';

 let statusCounts = $derived(applicationStore.countByStatus());
 let allApplications = $derived(applicationStore.getAll());
 let totalCount = $derived(allApplications.length);
</script>
<svelte:head>
	<title>统计报表 - 申请管理系统</title>
</svelte:head>
<div class="space-y-8 bg-white p-6">
	<!-- 页面标题 -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">统计报表</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">申请数据可视化分析</p>
	</div>
	<!-- 概览卡片 -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-blue-600">{totalCount}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">总申请数</p>
		</div>
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-green-600">{statusCounts.approved}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">已通过</p>
		</div>
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-red-600">{statusCounts.rejected}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">已驳回</p>
		</div>
		<div class="text-center bg-white rounded-lg shadow-lg p-6">
			<p class="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">待审批</p>
		</div>
	</div>
	<!-- 图表区域 -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- 状态分布饼图 -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">申请状态分布</h2>
			<StatusPieChart data={statusCounts}/>
		</div>
		<!-- 部门申请量柱状图 -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">各部门申请量</h2>
			<DepartmentBarChart applications={allApplications}/>
		</div>
	</div>
	<!-- 月度趋势 -->
	<div class="bg-white rounded-lg shadow-lg p-6">
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">月度申请趋势</h2>
		<MonthlyTrendChart applications={allApplications}/>
	</div>
</div>
