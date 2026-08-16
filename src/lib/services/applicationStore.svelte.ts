import type { Application, ApplicationStatus, ApplicationType, ApplicationContent } from '$lib/types/application';
import { applications as initialApplications, currentUser } from '$lib/data/mock';
import { canTransition } from '$lib/services/stateMachine';

// 使用 Svelte 5 runes 管理申请数据
function createApplicationStore() {
	let applications = $state<Application[]>([...initialApplications]);

	function getAll(): Application[] {
		return applications;
	}

	function getById(id: string): Application | undefined {
		return applications.find((a) => a.id === id);
	}

	function getByApplicant(applicantId: string): Application[] {
		return applications.filter((a) => a.applicantId === applicantId);
	}

	function getByStatus(status: ApplicationStatus): Application[] {
		return applications.filter((a) => a.status === status);
	}

	function getByType(type: ApplicationType): Application[] {
		return applications.filter((a) => a.type === type);
	}

	function getMyApplications(): Application[] {
		return applications.filter((a) => a.applicantId === currentUser.id);
	}

	function create(data: {
		type: ApplicationType;
		title: string;
		content: ApplicationContent;
		applicantId: string;
	}): Application {
		const now = new Date().toISOString();
		const newApp: Application = {
			id: `app-${Date.now()}`,
			applicantId: data.applicantId,
			type: data.type,
			status: 'draft',
			title: data.title,
			content: data.content,
			createdAt: now,
			updatedAt: now
		};
		applications = [...applications, newApp];
		return newApp;
	}

	function updateStatus(id: string, newStatus: ApplicationStatus, approverId?: string, comment?: string): boolean {
		const idx = applications.findIndex((a) => a.id === id);
		if (idx === -1) return false;

		const app = applications[idx];
		if (!canTransition(app.status, newStatus)) return false;

		const now = new Date().toISOString();
		applications[idx] = {
			...app,
			status: newStatus,
			updatedAt: now,
			...(approverId ? { approverId } : {}),
			...(comment !== undefined ? { approveComment: comment } : {}),
			...(approverId ? { approveAt: now } : {})
		};
		return true;
	}

	function submit(id: string): boolean {
		return updateStatus(id, 'pending');
	}

	function approve(id: string, approverId: string, comment: string): boolean {
		return updateStatus(id, 'approved', approverId, comment);
	}

	function reject(id: string, approverId: string, comment: string): boolean {
		return updateStatus(id, 'rejected', approverId, comment);
	}

	function cancel(id: string): boolean {
		return updateStatus(id, 'cancelled');
	}

	// 统计相关
	function countByStatus(): Record<ApplicationStatus, number> {
		const counts = { draft: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 } as Record<ApplicationStatus, number>;
		for (const app of applications) {
			counts[app.status]++;
		}
		return counts;
	}

	function countByType(): Record<ApplicationType, number> {
		const counts = { overtime: 0, travel: 0, procurement: 0 } as Record<ApplicationType, number>;
		for (const app of applications) {
			counts[app.type]++;
		}
		return counts;
	}

	return {
		get applications() { return applications; },
		getAll,
		getById,
		getByApplicant,
		getByStatus,
		getByType,
		getMyApplications,
		create,
		updateStatus,
		submit,
		approve,
		reject,
		cancel,
		countByStatus,
		countByType
	};
}

export const applicationStore = createApplicationStore();
