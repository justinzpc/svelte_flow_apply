<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import type { User } from '$lib/types/application';
	import { getDepartmentName } from '$lib/data/mock';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-white">申请人信息</h3>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div>
			<Label for="applicant-name" class="mb-2">姓名</Label>
			<Input id="applicant-name" name="applicant-name" value={user.name} disabled />
		</div>
		<div>
			<Label for="applicant-email" class="mb-2">邮箱</Label>
			<Input id="applicant-email" name="applicant-email" value={user.email} disabled />
		</div>
		<div>
			<Label for="applicant-dept" class="mb-2">部门</Label>
			<Input id="applicant-dept" name="applicant-dept" value={getDepartmentName(user.departmentId)} disabled />
		</div>
		<div>
			<Label for="applicant-role" class="mb-2">角色</Label>
			<Input
				id="applicant-role"
				name="applicant-role"
				value={user.role === 'admin' ? '管理员' : user.role === 'manager' ? '经理' : '员工'}
				disabled
			/>
		</div>
	</div>
</div>
