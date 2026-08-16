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
 import {t} from '$lib/i18n/index.svelte';

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

 const steps = $derived([
  {label: t('apply.step.type'), shortLabel: '', icon: TypeIcon},
  {label: t('apply.step.form'), shortLabel: '', icon: FormIcon},
  {label: t('apply.step.preview'), shortLabel: '', icon: PreviewIcon},
  {label: t('apply.step.success'), shortLabel: '', icon: CheckIcon}
 ]);
</script>
<svelte:head>
	<title>{t('apply.pageTitle')}</title>
</svelte:head>
<div class="mx-auto bg-white p-6 space-y-8">
	<!-- 页面标题 -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">{t('apply.title')}</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">{t('apply.subtitle')}</p>
	</div>
	<!-- 步骤指示器 -->
	<Stepper {steps} current={stepIndex} clickable={false} classes={{content: 'whitespace-nowrap'}}/>
	<!-- 步骤内容 -->
	{#if currentStep === 'type'}
		<!-- 步骤1：选择申请类型 -->
		<div>
			<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">{t('apply.selectType')}</h2>
			<TypeSelector selected={selectedType} onselect={selectType}/>
			<div class="mt-6 flex justify-end">
				<Button color="blue" disabled={!selectedType} onclick={goToForm}>{t('apply.next')}</Button>
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
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('apply.appTitle')}</h3>
					<Label for="app-title">{t('apply.titleLabel')}</Label>
					<Input
					 id="app-title"
					 bind:value={title}
					 placeholder={t('apply.titlePlaceholder')}
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
				<Button color="alternative" onclick={() => currentStep = 'type'}>{t('apply.prev')}</Button>
				<div class="flex gap-3">
					<Button color="dark" onclick={handleSaveDraft} disabled={!title.trim()}>{t('apply.saveDraft')}</Button>
					<Button color="green" onclick={() => showConfirmDialog = true}
					 disabled={!title.trim()}>{t('apply.submitApplication')}</Button>
					<Button color="blue" onclick={goToPreview} disabled={!title.trim()}>{t('apply.preview')}</Button>
				</div>
			</div>
		</div>
		<!-- 提交确认弹窗 -->
		{#if showConfirmDialog}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<Card class="w-full max-w-md">
					<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('apply.confirmTitle')}</h3>
					<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
						{t('apply.confirmMessage', {title})}
					</p>
					<div class="flex justify-end gap-3">
						<Button color="alternative" onclick={() => showConfirmDialog = false}>{t('common.cancel')}</Button>
						<Button color="blue"
						 onclick={() => { showConfirmDialog = false; handleSubmit(); }}>{t('apply.confirmSubmit')}</Button>
					</div>
				</Card>
			</div>
		{/if}
	{:else if currentStep === 'preview'}
		<!-- 步骤3：预览确认 -->
		<div class="space-y-6">
			<Card>
				<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{t('apply.previewTitle')}</h2>
				<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
					{t('apply.previewSubtitle')}
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
				<Button color="alternative" onclick={() => currentStep = 'form'}>{t('apply.backToEdit')}</Button>
				<Button color="blue" onclick={handleSubmit}>{t('apply.confirmSubmit')}</Button>
			</div>
		</div>
	{:else if currentStep === 'success'}
		<!-- 步骤4：提交成功 -->
		<Card class="text-center">
			<div class="py-8">
				<div class="mb-4 text-6xl text-green-500">&#10003;</div>
				<h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{t('apply.successTitle')}</h2>
				<p class="mb-8 text-gray-600 dark:text-gray-400">
					{t('apply.successMessage')}
				</p>
				<div class="flex justify-center gap-4">
					<Button color="blue" onclick={() => goto('/applications/my')}>{t('apply.viewMyApplications')}</Button>
					<Button color="alternative" onclick={reset}>{t('apply.continueApply')}</Button>
				</div>
			</div>
		</Card>
	{/if}
</div>
