import type { Department, User, Application } from '$lib/types/application';

// 部门数据
export const departments: Department[] = [
	{ id: 'dept-1', name: '技术部' },
	{ id: 'dept-2', name: '市场部' },
	{ id: 'dept-3', name: '行政部' }
];

// 用户数据
export const users: User[] = [
	{ id: 'user-1', name: '张三', email: 'zhangsan@example.com', departmentId: 'dept-1', role: 'admin' },
	{ id: 'user-2', name: '李四', email: 'lisi@example.com', departmentId: 'dept-1', role: 'manager' },
	{ id: 'user-3', name: '王五', email: 'wangwu@example.com', departmentId: 'dept-1', role: 'employee' },
	{ id: 'user-4', name: '赵六', email: 'zhaoliu@example.com', departmentId: 'dept-2', role: 'manager' },
	{ id: 'user-5', name: '钱七', email: 'qianqi@example.com', departmentId: 'dept-2', role: 'employee' },
	{ id: 'user-6', name: '孙八', email: 'sunba@example.com', departmentId: 'dept-3', role: 'manager' },
	{ id: 'user-7', name: '周九', email: 'zhoujiu@example.com', departmentId: 'dept-3', role: 'employee' }
];

// 当前登录用户（模拟）
export const currentUser: User = users[0];

