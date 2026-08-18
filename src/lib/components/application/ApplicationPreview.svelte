<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { ApplicationContent, ApplicationType, User } from '$lib/types/application';
	import { isOvertimeContent, isTravelContent, isProcurementContent } from '$lib/types/application';
	import { getDepartmentName } from '$lib/data/mock';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		user: User;
		type: ApplicationType;
		title: string;
		content: ApplicationContent;
		onedit: (field: string) => void;
	}

	let { user, type, title, content, onedit }: Props = $props();

	const typeLabels: Record<ApplicationType, string> = {
		overtime: 'overtime',
		travel: 'travel',
		procurement: 'procurement'
	};
</script>

<div class="space-y-6">
	<!-- 申请人信息预览 -->
	<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('preview.applicantInfo')}</h3>
			<Button size="xs" color="alternative" onclick={() => onedit('applicant')}>{t('preview.edit')}</Button>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-4">
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.name')}：</span>
				<span class="font-medium text-gray-900 dark:text-white">{user.name}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.email')}：</span>
				<span class="font-medium text-gray-900 dark:text-white">{user.email}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.department')}：</span>
				<span class="font-medium text-gray-900 dark:text-white">{getDepartmentName(user.departmentId)}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.role')}：</span>
				<span class="font-medium text-gray-900 dark:text-white">
					{user.role === 'admin' ? t('form.admin') : user.role === 'manager' ? t('form.manager') : t('form.employee')}
				</span>
			</div>
		</div>
	</div>

	<!-- 申请基本信息 -->
	<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('preview.basicInfo')}</h3>
			<Button size="xs" color="alternative" onclick={() => onedit('title')}>{t('preview.edit')}</Button>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-4">
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">{t('preview.applicationType')}：</span>
				<span class="font-medium text-gray-900 dark:text-white">{t('type.' + typeLabels[type])}</span>
			</div>
			<div>
				<span class="text-sm text-gray-500 dark:text-gray-400">{t('preview.applicationTitle')}：</span>
				<span class="font-medium text-gray-900 dark:text-white">{title}</span>
			</div>
		</div>
	</div>

	<!-- 申请内容预览 -->
	<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('preview.applicationContent')}</h3>
			<Button size="xs" color="alternative" onclick={() => onedit('content')}>{t('preview.edit')}</Button>
		</div>
		<div class="mt-4 space-y-3">
			{#if isOvertimeContent(content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.startDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.endDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.endDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.overtimeHours')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.hours} {t('common.hours')}</span>
					</div>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.overtimeReason')}：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{content.reason}</p>
				</div>
			{:else if isTravelContent(content)}
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.destination')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.destination}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.budget')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">¥{content.budget.toFixed(2)}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.departureDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.startDate}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.returnDate')}：</span>
						<span class="font-medium text-gray-900 dark:text-white">{content.endDate}</span>
					</div>
				</div>
				<div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.travelPurpose')}：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{content.purpose}</p>
				</div>
			{:else if isProcurementContent(content)}
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
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.totalBudget')}：</span>
					<span class="text-lg font-bold text-gray-900 dark:text-white">¥{content.totalBudget.toFixed(2)}</span>
				</div>
				<div class="mt-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">{t('detail.procurementPurpose')}：</span>
					<p class="mt-1 text-gray-900 dark:text-white">{content.purpose}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
