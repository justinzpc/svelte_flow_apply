<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import type { ApplicationContent, ApplicationType, User } from '$lib/types/application';
	import { isOvertimeContent, isTravelContent, isProcurementContent } from '$lib/types/application';
	import { getDepartmentName } from '$lib/data/mock';

	interface Props {
		user: User;
		type: ApplicationType;
		title: string;
		content: ApplicationContent;
		onedit: (field: string) => void;
	}

	let { user, type, title, content, onedit }: Props = $props();

	const typeLabels: Record<ApplicationType, string> = {
		overtime: '加班申请',
		travel: '差旅申请',
		procurement: '采购申请'
	};
</script>

<div class="space-y-6">
	<!-- 申请人信息预览 -->
	<Card>
		<div class="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">申请人信息</h3>
			<Button size="xs" color="alternative" onclick={() => onedit('applicant')}>修改</Button>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-4">
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">姓名：</span>
				<span class="font-medium text-gray-900 dark:text-white">{user.name}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">邮箱：</span>
				<span class="font-medium text-gray-900 dark:text-white">{user.email}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">部门：</span>
				<span class="font-medium text-gray-900 dark:text-white">{getDepartmentName(user.departmentId)}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">角色：</span>
				<span class="font-medium text-gray-900 dark:text-white">
					{user.role === 'admin' ? '管理员' : user.role === 'manager' ? '经理' : '员工'}
				</span>
			</div>
		</div>
	</Card>

	<!-- 申请基本信息 -->
	<Card>
		<div class="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">申请基本信息</h3>
			<Button size="xs" color="alternative" onclick={() => onedit('title')}>修改</Button>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-4">
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">申请类型：</span>
				<span class="font-medium text-gray-900 dark:text-white">{typeLabels[type]}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">申请标题：</span>
				<span class="font-medium text-gray-900 dark:text-white">{title}</span>
			</div>
		</div>
	</Card>

	<!-- 申请内容预览 -->
	<Card>
		<div class="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">申请内容</h3>
			<Button size="xs" color="alternative" onclick={() => onedit('content')}>修改</Button>
		</div>
		<div class="mt-4 space-y-3">
			{#if isOvertimeContent(content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">开始日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">结束日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.endDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">加班时长：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.hours} 小时</span>
					</div>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">加班原因：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{content.reason}</p>
				</div>
			{:else if isTravelContent(content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">目的地：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.destination}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">预算：</span>
						<span class="font-medium text-gray-900 dark:text-white">¥{content.budget.toFixed(2)}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">出发日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">返回日期：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.endDate}</span>
					</div>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">出差事由：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{content.purpose}</p>
				</div>
			{:else if isProcurementContent(content)}
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
							{#each content.items as item}
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
					<span class="text-lg font-bold text-gray-900 dark:text-white">¥{content.totalBudget.toFixed(2)}</span>
				</div>
				<div class="mt-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">采购用途：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{content.purpose}</p>
				</div>
			{/if}
		</div>
	</Card>
</div>