// 申请记录 Mock 数据
export const applications: Application[] = [
	{
		id: 'app-1',
		applicantId: 'user-3',
		type: 'overtime',
		status: 'approved',
		title: '周末加班 - 项目上线',
		content: {
			startDate: '2026-08-01',
			endDate: '2026-08-02',
			hours: 16,
			reason: '项目紧急上线，需要完成最终测试和部署'
		},
		createdAt: '2026-07-28T10:00:00Z',
		updatedAt: '2026-07-29T09:00:00Z',
		approverId: 'user-2',
		approveComment: '同意，项目确实紧急',
		approveAt: '2026-07-29T09:00:00Z'
	},
	{
		id: 'app-2',
		applicantId: 'user-5',
		type: 'travel',
		status: 'pending',
		title: '上海客户拜访',
		content: {
			destination: '上海',
			startDate: '2026-08-20',
			endDate: '2026-08-22',
			budget: 5000,
			purpose: '拜访重要客户，洽谈下半年合作方案'
		},
		createdAt: '2026-08-10T14:00:00Z',
		updatedAt: '2026-08-10T14:00:00Z'
	},
	{
		id: 'app-3',
		applicantId: 'user-7',
		type: 'procurement',
		status: 'approved',
		title: '办公用品采购',
		content: {
			items: [
				{ name: 'A4打印纸', quantity: 50, unitPrice: 25 },
				{ name: '签字笔', quantity: 100, unitPrice: 3 },
				{ name: '文件夹', quantity: 30, unitPrice: 8 }
			],
			totalBudget: 1790,
			purpose: '季度办公用品补充采购'
		},
		createdAt: '2026-08-05T09:00:00Z',
		updatedAt: '2026-08-06T11:00:00Z',
		approverId: 'user-6',
		approveComment: '批准采购',
		approveAt: '2026-08-06T11:00:00Z'
	},
	{
		id: 'app-4',
		applicantId: 'user-3',
		type: 'overtime',
		status: 'rejected',
		title: '工作日延时加班',
		content: {
			startDate: '2026-08-10',
			endDate: '2026-08-14',
			hours: 20,
			reason: '完成新功能开发'
		},
		createdAt: '2026-08-08T16:00:00Z',
		updatedAt: '2026-08-09T10:00:00Z',
		approverId: 'user-2',
		approveComment: '工时过长，请合理安排工作量',
		approveAt: '2026-08-09T10:00:00Z'
	},
	{
		id: 'app-5',
		applicantId: 'user-5',
		type: 'travel',
		status: 'draft',
		title: '北京展会参展',
		content: {
			destination: '北京',
			startDate: '2026-09-01',
			endDate: '2026-09-03',
			budget: 8000,
			purpose: '参加行业展会，展示新产品'
		},
		createdAt: '2026-08-12T11:00:00Z',
		updatedAt: '2026-08-12T11:00:00Z'
	},
	{
		id: 'app-6',
		applicantId: 'user-1',
		type: 'procurement',
		status: 'pending',
		title: '开发设备采购',
		content: {
			items: [
				{ name: 'MacBook Pro 14寸', quantity: 2, unitPrice: 16999 },
				{ name: '4K显示器', quantity: 2, unitPrice: 3500 }
			],
			totalBudget: 40998,
			purpose: '新入职开发人员设备配置'
		},
		createdAt: '2026-08-13T09:30:00Z',
		updatedAt: '2026-08-13T09:30:00Z'
	},
	{
		id: 'app-7',
		applicantId: 'user-7',
		type: 'overtime',
		status: 'cancelled',
		title: '月末结算加班',
		content: {
			startDate: '2026-08-30',
			endDate: '2026-08-31',
			hours: 12,
			reason: '月末财务结算协助'
		},
		createdAt: '2026-08-11T08:00:00Z',
		updatedAt: '2026-08-12T15:00:00Z'
	},
	{
		id: 'app-8',
		applicantId: 'user-3',
		type: 'travel',
		status: 'approved',
		title: '深圳技术交流',
		content: {
			destination: '深圳',
			startDate: '2026-07-15',
			endDate: '2026-07-17',
			budget: 4500,
			purpose: '参加技术交流会，学习行业前沿技术'
		},
		createdAt: '2026-07-10T10:00:00Z',
		updatedAt: '2026-07-11T14:00:00Z',
		approverId: 'user-2',
		approveComment: '同意出差',
		approveAt: '2026-07-11T14:00:00Z'
	},
	{
		id: 'app-9',
		applicantId: 'user-1',
		type: 'overtime',
		status: 'pending',
		title: '系统维护加班',
		content: {
			startDate: '2026-08-16',
			endDate: '2026-08-16',
			hours: 8,
			reason: '周末系统升级维护'
		},
		createdAt: '2026-08-14T17:00:00Z',
		updatedAt: '2026-08-14T17:00:00Z'
	},
	{
		id: 'app-10',
		applicantId: 'user-5',
		type: 'procurement',
		status: 'rejected',
		title: '营销物料采购',
		content: {
			items: [
				{ name: '宣传册', quantity: 1000, unitPrice: 5 },
				{ name: '易拉宝', quantity: 10, unitPrice: 150 }
			],
			totalBudget: 6500,
			purpose: '下半年营销活动物料准备'
		},
		createdAt: '2026-08-01T13:00:00Z',
		updatedAt: '2026-08-02T09:00:00Z',
		approverId: 'user-4',
		approveComment: '预算超出季度限额，请分批申请',
		approveAt: '2026-08-02T09:00:00Z'
	},
	{
		id: 'app-11',
		applicantId: 'user-1',
		type: 'travel',
		status: 'draft',
		title: '杭州团队团建',
		content: {
			destination: '杭州',
			startDate: '2026-09-10',
			endDate: '2026-09-11',
			budget: 3000,
			purpose: '部门团队建设活动'
		},
		createdAt: '2026-08-14T16:00:00Z',
		updatedAt: '2026-08-14T16:00:00Z'
	},
	{
		id: 'app-12',
		applicantId: 'user-7',
		type: 'procurement',
		status: 'pending',
		title: '会议室设备升级',
		content: {
			items: [
				{ name: '投影仪', quantity: 1, unitPrice: 8000 },
				{ name: '无线投屏器', quantity: 2, unitPrice: 500 }
			],
			totalBudget: 9000,
			purpose: '会议室设备老化，需要升级'
		},
		createdAt: '2026-08-13T14:00:00Z',
		updatedAt: '2026-08-13T14:00:00Z'
	}
];

// 辅助函数：根据 ID 获取用户
export function getUserById(id: string): User | undefined {
	return users.find((u) => u.id === id);
}

// 辅助函数：根据 ID 获取部门
export function getDepartmentById(id: string): Department | undefined {
	return departments.find((d) => d.id === id);
}

// 辅助函数：获取用户名
export function getUserName(id: string): string {
	return getUserById(id)?.name ?? '未知';
}

// 辅助函数：获取部门名
export function getDepartmentName(id: string): string {
	return getDepartmentById(id)?.name ?? '未知';
}
