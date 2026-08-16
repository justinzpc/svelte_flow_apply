import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup, getByDisplayValue } from '@testing-library/svelte';
import { tick } from 'svelte';
import Page from '../../src/routes/apply/+page.svelte';
import { goto } from '$app/navigation';
import { applicationStore } from '$lib/services/applicationStore.svelte';

describe('发起申请页面', () => {
	beforeEach(() => {
		cleanup();
		vi.mocked(goto).mockClear();
	});

	// ========== 步骤1：选择类型 ==========

	describe('步骤1 - 选择申请类型', () => {
		it('渲染页面标题和描述', () => {
			const { getByText } = render(Page);
			expect(getByText('发起申请')).toBeInTheDocument();
			expect(getByText('创建新的申请并提交审批')).toBeInTheDocument();
		});

		it('显示"请选择申请类型"提示', () => {
			const { getByText } = render(Page);
			expect(getByText('请选择申请类型')).toBeInTheDocument();
		});

		it('初始状态下"下一步"按钮被禁用', () => {
			const { getByText, container } = render(Page);
			const btn = getByText('下一步').closest('button')!;
			expect(btn).toBeDisabled();
		});

		it('选择类型后"下一步"按钮启用', async () => {
			const { getByText, container } = render(Page);
			// 点击第一个类型卡片（加班申请 ⏰）
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();

			const nextBtn = getByText('下一步').closest('button')!;
			expect(nextBtn).not.toBeDisabled();
		});

		it('点击"下一步"进入表单步骤', async () => {
			const { getByText, container } = render(Page);
			// 选择类型
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();

			// 点击下一步
			const nextBtn = getByText('下一步').closest('button')!;
			await fireEvent.click(nextBtn);
			await tick();

			// 验证进入表单步骤
			expect(getByText('申请标题')).toBeInTheDocument();
			expect(getByText('申请人信息')).toBeInTheDocument();
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
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			// 验证申请人信息展示（Input 组件的 value 需要通过 displayValue 查询）
			const nameInput = container.querySelector('#applicant-name') as HTMLInputElement;
			expect(nameInput.value).toBe('张三');
			const emailInput = container.querySelector('#applicant-email') as HTMLInputElement;
			expect(emailInput.value).toBe('zhangsan@example.com');
		});

		it('未填写标题时操作按钮被禁用', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			expect(getByText('保存草稿').closest('button')).toBeDisabled();
			expect(getByText('提交申请').closest('button')).toBeDisabled();
			expect(getByText('预览').closest('button')).toBeDisabled();
		});

		it('填写标题后操作按钮启用', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			// 填写标题
			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '测试申请' } });
			await tick();

			expect(getByText('保存草稿').closest('button')).not.toBeDisabled();
			expect(getByText('提交申请').closest('button')).not.toBeDisabled();
			expect(getByText('预览').closest('button')).not.toBeDisabled();
		});

		it('点击"上一步"返回类型选择', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			// 点击上一步
			await fireEvent.click(getByText('上一步').closest('button')!);
			await tick();

			expect(getByText('请选择申请类型')).toBeInTheDocument();
		});

		it('点击"预览"进入预览步骤', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '测试预览' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			expect(getByText('请确认申请信息')).toBeInTheDocument();
		});
	});

	// ========== 步骤2：提交申请确认弹窗 ==========

	describe('提交申请确认弹窗', () => {
		it('点击"提交申请"弹出确认弹窗', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '测试弹窗' } });
			await tick();

			await fireEvent.click(getByText('提交申请').closest('button')!);
			await tick();

			expect(getByText('确认提交申请')).toBeInTheDocument();
			expect(getByText(/确定要提交「测试弹窗」吗/)).toBeInTheDocument();
		});

		it('确认弹窗中点击"取消"关闭弹窗', async () => {
			const { container, getByText, queryByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '取消测试' } });
			await tick();

			await fireEvent.click(getByText('提交申请').closest('button')!);
			await tick();
			expect(getByText('确认提交申请')).toBeInTheDocument();

			// 点击取消
			await fireEvent.click(getByText('取消').closest('button')!);
			await tick();

			expect(queryByText('确认提交申请')).not.toBeInTheDocument();
		});

		it('确认弹窗中点击"确认提交"完成提交', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '确认提交测试' } });
			await tick();

			await fireEvent.click(getByText('提交申请').closest('button')!);
			await tick();

			// 点击确认提交
			const confirmBtns = getByText('确认提交').closest('button')!;
			await fireEvent.click(confirmBtns);
			await tick();

			expect(getByText('申请提交成功！')).toBeInTheDocument();
		});
	});

	// ========== 步骤2：保存草稿 ==========

	describe('保存草稿', () => {
		it('保存草稿后跳转到申请详情页', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '草稿测试' } });
			await tick();

			await fireEvent.click(getByText('保存草稿').closest('button')!);
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
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '预览标题' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			expect(getByText('请确认申请信息')).toBeInTheDocument();
			expect(
				getByText('请仔细核对以下信息，如有错误请点击对应区域的"修改"按钮进行更正。')
			).toBeInTheDocument();
		});

		it('点击"返回修改"回到表单步骤', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '返回修改测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			await fireEvent.click(getByText('返回修改').closest('button')!);
			await tick();

			// 回到表单步骤
			expect(container.querySelector('#app-title')).toBeInTheDocument();
		});

		it('点击"确认提交"直接完成提交', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '预览提交测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			// 在预览步骤点击确认提交
			const submitBtn = getByText('确认提交').closest('button')!;
			await fireEvent.click(submitBtn);
			await tick();

			expect(getByText('申请提交成功！')).toBeInTheDocument();
		});
	});

	// ========== 从预览步骤点击修改跳转 ==========

	describe('预览步骤修改跳转', () => {
		it('点击申请人"修改"跳转到表单并滚动', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '修改跳转测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			// ApplicationPreview 中有多个"修改"按钮，第一个对应申请人信息
			const editButtons = container.querySelectorAll('button');
			const editBtn = Array.from(editButtons).find(
				(b) => b.textContent?.trim() === '修改'
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
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '成功测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();
			await fireEvent.click(getByText('确认提交').closest('button')!);
			await tick();

			expect(getByText('申请提交成功！')).toBeInTheDocument();
			expect(getByText('您的申请已成功提交，等待审批中。')).toBeInTheDocument();
		});

		it('显示"查看我的申请"和"继续申请"按钮', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '按钮测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();
			await fireEvent.click(getByText('确认提交').closest('button')!);
			await tick();

			expect(getByText('查看我的申请')).toBeInTheDocument();
			expect(getByText('继续申请')).toBeInTheDocument();
		});

		it('点击"查看我的申请"跳转到我的申请页面', async () => {
			const { container, getByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '跳转测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();
			await fireEvent.click(getByText('确认提交').closest('button')!);
			await tick();

			await fireEvent.click(getByText('查看我的申请').closest('button')!);
			await tick();

			expect(vi.mocked(goto)).toHaveBeenCalledWith('/applications/my');
		});

		it('点击"继续申请"重置到初始状态', async () => {
			const { container, getByText, queryByText } = render(Page);
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[0]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '重置测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();
			await fireEvent.click(getByText('确认提交').closest('button')!);
			await tick();

			// 点击继续申请
			await fireEvent.click(getByText('继续申请').closest('button')!);
			await tick();

			// 验证重置到步骤1
			expect(getByText('请选择申请类型')).toBeInTheDocument();
			// "下一步"按钮应重新变为禁用状态
			const nextBtn = getByText('下一步').closest('button')!;
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
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: 'Store测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();
			await fireEvent.click(getByText('确认提交').closest('button')!);
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
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			// 差旅表单应显示目的地字段
			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '差旅测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			expect(getByText('请确认申请信息')).toBeInTheDocument();
		});

		it('选择采购类型后表单正确渲染', async () => {
			const { container, getByText } = render(Page);
			// 点击第三个类型卡片（采购申请 🛒）
			const typeButtons = container.querySelectorAll('[role="button"]');
			await fireEvent.click(typeButtons[2]);
			await tick();
			await fireEvent.click(getByText('下一步').closest('button')!);
			await tick();

			const input = container.querySelector('#app-title') as HTMLInputElement;
			await fireEvent.input(input, { target: { value: '采购测试' } });
			await tick();

			await fireEvent.click(getByText('预览').closest('button')!);
			await tick();

			expect(getByText('请确认申请信息')).toBeInTheDocument();
		});
	});
});
