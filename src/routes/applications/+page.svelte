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
 import {getDepartmentName, getUserById, getUserName} from '$lib/data/mock';
 import {formatDate, t} from '$lib/i18n/index.svelte';

 let filterStatus = $state<ApplicationStatus | ''>('');
 let filterType = $state<ApplicationType | ''>('');

 let filteredApplications = $derived(
  applicationStore.getAll().filter((app) => {
   if (filterStatus && app.status !== filterStatus) return false;
   if (filterType && app.type !== filterType) return false;
   return true;
  })
 );
 const selectHolder = $derived(t('all.filterPlaceholder'));
 const typeLabels: Record<ApplicationType, string> = {
  overtime: 'overtime',
  travel: 'travel',
  procurement: 'procurement'
 };
</script>
<svelte:head>
	<title>{t('all.pageTitle')}</title>
</svelte:head>
<div class="space-y-6 bg-white p-6">
	<!-- 页面标题 -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">{t('all.title')}</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">{t('all.subtitle')}</p>
		</div>
		<Button color="blue" href="/apply">{t('all.newApplication')}</Button>
	</div>
	<!-- 筛选 -->
	<div class="flex flex-wrap gap-4">
		<div class="w-48">
			<Select bind:value={filterStatus} placeholder={selectHolder}>
				<option value="">{t('all.allStatuses')}</option>
				{#each Object.values(STATUS_CONFIG) as config}
					<option value={config.value}>{t('status.' + config.label)}</option>
				{/each}
			</Select>
		</div>
		<div class="w-48">
			<Select bind:value={filterType} placeholder={selectHolder}>
				<option value="">{t('all.allTypes')}</option>
				{#each APPLICATION_TYPES as type}
					<option value={type.value}>{t('type.' + type.value)}</option>
				{/each}
			</Select>
		</div>
	</div>
	<!-- 申请列表 -->
	<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
		<Table hoverable>
			<TableHead>
				<TableHeadCell>{t('all.colTitle')}</TableHeadCell>
				<TableHeadCell>{t('all.colApplicant')}</TableHeadCell>
				<TableHeadCell>{t('all.colDepartment')}</TableHeadCell>
				<TableHeadCell>{t('all.colType')}</TableHeadCell>
				<TableHeadCell>{t('all.colStatus')}</TableHeadCell>
				<TableHeadCell>{t('all.colSubmitTime')}</TableHeadCell>
				<TableHeadCell>{t('all.colActions')}</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each filteredApplications as app}
					{@const config = STATUS_CONFIG[app.status]}
					{@const applicant = getUserById(app.applicantId)}
					<TableBodyRow>
						<TableBodyCell class="font-medium text-gray-900 dark:text-white">{app.title}</TableBodyCell>
						<TableBodyCell>{getUserName(app.applicantId)}</TableBodyCell>
						<TableBodyCell>{applicant ? getDepartmentName(applicant.departmentId) : '-'}</TableBodyCell>
						<TableBodyCell>{t('type.' + app.type)}</TableBodyCell>
						<TableBodyCell>
							<Badge color={config.color as any}>{t('status.' + config.label)}</Badge>
						</TableBodyCell>
						<TableBodyCell>{formatDate(app.createdAt)}</TableBodyCell>
						<TableBodyCell>
							<Button size="xs" color="blue" href="/applications/{app.id}">{t('common.view')}</Button>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell colspan={7} class="text-center text-gray-500">{t('all.noRecords')}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<p class="text-sm text-gray-500 dark:text-gray-400">
		{t('all.totalRecords', {count: filteredApplications.length})}
	</p>
</div>
