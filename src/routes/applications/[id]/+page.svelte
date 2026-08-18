<script lang="ts">
 import {page} from '$app/stores';
 import {Badge, Button, Textarea, Timeline, TimelineItem} from 'flowbite-svelte';
 import type {ApplicationType} from '$lib/types/application';
 import {isOvertimeContent, isProcurementContent, isTravelContent, STATUS_CONFIG} from '$lib/types/application';
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import {currentUser, getDepartmentName, getUserById, getUserName} from '$lib/data/mock';
 import {getAvailableActions} from '$lib/services/stateMachine';
 import {formatDateTime, t} from '$lib/i18n/index.svelte';

 let approveComment = $state('');
 let showApproveForm = $state(false);

 let applicationId = $derived($page.params.id);
 let app = $derived(applicationId ? applicationStore.getById(applicationId) : undefined);
 let applicant = $derived(app ? getUserById(app.applicantId) : undefined);
 let approver = $derived(app?.approverId ? getUserById(app.approverId) : undefined);
 let availableActions = $derived(app ? getAvailableActions(app.status) : []);

 const typeLabels: Record<ApplicationType, string> = {
  overtime: 'overtime',
  travel: 'travel',
  procurement: 'procurement'
 };

 function handleAction(targetStatus: string) {
  if (!app) return;
  if (targetStatus === 'pending') {
   applicationStore.submit(app.id);
  } else if (targetStatus === 'approved') {
   applicationStore.approve(app.id, currentUser.id, approveComment);
   showApproveForm = false;
  } else if (targetStatus === 'rejected') {
   applicationStore.reject(app.id, currentUser.id, approveComment);
   showApproveForm = false;
  } else if (targetStatus === 'cancelled') {
   applicationStore.cancel(app.id);
  }
  approveComment = '';
 }
</script>
<svelte:head>
	<title>{t('detail.pageTitle')}</title>
