<script lang="ts">
 import {page} from '$app/stores';
 import {Badge, Button, Card, Textarea, Timeline, TimelineItem} from 'flowbite-svelte';
 import type {ApplicationType} from '$lib/types/application';
 import {isOvertimeContent, isProcurementContent, isTravelContent, STATUS_CONFIG} from '$lib/types/application';
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import {currentUser, getDepartmentName, getUserById, getUserName} from '$lib/data/mock';
 import {getAvailableActions} from '$lib/services/stateMachine';

 let approveComment = $state('');
 let showApproveForm = $state(false);

 let applicationId = $derived($page.params.id);
 let app = $derived(applicationStore.getById(applicationId));
 let applicant = $derived(app ? getUserById(app.applicantId) : undefined);
 let approver = $derived(app?.approverId ? getUserById(app.approverId) : undefined);
 let availableActions = $derived(app ? getAvailableActions(app.status) : []);

 const typeLabels: Record<ApplicationType, string> = {
  overtime: '加班申请',
  travel: '差旅申请',
  procurement: '采购申请'
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
	<title>申请详情 - 申请管理系统</title>
</svelte:head>
{#if app && applicant}
	{@const config = STATUS_CONFIG[app.status]}
	<div class="mx-auto space-y-6 bg-white p-6">
		<!-- 返回按钮和标题 -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button color="alternative" size="sm" onclick={() => history.back()}>返回</Button>
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">{app.title}</h1>
					<div class="mt-1 flex items-center gap-2">
						<Badge color={config.color}>{config.label}</Badge>
						<span class="text-sm text-gray-500 dark:text-gray-400">{typeLabels[app.type]}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 申请人信息 -->
		<form class="w-full bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">申请人信息</h2>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">姓名：</span>
					<span class="font-medium text-gray-900 dark:text-white">{applicant.name}</span>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">邮箱：</span>
					<span class="font-medium text-gray-900 dark:text-white">{applicant.email}</span>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">部门：</span>
					<span class="font-medium text-gray-900 dark:text-white">{getDepartmentName(applicant.departmentId)}</span>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">角色：</span>
					<span class="font-medium text-gray-900 dark:text-white">
						{applicant.role === 'admin' ? '管理员' : applicant.role === 'manager' ? '经理' : '员工'}
					</span>
				</div>
			</div>
		</form>
		<!-- 申请内容 -->
		<form class="w-full bg-white rounded-lg shadow-lg p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">申请内容</h2>
			{#if isOvertimeContent(app.content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">开始日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">结束日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.endDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">加班时长：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.hours} 小时</span>
					</div>
				</div>
				<div class="mt-3">
					<span class="text-sm text-gray-500 dark:text-gray-400">加班原因：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{app.content.reason}</p>
				</div>
			{:else if isTravelContent(app.content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">目的地：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.destination}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">预算：</span>
						<span class="font-medium text-gray-900 dark:text-white">¥{app.content.budget.toFixed(2)}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">出发日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">返回日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{app.content.endDate}</span>
					</div>
				</div>
				<div class="mt-3">
					<span class="text-sm text-gray-500 dark:text-gray-400">出差事由：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{app.content.purpose}</p>
				</div>
			{:else if isProcurementContent(app.content)}
				<div>
					<h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">采购清单：</h4>
					<table class="w-full text-left text-sm">
						<thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
						<tr>
							<th class="px-3 py-2">物品名称</th>
							<th class="px-3 py-2">数量</th>
							<th class="px-3 py-2">单价</th>
							<th class="px-3 py-2">小计</th>
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
					<span class="text-sm text-gray-500 dark:text-gray-400">总预算：</span>
					<span class="text-lg font-bold text-gray-900 dark:text-white">¥{app.content.totalBudget.toFixed(2)}</span>
				</div>
				<div class="mt-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">采购用途：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{app.content.purpose}</p>
				</div>
			{/if}
		</form>
		<!-- 审批流程时间线 -->
		<Card>
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">审批流程</h2>
			<Timeline>
				<TimelineItem>
					<p class="font-medium text-gray-900 dark:text-white">提交申请</p>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						{getUserName(app.applicantId)} 于 {new Date(app.createdAt).toLocaleString('zh-CN')} 创建申请
					</p>
				</TimelineItem>
				{#if app.status !== 'draft'}
					<TimelineItem>
						<p class="font-medium text-gray-900 dark:text-white">提交审批</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							申请已提交，等待审批
						</p>
					</TimelineItem>
				{/if}
				{#if app.status === 'approved' && approver}
					<TimelineItem>
						<p class="font-medium text-green-600">审批通过</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{approver.name} 于 {app.approveAt ? new Date(app.approveAt).toLocaleString('zh-CN') : ''} 审批通过
						</p>
						{#if app.approveComment}
							<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
								审批意见：{app.approveComment}
							</p>
						{/if}
					</TimelineItem>
				{:else if app.status === 'rejected' && approver}
					<TimelineItem>
						<p class="font-medium text-red-600">审批驳回</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{approver.name} 于 {app.approveAt ? new Date(app.approveAt).toLocaleString('zh-CN') : ''} 驳回申请
						</p>
						{#if app.approveComment}
							<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
								驳回原因：{app.approveComment}
							</p>
						{/if}
					</TimelineItem>
				{:else if app.status === 'cancelled'}
					<TimelineItem>
						<p class="font-medium text-purple-600">申请已取消</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							申请人取消了此申请
						</p>
					</TimelineItem>
				{/if}
			</Timeline>
		</Card>
		<!-- 操作区域 -->
		{#if availableActions.length > 0}
			<div>
				<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">操作</h2>
				<div class="flex flex-wrap gap-3">
					{#each availableActions as action}
						{#if action.targetStatus === 'approved' || action.targetStatus === 'rejected'}
							<Button color={action.color} onclick={() => { showApproveForm = true; }}>{action.label}</Button>
						{:else}
							<Button color={action.color} onclick={() => handleAction(action.targetStatus)}>{action.label}</Button>
						{/if}
					{/each}
				</div>
				{#if showApproveForm}
					<div class="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Textarea bind:value={approveComment} rows={3} placeholder="请输入审批意见..."/>
						<div class="flex gap-2">
							<Button color="blue" onclick={() => handleAction('approved')}>通过</Button>
							<Button color="red" onclick={() => handleAction('rejected')}>驳回</Button>
							<Button color="alternative" onclick={() => { showApproveForm = false; approveComment = ''; }}>取消
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="text-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">申请不存在</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">找不到该申请记录</p>
		<Button class="mt-4" color="blue" href="/applications">返回列表</Button>
	</div>
{/if}
