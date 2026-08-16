// 申请类型枚举
export type ApplicationType = 'overtime' | 'travel' | 'procurement';

// 申请状态枚举
export type ApplicationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';

// 用户角色
export type UserRole = 'employee' | 'manager' | 'admin';

// 部门
export interface Department {
	id: string;
	name: string;
}

// 用户
export interface User {
	id: string;
	name: string;
	email: string;
	departmentId: string;
	role: UserRole;
}

// 加班申请内容
export interface OvertimeContent {
	startDate: string;
	endDate: string;
	hours: number;
	reason: string;
}

// 差旅申请内容
export interface TravelContent {
	destination: string;
	startDate: string;
	endDate: string;
	budget: number;
	purpose: string;
}

// 采购申请物品项
export interface ProcurementItem {
	name: string;
	quantity: number;
	unitPrice: number;
}

// 采购申请内容
export interface ProcurementContent {
	items: ProcurementItem[];
	totalBudget: number;
	purpose: string;
}

// 申请内容联合类型
export type ApplicationContent = OvertimeContent | TravelContent | ProcurementContent;

// 申请记录
export interface Application {
	id: string;
	applicantId: string;
	type: ApplicationType;
	status: ApplicationStatus;
	title: string;
	content: ApplicationContent;
	createdAt: string;
	updatedAt: string;
	approverId?: string;
	approveComment?: string;
	approveAt?: string;
}

// 状态转换动作
export interface Action {
	targetStatus: ApplicationStatus;
	label: string;
	color: 'blue' | 'green' | 'red' | 'yellow' | 'alternative' | 'dark' | 'purple';
}

// 申请类型配置
export interface ApplicationTypeConfig {
	value: ApplicationType;
	label: string;
	description: string;
	icon: string;
}

// 状态显示配置
export interface StatusConfig {
	value: ApplicationStatus;
	label: string;
	color: 'blue' | 'green' | 'red' | 'yellow' | 'dark' | 'purple';
}

// 申请类型选项
export const APPLICATION_TYPES: ApplicationTypeConfig[] = [
	{ value: 'overtime', label: '加班申请', description: '申请加班工作，记录加班时长和原因', icon: 'clock' },
	{ value: 'travel', label: '差旅申请', description: '申请出差差旅，包含目的地和预算信息', icon: 'plane' },
	{ value: 'procurement', label: '采购申请', description: '申请物品采购，列出采购清单和用途', icon: 'cart' }
];

// 状态配置
export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
	draft: { value: 'draft', label: '草稿', color: 'dark' },
	pending: { value: 'pending', label: '待审批', color: 'yellow' },
	approved: { value: 'approved', label: '已通过', color: 'green' },
	rejected: { value: 'rejected', label: '已驳回', color: 'red' },
	cancelled: { value: 'cancelled', label: '已取消', color: 'purple' }
};

// 类型根据 content 判断
export function isOvertimeContent(content: ApplicationContent): content is OvertimeContent {
	return 'startDate' in content && 'hours' in content;
}

export function isTravelContent(content: ApplicationContent): content is TravelContent {
	return 'destination' in content && 'budget' in content;
}

export function isProcurementContent(content: ApplicationContent): content is ProcurementContent {
	return 'items' in content && 'totalBudget' in content;
}
