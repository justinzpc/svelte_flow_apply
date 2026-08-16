<script lang="ts">
 import {
  Badge,
  Button,
  Select,
  Table,
  TableBody,
  TableBodyCell,
  TableBodyRow,
  TableHead,
  TableHeadCell
 } from 'flowbite-svelte';
 import type {ApplicationStatus, ApplicationType} from '$lib/types/application';
 import {APPLICATION_TYPES, STATUS_CONFIG} from '$lib/types/application';
 import {applicationStore} from '$lib/services/applicationStore.svelte';

 let filterStatus = $state<ApplicationStatus | ''>('');
 let filterType = $state<ApplicationType | ''>('');

 let myApplications = $derived(
  applicationStore.getMyApplications().filter((app) => {
   if (filterStatus && app.status !== filterStatus) return false;
   if (filterType && app.type !== filterType) return false;
   return true;
  })
 );
 const selectHolder = $state('选择过滤选项');
 const typeLabels: Record<ApplicationType, string> = {
  overtime: '加班申请',
  travel: '差旅申请',
  procurement: '采购申请'
 };
</script>
<svelte:head>
	<title>我的申请 - 申请管理系统</title>
</svelte:head>
<div class="space-y-6 bg-white p-6">
	<!-- 页面标题 -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">我的申请</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">查看您提交的所有申请</p>
		</div>
		<Button color="blue" href="/apply">发起新申请</Button>
	</div>
	<!-- 筛选 -->
	<div class="flex flex-wrap gap-4">
		<div class="w-48">
			<Select bind:value={filterStatus} placeholder={selectHolder}>
				<option value="">全部状态</option>
				{#each Object.values(STATUS_CONFIG) as config}
					<option value={config.value}>{config.label}</option>
				{/each}
			</Select>
		</div>
		<div class="w-48">
			<Select bind:value={filterType} placeholder={selectHolder}>
				<option value="">全部类型</option>
				{#each APPLICATION_TYPES as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</Select>
		</div>
	</div>
	<!-- 申请列表 -->
	<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
		<Table hoverable>
			<TableHead>
				<TableHeadCell>标题</TableHeadCell>
				<TableHeadCell>类型</TableHeadCell>
				<TableHeadCell>状态</TableHeadCell>
				<TableHeadCell>提交时间</TableHeadCell>
				<TableHeadCell>更新时间</TableHeadCell>
				<TableHeadCell>操作</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each myApplications as app}
					{@const config = STATUS_CONFIG[app.status]}
					<TableBodyRow>
						<TableBodyCell class="font-medium text-gray-900 dark:text-white">{app.title}</TableBodyCell>
						<TableBodyCell>{typeLabels[app.type]}</TableBodyCell>
						<TableBodyCell>
							<Badge color={config.color}>{config.label}</Badge>
						</TableBodyCell>
						<TableBodyCell>{new Date(app.createdAt).toLocaleDateString('zh-CN')}</TableBodyCell>
						<TableBodyCell>{new Date(app.updatedAt).toLocaleDateString('zh-CN')}</TableBodyCell>
						<TableBodyCell>
							<Button size="xs" color="blue" href="/applications/{app.id}">查看</Button>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell colspan={6} class="text-center text-gray-500">暂无申请记录</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<p class="text-sm text-gray-500 dark:text-gray-400">
		共 {myApplications.length} 条记录
	</p>
</div>
