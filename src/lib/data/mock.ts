import type { Department, User, Application } from '$lib/types/application';

// Department data
export const departments: Department[] = [
	{ id: 'dept-1', name: 'Engineering' },
	{ id: 'dept-2', name: 'Marketing' },
	{ id: 'dept-3', name: 'Administration' }
];

// User data
export const users: User[] = [
	{ id: 'user-1', name: 'John Smith', email: 'john.smith@example.com', departmentId: 'dept-1', role: 'admin' },
	{ id: 'user-2', name: 'David Wilson', email: 'david.wilson@example.com', departmentId: 'dept-1', role: 'manager' },
	{ id: 'user-3', name: 'James Brown', email: 'james.brown@example.com', departmentId: 'dept-1', role: 'employee' },
	{ id: 'user-4', name: 'Sarah Davis', email: 'sarah.davis@example.com', departmentId: 'dept-2', role: 'manager' },
	{ id: 'user-5', name: 'Emily Johnson', email: 'emily.johnson@example.com', departmentId: 'dept-2', role: 'employee' },
	{ id: 'user-6', name: 'Michael Taylor', email: 'michael.taylor@example.com', departmentId: 'dept-3', role: 'manager' },
	{ id: 'user-7', name: 'Lisa Anderson', email: 'lisa.anderson@example.com', departmentId: 'dept-3', role: 'employee' }
];

// Current logged-in user (simulated)
export const currentUser: User = users[0];

