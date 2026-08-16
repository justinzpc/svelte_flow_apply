<script lang="ts">
 import {Badge} from 'flowbite-svelte';
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import {STATUS_CONFIG} from '$lib/types/application';

 let statusCounts = $derived(applicationStore.countByStatus());
 let total = $derived(applicationStore.getAll().length);
</script>
<svelte:head>
	<title>仪表盘 - 申请管理系统</title>
</svelte:head>
<div class="space-y-8 bg-white p-6">
	<!-- 页面标题 -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">申请流程管理系统概览</p>
	</div>
	<!-- 统计卡片 -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-blue-500">
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">总申请数</p>
			<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{total}</p>
		</div>
		<div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-yellow-500">
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">待审批</p>
			<p class="mt-2 text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
		</div>
		<div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-green-500">
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">已通过</p>
			<p class="mt-2 text-3xl font-bold text-green-600">{statusCounts.approved}</p>
		</div>
		<div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-red-500">
			<p class="text-sm font-medium text-gray-500 dark:text-gray-400">已驳回</p>
			<p class="mt-2 text-3xl font-bold text-red-600">{statusCounts.rejected}</p>
		</div>
	</div>
	<!-- 最近申请 -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">最近申请</h2>
		<div class="space-y-3">
			{#each applicationStore.getAll().slice(-5).reverse() as app}
				{@const config = STATUS_CONFIG[app.status]}
				<a href="/applications/{app.id}" class="block">
					<div class="bg-white rounded-lg shadow-lg p-6 transition-shadow hover:shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-semibold text-gray-900 dark:text-white">{app.title}</h3>
								<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{new Date(app.createdAt).toLocaleDateString('zh-CN')}
								</p>
							</div>
							<Badge color={config.color}>{config.label}</Badge>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
	<!-- 快捷操作 -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">快捷操作</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<a href="/apply"
			 class="rounded-lg border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
				<div class="text-3xl">+</div>
				<p class="mt-2 font-medium text-gray-900 dark:text-white">发起新申请</p>
			</a>
			<a href="/applications/my"
			 class="rounded-lg border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
				<div class="text-3xl">📋</div>
				<p class="mt-2 font-medium text-gray-900 dark:text-white">查看我的申请</p>
			</a>
			<a href="/reports"
			 class="rounded-lg border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
				<div class="text-3xl">📊</div>
				<p class="mt-2 font-medium text-gray-900 dark:text-white">统计报表</p>
			</a>
		</div>
	</div>
</div>
