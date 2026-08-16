<script lang="ts">
 import {goto} from '$app/navigation';
 import {Button, Card, Input, Label, Stepper} from 'flowbite-svelte';
 import type {
  ApplicationContent,
  ApplicationType,
  OvertimeContent,
  ProcurementContent,
  TravelContent
 } from '$lib/types/application';
 import {currentUser} from '$lib/data/mock';
 import {applicationStore} from '$lib/services/applicationStore.svelte';
 import TypeSelector from '$lib/components/application/TypeSelector.svelte';
 import ApplicantInfoForm from '$lib/components/application/ApplicantInfoForm.svelte';
 import OvertimeForm from '$lib/components/application/OvertimeForm.svelte';
 import TravelForm from '$lib/components/application/TravelForm.svelte';
 import ProcurementForm from '$lib/components/application/ProcurementForm.svelte';
 import ApplicationPreview from '$lib/components/application/ApplicationPreview.svelte';
 import TypeIcon from '$lib/components/icons/TypeIcon.svelte';
 import FormIcon from '$lib/components/icons/FormIcon.svelte';
 import PreviewIcon from '$lib/components/icons/PreviewIcon.svelte';
 import CheckIcon from '$lib/components/icons/CheckIcon.svelte';

 type Step = 'type' | 'form' | 'preview' | 'success';

 let currentStep = $state<Step>('type');
 let selectedType = $state<ApplicationType | undefined>(undefined);
 let title = $state('');
 let content = $state<ApplicationContent | undefined>(undefined);
 let formRef = $state<HTMLElement | null>(null);
 let editTarget = $state<string | null>(null);
 let showConfirmDialog = $state(false);

 // 默认内容
 function getDefaultContent(type: ApplicationType): ApplicationContent {
  switch (type) {
   case 'overtime':
    return {startDate: '', endDate: '', hours: 0, reason: ''} satisfies OvertimeContent;
   case 'travel':
    return {destination: '', startDate: '', endDate: '', budget: 0, purpose: ''} satisfies TravelContent;
   case 'procurement':
    return {items: [], totalBudget: 0, purpose: ''} satisfies ProcurementContent;
  }
 }

 function selectType(type: ApplicationType) {
  selectedType = type;
  content = getDefaultContent(type);
  title = '';
 }

 function goToForm() {
  if (!selectedType || !content) return;
  currentStep = 'form';
  editTarget = null;
 }

 function goToPreview() {
  if (!title.trim() || !content) return;
  currentStep = 'preview';
  editTarget = null;
 }

 function handleEdit(field: string) {
  editTarget = field;
  currentStep = 'form';
  // 滚动到对应区域
  setTimeout(() => {
   const el = document.getElementById(`section-${field}`);
   el?.scrollIntoView({behavior: 'smooth'});
  }, 100);
 }

 function handleSubmit() {
  if (!selectedType || !content || !title.trim()) return;
  applicationStore.create({
   type: selectedType,
   title: title.trim(),
   content,
   applicantId: currentUser.id
  });
  currentStep = 'success';
 }

 function handleSaveDraft() {
  if (!selectedType || !content || !title.trim()) return;
  const app = applicationStore.create({
   type: selectedType,
   title: title.trim(),
   content,
   applicantId: currentUser.id
  });
  goto(`/applications/${app.id}`);
 }

 function reset() {
  currentStep = 'type';
  selectedType = undefined;
  title = '';
  content = undefined;
  editTarget = null;
 }

 let stepIndex = $derived(
  currentStep === 'type' ? 1 : currentStep === 'form' ? 2 : currentStep === 'preview' ? 3 : 4
 );

 const steps = [
  {label: '选择类型', shortLabel: '', icon: TypeIcon},
  {label: '填写表单', shortLabel: '', icon: FormIcon},
  {label: '预览确认', shortLabel: '', icon: PreviewIcon},
  {label: '完成', shortLabel: '', icon: CheckIcon}
 ];
</script>
<svelte:head>
	<title>发起申请 - 申请管理系统</title>