</svelte:head>
{#if app && applicant}
	{@const config = STATUS_CONFIG[app.status]}
	<div class="mx-auto space-y-6 bg-white p-6">
		<!-- 返回按钮和标题 -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button color="alternative" size="sm" onclick={() => history.back()}>{t('common.back')}</Button>
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">{app.title}</h1>
					<div class="mt-1 flex items-center gap-2">
						<Badge color={config.color as any}>{t('status.' + config.label)}</Badge>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('type.' + typeLabels[app.type])}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 申请人信息 -->
		<form class="w-full bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('detail.applicantInfo')}</h2>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.name')}：</span>
					<span class="font-medium text-gray-900 dark:text-white">{applicant.name}</span>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.email')}：</span>
					<span class="font-medium text-gray-900 dark:text-white">{applicant.email}</span>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.department')}：</span>
					<span class="font-medium text-gray-900 dark:text-white">{getDepartmentName(applicant.departmentId)}</span>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.role')}：</span>
					<span class="font-medium text-gray-900 dark:text-white">
						{applicant.role === 'admin' ? t('form.admin') : applicant.role === 'manager' ? t('form.manager') : t('form.employee')}
					</span>
				</div>
			</div>
		</form>
		<!-- 申请内容 -->
		<form class="w-full bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('detail.applicationContent')}</h2>
			{#if isOvertimeContent(app.content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.startDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.endDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.endDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.overtimeHours')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.hours} {t('common.hours')}</span>
					</div>
				</div>
				<div class="mt-3">
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.overtimeReason')}：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{app.content.reason}</p>
				</div>
			{:else if isTravelContent(app.content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.destination')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.destination}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.budget')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">¥{app.content.budget.toFixed(2)}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.departureDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.returnDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.endDate}</span>
					</div>
				</div>
				<div class="mt-3">
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.travelPurpose')}：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{app.content.purpose}</p>
				</div>
			{:else if isProcurementContent(app.content)}
				<div>
					<h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t('detail.procurementList')}</h4>
					<table class="w-full text-left text-sm">
						<thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
						<tr>
							<th class="px-3 py-2">{t('detail.itemName')}</th>
							<th class="px-3 py-2">{t('detail.quantity')}</th>
							<th class="px-3 py-2">{t('detail.unitPrice')}</th>
							<th class="px-3 py-2">{t('detail.subtotal')}</th>
						</tr>
						</thead>
						<tbody>
						{#each app.content.items as item}
							<tr class="border-b dark:border-gray-700">
								<td class="px-3 py-2 text-gray-900 dark:text-white">{item.name}</td>
								<td class="px-3 py-2 text-gray-900 dark:text-white">{item.quantity}</td>
								<td class="px-3 py-2 text-gray-900 dark:text-white">¥{item.unitPrice.toFixed(2)}</td>
								<td class="px-3 py-2 text-gray-900 dark:text-white">¥{(item.quantity * item.unitPrice).toFixed(2)}</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
				<div class="mt-4">
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.totalBudget')}：</span>
					<span class="text-lg font-bold text-gray-900 dark:text-white">¥{app.content.totalBudget.toFixed(2)}</span>
				</div>
				<div class="mt-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.procurementPurpose')}：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{app.content.purpose}</p>
				</div>
			{/if}
		</form>
		<!-- 审批流程时间线 -->
		<div>
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('detail.approvalProcess')}</h2>
			<Timeline>
				<TimelineItem title="" date="">
					<p class="font-medium text-gray-900 dark:text-white">{t('detail.eventSubmitted')}</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{t('detail.eventCreated', {name: getUserName(app.applicantId), date: formatDateTime(app.createdAt)})}
					</p>
				</TimelineItem>
				{#if app.status !== 'draft'}
					<TimelineItem title="" date="">
						<p class="font-medium text-gray-900 dark:text-white">{t('detail.eventSubmitted')}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{t('detail.eventPending')}
						</p>
					</TimelineItem>
				{/if}
				{#if app.status === 'approved' && approver}
					<TimelineItem title="" date="">
						<p class="font-medium text-green-600">{t('detail.eventApproved')}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{t('detail.eventApprovedBy', {
               name: approver.name,
               date: app.approveAt ? formatDateTime(app.approveAt) : ''
              })}
						</p>
						{#if app.approveComment}
							<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
								{t('detail.approvalComment')}{app.approveComment}
							</p>
						{/if}
					</TimelineItem>
				{:else if app.status === 'rejected' && approver}
					<TimelineItem title="" date="">
						<p class="font-medium text-red-600">{t('detail.eventRejected')}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{t('detail.eventRejectedBy', {
               name: approver.name,
               date: app.approveAt ? formatDateTime(app.approveAt) : ''
              })}
						</p>
						{#if app.approveComment}
							<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
								{t('detail.rejectionReason')}{app.approveComment}
							</p>
						{/if}
					</TimelineItem>
				{:else if app.status === 'cancelled'}
					<TimelineItem title="" date="">
						<p class="font-medium text-purple-600">{t('detail.eventCancelled')}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{t('detail.eventCancelledBy')}
						</p>
					</TimelineItem>
				{/if}
			</Timeline>
		</div>
		<!-- 操作区域 -->
		{#if availableActions.length > 0}
			<div>
				<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('detail.actions')}</h2>
				<div class="flex flex-wrap gap-3">
					{#each availableActions as action}
						{#if action.targetStatus === 'approved' || action.targetStatus === 'rejected'}
							<Button color={action.color}
							 onclick={() => { showApproveForm = true; }}>{t('action.' + action.targetStatus)}</Button>
						{:else}
							<Button color={action.color}
							 onclick={() => handleAction(action.targetStatus)}>{t('action.' + action.targetStatus)}</Button>
						{/if}
					{/each}
				</div>
				{#if showApproveForm}
					<div class="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Textarea bind:value={approveComment} rows={3} placeholder={t('detail.approvePlaceholder')}/>
						<div class="flex gap-2">
							<Button color="blue" onclick={() => handleAction('approved')}>{t('detail.approve')}</Button>
							<Button color="red" onclick={() => handleAction('rejected')}>{t('detail.reject')}</Button>
							<Button color="alternative"
							 onclick={() => { showApproveForm = false; approveComment = ''; }}>{t('common.cancel')}
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="text-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">{t('detail.notFound')}</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">{t('detail.notFoundMessage')}</p>
		<Button class="mt-4" color="blue" href="/applications">{t('detail.backToList')}</Button>
	</div>
{/if}
