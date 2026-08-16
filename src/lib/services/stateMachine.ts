import type { ApplicationStatus, Action } from '$lib/types/application';

// 合法的状态转换映射
const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
	draft: ['pending', 'cancelled'],
	pending: ['approved', 'rejected', 'cancelled'],
	approved: [],
	rejected: [],
	cancelled: []
};

// 动作标签配置
const ACTION_LABELS: Record<string, { label: string; color: Action['color'] }> = {
	pending: { label: '提交审批', color: 'blue' },
	approved: { label: '审批通过', color: 'green' },
	rejected: { label: '审批驳回', color: 'red' },
	cancelled: { label: '取消申请', color: 'purple' }
};

/**
 * 检查是否可以从 fromStatus 转换到 toStatus
 */
export function canTransition(fromStatus: ApplicationStatus, toStatus: ApplicationStatus): boolean {
	return TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

/**
 * 获取当前状态下可用的操作列表
 */
export function getAvailableActions(status: ApplicationStatus): Action[] {
	const targets = TRANSITIONS[status] ?? [];
	return targets.map((targetStatus) => ({
		targetStatus,
		label: ACTION_LABELS[targetStatus]?.label ?? targetStatus,
		color: ACTION_LABELS[targetStatus]?.color ?? 'alternative'
	}));
}

/**
 * 执行状态转换，返回新状态；若不合法则抛出错误
 */
export function transition(currentStatus: ApplicationStatus, targetStatus: ApplicationStatus): ApplicationStatus {
	if (!canTransition(currentStatus, targetStatus)) {
		throw new Error(`非法状态转换: ${currentStatus} -> ${targetStatus}`);
	}
	return targetStatus;
}