</svelte:head>
<div class="mx-auto bg-white p-6 space-y-8">
	<!-- 页面标题 -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">发起申请</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">创建新的申请并提交审批</p>
	</div>
	<!-- 步骤指示器 -->
	<Stepper {steps} current={stepIndex} clickable={false} classes={{content: 'whitespace-nowrap'}}/>
	<!-- 步骤内容 -->
	{#if currentStep === 'type'}
		<!-- 步骤1：选择申请类型 -->
		<div>
			<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">请选择申请类型</h2>
			<TypeSelector selected={selectedType} onselect={selectType}/>
			<div class="mt-6 flex justify-end">
				<Button color="blue" disabled={!selectedType} onclick={goToForm}>下一步</Button>
			</div>
		</div>
	{:else if currentStep === 'form'}
		<!-- 步骤2：填写表单 -->
		<div bind:this={formRef} class="space-y-6">
			<!-- 申请人信息 -->
			<form id="section-applicant" class="w-full bg-white rounded-lg shadow-lg p-6">
				<ApplicantInfoForm user={currentUser}/>
			</form>
			<!-- 申请标题 -->
			<form id="section-title" class="w-full bg-white rounded-lg shadow-lg p-6">
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">申请标题</h3>
					<Label for="app-title">标题</Label>
					<Input
					 id="app-title"
					 bind:value={title}
					 placeholder="请输入申请标题"
					/>
				</div>
			</form>
			<!-- 申请内容 -->
			<form id="section-content" class="w-full bg-white rounded-lg shadow-lg p-6">
				{#if selectedType === 'overtime' && content}
					<OvertimeForm
					 content={content as OvertimeContent}
					 onchange={(c) => content = c}
					/>
				{:else if selectedType === 'travel' && content}
					<TravelForm
					 content={content as TravelContent}
					 onchange={(c) => content = c}
					/>
				{:else if selectedType === 'procurement' && content}
					<ProcurementForm
					 content={content as ProcurementContent}
					 onchange={(c) => content = c}
					/>
				{/if}
			</form>
			<div class="flex justify-between">
				<Button color="alternative" onclick={() => currentStep = 'type'}>上一步</Button>
				<div class="flex gap-3">
					<Button color="dark" onclick={handleSaveDraft} disabled={!title.trim()}>保存草稿</Button>
					<Button color="green" onclick={() => showConfirmDialog = true} disabled={!title.trim()}>提交申请</Button>
					<Button color="blue" onclick={goToPreview} disabled={!title.trim()}>预览</Button>
				</div>
			</div>
		</div>
		<!-- 提交确认弹窗 -->
		{#if showConfirmDialog}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<Card class="w-full max-w-md">
					<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">确认提交申请</h3>
					<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
						确定要提交「{title}」吗？提交后将进入审批流程。
					</p>
					<div class="flex justify-end gap-3">
						<Button color="alternative" onclick={() => showConfirmDialog = false}>取消</Button>
						<Button color="blue" onclick={() => { showConfirmDialog = false; handleSubmit(); }}>确认提交</Button>
					</div>
				</Card>
			</div>
		{/if}
	{:else if currentStep === 'preview'}
		<!-- 步骤3：预览确认 -->
		<div class="space-y-6">
			<Card>
				<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">请确认申请信息</h2>
				<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
					请仔细核对以下信息，如有错误请点击对应区域的"修改"按钮进行更正。
				</p>
			</Card>
			{#if selectedType && content}
				<ApplicationPreview
				 user={currentUser}
				 type={selectedType}
				 {title}
				 {content}
				 onedit={handleEdit}
				/>
			{/if}
			<!-- 操作按钮 -->
			<div class="flex justify-between">
				<Button color="alternative" onclick={() => currentStep = 'form'}>返回修改</Button>
				<Button color="blue" onclick={handleSubmit}>确认提交</Button>
			</div>
		</div>
	{:else if currentStep === 'success'}
		<!-- 步骤4：提交成功 -->
		<Card class="text-center">
			<div class="py-8">
				<div class="mb-4 text-6xl text-green-500">&#10003;</div>
				<h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">申请提交成功！</h2>
				<p class="mb-8 text-gray-600 dark:text-gray-400">
					您的申请已成功提交，等待审批中。
				</p>
				<div class="flex justify-center gap-4">
					<Button color="blue" onclick={() => goto('/applications/my')}>查看我的申请</Button>
					<Button color="alternative" onclick={reset}>继续申请</Button>
				</div>
			</div>
		</Card>
	{/if}
</div>
