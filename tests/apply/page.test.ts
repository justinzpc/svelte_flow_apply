import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup, getByDisplayValue } from '@testing-library/svelte';
import { tick } from 'svelte';
import Page from '../../src/routes/apply/+page.svelte';
import { goto } from '$app/navigation';
import { applicationStore } from '$lib/services/applicationStore.svelte';
import { setLocale, t, initLocale } from '$lib/i18n/index.svelte';

describe('发起申请页面', () => {
	beforeEach(() => {
		cleanup();
		vi.mocked(goto).mockClear();
		setLocale('zh');
	});

	// ========== 步骤1：选择类型 ==========

	describe('步骤1 - 选择申请类型', () => {
		it('渲染页面标题和描述', () => {
			const { getByText } = render(Page);
			expect(getByText(t('apply.title'))).toBeInTheDocument();
			expect(getByText(t('apply.subtitle'))).toBeInTheDocument();
		});

		it('显示"请选择申请类型"提示', () => {
			const { getByText } = render(Page);
			expect(getByText(t('apply.selectType'))).toBeInTheDocument();
		});

		it('初始状态下"下一步"按钮被禁用', () => {
			const { getByText, container } = render(Page);
			const btn = getByText(t('apply.next')).closest('button')!;
			expect(btn).toBeDisabled();
		});

		it('选择类型后"下一步"按钮启用', async () => {
			const { getByText, container } = render(Page);
			// 点击第一个类型卡片（加班申请 ⏰）
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();

			const nextBtn = getByText(t('apply.next')).closest('button')!;
			expect(nextBtn).not.toBeDisabled();
		});

		it('点击"下一步"进入表单步骤', async () => {
			const { getByText, container } = render(Page);
			// 选择类型
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();

			// 点击下一步
			const nextBtn = getByText(t('apply.next')).closest('button')!;
			await fireEvent.click(nextBtn);
			await tick();

			// 验证进入表单步骤
			expect(getByText(t('apply.appTitle'))).toBeInTheDocument();
			expect(getByText(t('form.applicantInfo'))).toBeInTheDocument();
		});
	});

	// ========== 步骤2：填写表单 ==========

	describe('步骤2 - 填写表单', () => {
		it('显示申请人信息', async () => {
			const { container, getByText } = render(Page);
			// 进入表单步骤
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			// 验证申请人信息展示（Input 组件的 value 需要通过 displayValue 查询）
			const nameInput = container.querySelector('#applicant-name') as HTMLInputElement;
			expect(nameInput.value).toBe('John Smith');
			const emailInput = container.querySelector('#applicant-email') as HTMLInputElement;
			expect(emailInput.value).toBe('john.smith@example.com');
		});

		it('未填写标题时操作按钮被禁用', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			expect(getByText(t('apply.saveDraft')).closest('button')).toBeDisabled();
			expect(getByText(t('apply.submitApplication')).closest('button')).toBeDisabled();
			expect(getByText(t('apply.preview')).closest('button')).toBeDisabled();
		});

		it('填写标题后操作按钮启用', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			// 填写标题
			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '测试申请' } });
			await tick();

			expect(getByText(t('apply.saveDraft')).closest('button')).not.toBeDisabled();
			expect(getByText(t('apply.submitApplication')).closest('button')).not.toBeDisabled();
			expect(getByText(t('apply.preview')).closest('button')).not.toBeDisabled();
		});

		it('点击"上一步"返回类型选择', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			// 点击上一步
			await fireEvent.click(getByText(t('apply.prev')).closest('button')!);
			await tick();

			expect(getByText(t('apply.selectType'))).toBeInTheDocument();
		});

		it('点击"预览"进入预览步骤', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '测试预览' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			expect(getByText(t('apply.previewTitle'))).toBeInTheDocument();
		});
	});

	// ========== 步骤2：提交申请确认弹窗 ==========

	describe('提交申请确认弹窗', () => {
		it('点击"提交申请"弹出确认弹窗', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '测试弹窗' } });
			await tick();

			await fireEvent.click(getByText(t('apply.submitApplication')).closest('button')!);
			await tick();

			expect(getByText(t('apply.confirmTitle'))).toBeInTheDocument();
			expect(getByText(/确定要提交「测试弹窗」吗|Are you sure you want to submit "测试弹窗"/)).toBeInTheDocument();
		});

		it('确认弹窗中点击"取消"关闭弹窗', async () => {
			const { container, getByText, queryByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '取消测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.submitApplication')).closest('button')!);
			await tick();
			expect(getByText(t('apply.confirmTitle'))).toBeInTheDocument();

			// 点击取消
			await fireEvent.click(getByText(t('common.cancel')).closest('button')!);
			await tick();

			expect(queryByText(t('apply.confirmTitle'))).not.toBeInTheDocument();
		});

		it('确认弹窗中点击"确认提交"完成提交', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '确认提交测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.submitApplication')).closest('button')!);
			await tick();

			// 点击确认提交
			const confirmBtns = getByText(t('apply.confirmSubmit')).closest('button')!;
			await fireEvent.click(confirmBtns);
			await tick();

			expect(getByText(t('apply.successTitle'))).toBeInTheDocument();
		});
	});

	// ========== 步骤2：保存草稿 ==========

	describe('保存草稿', () => {
		it('保存草稿后跳转到申请详情页', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '草稿测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.saveDraft')).closest('button')!);
			await tick();

			expect(vi.mocked(goto)).toHaveBeenCalledTimes(1);
			expect(vi.mocked(goto).mock.calls[0][0]).toMatch(/^\/applications\/app-/);
		});
	});

	// ========== 步骤3：预览确认 ==========

	describe('步骤3 - 预览确认', () => {
		it('显示"请确认申请信息"标题', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '预览标题' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			expect(getByText(t('apply.previewTitle'))).toBeInTheDocument();
			expect(getByText(t('apply.previewSubtitle'))).toBeInTheDocument();
		});

		it('点击"返回修改"回到表单步骤', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '返回修改测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			await fireEvent.click(getByText(t('apply.backToEdit')).closest('button')!);
			await tick();

			// 回到表单步骤
			expect(container.querySelector('#app-title')).toBeInTheDocument();
		});

		it('点击"确认提交"直接完成提交', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '预览提交测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			// 在预览步骤点击确认提交
			const submitBtn = getByText(t('apply.confirmSubmit')).closest('button')!;
			await fireEvent.click(submitBtn);
			await tick();

			expect(getByText(t('apply.successTitle'))).toBeInTheDocument();
		});
	});

	// ========== 从预览步骤点击修改跳转 ==========

	describe('预览步骤修改跳转', () => {
		it('点击申请人"修改"跳转到表单并滚动', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '修改跳转测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			// ApplicationPreview 中有多个"修改"按钮
			const editButtons = container.querySelectorAll('button');
			const editBtn = Array.from(editButtons).find(
				(b) => b.textContent?.trim() === t('preview.edit')
			);
			expect(editBtn).toBeTruthy();
			await fireEvent.click(editBtn!);
			await tick();

			// 回到表单步骤
			expect(container.querySelector('#app-title')).toBeInTheDocument();
		});
	});

	// ========== 步骤4：提交成功 ==========

	describe('步骤4 - 提交成功', () => {
		it('显示成功图标和文字', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '成功测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();
			await fireEvent.click(getByText(t('apply.confirmSubmit')).closest('button')!);
			await tick();

			expect(getByText(t('apply.successTitle'))).toBeInTheDocument();
			expect(getByText(t('apply.successMessage'))).toBeInTheDocument();
		});

		it('显示"查看我的申请"和"继续申请"按钮', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '按钮测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();
			await fireEvent.click(getByText(t('apply.confirmSubmit')).closest('button')!);
			await tick();

			expect(getByText(t('apply.viewMyApplications'))).toBeInTheDocument();
			expect(getByText(t('apply.continueApply'))).toBeInTheDocument();
		});

		it('点击"查看我的申请"跳转到我的申请页面', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '跳转测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();
			await fireEvent.click(getByText(t('apply.confirmSubmit')).closest('button')!);
			await tick();

			await fireEvent.click(getByText(t('apply.viewMyApplications')).closest('button')!);
			await tick();

			expect(vi.mocked(goto)).toHaveBeenCalledWith('/applications/my');
		});

		it('点击"继续申请"重置到初始状态', async () => {
			const { container, getByText, queryByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '重置测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();
			await fireEvent.click(getByText(t('apply.confirmSubmit')).closest('button')!);
			await tick();

			// 点击继续申请
			await fireEvent.click(getByText(t('apply.continueApply')).closest('button')!);
			await tick();

			// 验证重置到步骤1
			expect(getByText(t('apply.selectType'))).toBeInTheDocument();
			// "下一步"按钮应重新变为禁用状态
			const nextBtn = getByText(t('apply.next')).closest('button')!;
			expect(nextBtn).toBeDisabled();
		});
	});

	// ========== 申请 Store 验证 ==========

	describe('申请 Store', () => {
		it('提交后申请记录保存到 store', async () => {
			const initialCount = applicationStore.getAll().length;
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: 'Store测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();
			await fireEvent.click(getByText(t('apply.confirmSubmit')).closest('button')!);
			await tick();

			expect(applicationStore.getAll().length).toBe(initialCount + 1);
			const latestApp = applicationStore.getAll().at(-1)!;
			expect(latestApp.title).toBe('Store测试');
			expect(latestApp.type).toBe('overtime');
			expect(latestApp.status).toBe('draft');
		});
	});

	// ========== 不同类型选择测试 ==========

	describe('不同申请类型', () => {
		it('选择差旅类型后表单正确渲染', async () => {
			const { container, getByText } = render(Page);
			// 点击第二个类型卡片（差旅申请 ✈️）
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[1]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			// 差旅表单应显示目的地字段
			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '差旅测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			expect(getByText(t('apply.previewTitle'))).toBeInTheDocument();
		});

		it('选择采购类型后表单正确渲染', async () => {
			const { container, getByText } = render(Page);
			// 点击第三个类型卡片（采购申请 🛒）
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[2]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '采购测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			expect(getByText(t('apply.previewTitle'))).toBeInTheDocument();
		});
	});

	// ========== 多语言 buttonText 测试 ==========

	describe('多语言 buttonText', () => {
		afterEach(() => {
			setLocale('en');
		});

		it('中文环境下显示中文 buttonText', async () => {
			setLocale('zh');
			const { getByText, container } = render(Page);

			expect(getByText(t('apply.title'))).toBeInTheDocument();
			expect(getByText(t('apply.next'))).toBeInTheDocument();

			// 选择类型后进入表单
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			expect(getByText(t('apply.prev'))).toBeInTheDocument();
			expect(getByText(t('apply.saveDraft'))).toBeInTheDocument();
			expect(getByText(t('apply.submitApplication'))).toBeInTheDocument();
			expect(getByText(t('apply.preview'))).toBeInTheDocument();

			// 填写标题后进入预览
			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '中文测试' } });
			await tick();

			await fireEvent.click(getByText(t('apply.preview')).closest('button')!);
			await tick();

			expect(getByText(t('apply.backToEdit'))).toBeInTheDocument();
			expect(getByText(t('apply.confirmSubmit'))).toBeInTheDocument();
		});

		it('英文环境下显示英文 buttonText', async () => {
			setLocale('en');
			const { getByText, getByRole, container } = render(Page);

			expect(getByText(t('apply.title'))).toBeInTheDocument();
			expect(getByText(t('apply.next'))).toBeInTheDocument();

			// 选择类型后进入表单
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText(t('apply.next')).closest('button')!);
			await tick();

			expect(getByText(t('apply.prev'))).toBeInTheDocument();
			expect(getByText(t('apply.saveDraft'))).toBeInTheDocument();
			expect(getByText(t('apply.submitApplication'))).toBeInTheDocument();
			// 英文环境下 Stepper 步骤标签与按钮文本相同，使用 getByRole 精确定位按钮
			expect(getByRole('button', { name: t('apply.preview') })).toBeInTheDocument();

			// 填写标题后进入预览
			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: 'English test' } });
			await tick();

			await fireEvent.click(getByRole('button', { name: t('apply.preview') }));
			await tick();

			expect(getByText(t('apply.backToEdit'))).toBeInTheDocument();
			expect(getByText(t('apply.confirmSubmit'))).toBeInTheDocument();
		});

		it('切换语言后 buttonText 随之变化', async () => {
			// 先设中文
			setLocale('zh');
			const { getByText, container } = render(Page);

			expect(getByText('下一步')).toBeInTheDocument();

			// 切换为英文
			setLocale('en');
			await tick();

			expect(getByText('Next')).toBeInTheDocument();
		});
	});
});