// Application records Mock data
export const applications: Application[] = [
	{
		id: 'app-1',
		applicantId: 'user-3',
		type: 'overtime',
		status: 'approved',
		title: 'Weekend Overtime - Project Launch',
		content: {
			startDate: '2026-08-01',
			endDate: '2026-08-02',
			hours: 16,
			reason: 'Urgent project launch, need to complete final testing and deployment'
		},
		createdAt: '2026-07-28T10:00:00Z',
		updatedAt: '2026-07-29T09:00:00Z',
		approverId: 'user-2',
		approveComment: 'Approved, the project is indeed urgent',
		approveAt: '2026-07-29T09:00:00Z'
	},
	{
		id: 'app-2',
		applicantId: 'user-5',
		type: 'travel',
		status: 'pending',
		title: 'Shanghai Client Visit',
		content: {
			destination: 'Shanghai',
			startDate: '2026-08-20',
			endDate: '2026-08-22',
			budget: 5000,
			purpose: 'Visit key client to discuss H2 cooperation plan'
		},
		createdAt: '2026-08-10T14:00:00Z',
		updatedAt: '2026-08-10T14:00:00Z'
	},
	{
		id: 'app-3',
		applicantId: 'user-7',
		type: 'procurement',
		status: 'approved',
		title: 'Office Supplies Procurement',
		content: {
			items: [
				{ name: 'A4 Printing Paper', quantity: 50, unitPrice: 25 },
				{ name: 'Ballpoint Pens', quantity: 100, unitPrice: 3 },
				{ name: 'File Folders', quantity: 30, unitPrice: 8 }
			],
			totalBudget: 1790,
			purpose: 'Quarterly office supplies replenishment'
		},
		createdAt: '2026-08-05T09:00:00Z',
		updatedAt: '2026-08-06T11:00:00Z',
		approverId: 'user-6',
		approveComment: 'Procurement approved',
		approveAt: '2026-08-06T11:00:00Z'
	},
	{
		id: 'app-4',
		applicantId: 'user-3',
		type: 'overtime',
		status: 'rejected',
		title: 'Weekday Extended Overtime',
		content: {
			startDate: '2026-08-10',
			endDate: '2026-08-14',
			hours: 20,
			reason: 'Complete new feature development'
		},
		createdAt: '2026-08-08T16:00:00Z',
		updatedAt: '2026-08-09T10:00:00Z',
		approverId: 'user-2',
		approveComment: 'Excessive working hours, please arrange workload reasonably',
		approveAt: '2026-08-09T10:00:00Z'
	},
	{
		id: 'app-5',
		applicantId: 'user-5',
		type: 'travel',
		status: 'draft',
		title: 'Beijing Exhibition',
		content: {
			destination: 'Beijing',
			startDate: '2026-09-01',
			endDate: '2026-09-03',
			budget: 8000,
			purpose: 'Attend industry exhibition to showcase new products'
		},
		createdAt: '2026-08-12T11:00:00Z',
		updatedAt: '2026-08-12T11:00:00Z'
	},
	{
		id: 'app-6',
		applicantId: 'user-1',
		type: 'procurement',
		status: 'pending',
		title: 'Development Equipment Purchase',
		content: {
			items: [
				{ name: 'MacBook Pro 14-inch', quantity: 2, unitPrice: 16999 },
				{ name: '4K Monitor', quantity: 2, unitPrice: 3500 }
			],
			totalBudget: 40998,
			purpose: 'Equipment setup for newly hired developers'
		},
		createdAt: '2026-08-13T09:30:00Z',
		updatedAt: '2026-08-13T09:30:00Z'
	},
	{
		id: 'app-7',
		applicantId: 'user-7',
		type: 'overtime',
		status: 'cancelled',
		title: 'Month-End Settlement Overtime',
		content: {
			startDate: '2026-08-30',
			endDate: '2026-08-31',
			hours: 12,
			reason: 'Assist with month-end financial settlement'
		},
		createdAt: '2026-08-11T08:00:00Z',
		updatedAt: '2026-08-12T15:00:00Z'
	},
	{
		id: 'app-8',
		applicantId: 'user-3',
		type: 'travel',
		status: 'approved',
		title: 'Shenzhen Tech Exchange',
		content: {
			destination: 'Shenzhen',
			startDate: '2026-07-15',
			endDate: '2026-07-17',
			budget: 4500,
			purpose: 'Attend tech conference to learn cutting-edge technologies'
		},
		createdAt: '2026-07-10T10:00:00Z',
		updatedAt: '2026-07-11T14:00:00Z',
		approverId: 'user-2',
		approveComment: 'Business trip approved',
		approveAt: '2026-07-11T14:00:00Z'
	},
	{
		id: 'app-9',
		applicantId: 'user-1',
		type: 'overtime',
		status: 'pending',
		title: 'System Maintenance Overtime',
		content: {
			startDate: '2026-08-16',
			endDate: '2026-08-16',
			hours: 8,
			reason: 'Weekend system upgrade and maintenance'
		},
		createdAt: '2026-08-14T17:00:00Z',
		updatedAt: '2026-08-14T17:00:00Z'
	},
	{
		id: 'app-10',
		applicantId: 'user-5',
		type: 'procurement',
		status: 'rejected',
		title: 'Marketing Materials Procurement',
		content: {
			items: [
				{ name: 'Brochures', quantity: 1000, unitPrice: 5 },
				{ name: 'Roll-up Banners', quantity: 10, unitPrice: 150 }
			],
			totalBudget: 6500,
			purpose: 'Marketing materials preparation for H2 campaigns'
		},
		createdAt: '2026-08-01T13:00:00Z',
		updatedAt: '2026-08-02T09:00:00Z',
		approverId: 'user-4',
		approveComment: 'Budget exceeds quarterly limit, please apply in batches',
		approveAt: '2026-08-02T09:00:00Z'
	},
	{
		id: 'app-11',
		applicantId: 'user-1',
		type: 'travel',
		status: 'draft',
		title: 'Hangzhou Team Building',
		content: {
			destination: 'Hangzhou',
			startDate: '2026-09-10',
			endDate: '2026-09-11',
			budget: 3000,
			purpose: 'Department team building activity'
		},
		createdAt: '2026-08-14T16:00:00Z',
		updatedAt: '2026-08-14T16:00:00Z'
	},
	{
		id: 'app-12',
		applicantId: 'user-7',
		type: 'procurement',
		status: 'pending',
		title: 'Meeting Room Equipment Upgrade',
		content: {
			items: [
				{ name: 'Projector', quantity: 1, unitPrice: 8000 },
				{ name: 'Wireless Screen Sharer', quantity: 2, unitPrice: 500 }
			],
			totalBudget: 9000,
			purpose: 'Meeting room equipment is outdated and needs upgrading'
		},
		createdAt: '2026-08-13T14:00:00Z',
		updatedAt: '2026-08-13T14:00:00Z'
	}
];

// Helper function: get user by ID
export function getUserById(id: string): User | undefined {
	return users.find((u) => u.id === id);
}

// Helper function: get department by ID
export function getDepartmentById(id: string): Department | undefined {
	return departments.find((d) => d.id === id);
}

// Helper function: get user name
export function getUserName(id: string): string {
	return getUserById(id)?.name ?? 'Unknown';
}

// Helper function: get department name
export function getDepartmentName(id: string): string {
	return getDepartmentById(id)?.name ?? 'Unknown';
}
