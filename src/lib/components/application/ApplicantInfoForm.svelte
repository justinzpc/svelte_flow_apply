<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import type { User } from '$lib/types/application';
	import { getDepartmentName } from '$lib/data/mock';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('form.applicantInfo')}</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<Label for="applicant-name" class="mb-2">{t('form.name')}</Label>
			<Input id="applicant-name" name="applicant-name" value={user.name} disabled />
		</div>
		<div>
			<Label for="applicant-email" class="mb-2">{t('form.email')}</Label>
			<Input id="applicant-email" name="applicant-email" value={user.email} disabled />
		</div>
		<div>
			<Label for="applicant-dept" class="mb-2">{t('form.department')}</Label>
			<Input id="applicant-dept" name="applicant-dept" value={getDepartmentName(user.departmentId)} disabled />
		</div>
		<div>
			<Label for="applicant-role" class="mb-2">{t('form.role')}</Label>
			<Input
				id="applicant-role"
				name="applicant-role"
				value={user.role === 'admin' ? t('form.admin') : user.role === 'manager' ? t('form.manager') : t('form.employee')}
				disabled
			/>
		</div>
	</div>
</div>
