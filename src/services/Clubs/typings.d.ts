declare module Clubs {
	export interface Club {
		id: string;
		name: string;
		avatar?: string;
		foundedDate: string;
		description: string;
		head: string;
		active: boolean;
		createdAt?: string;
	}

	export interface Application {
		id: string;
		fullName: string;
		email: string;
		phone: string;
		gender: 'Nam' | 'Nữ' | 'Khác';
		address: string;
		talent: string;
		clubId: string;
		reason: string;
		status: 'Pending' | 'Approved' | 'Rejected';
		notes?: string;
		createdAt: string;
	}

	export interface Member {
		id: string;
		fullName: string;
		email: string;
		phone: string;
		gender: 'Nam' | 'Nữ' | 'Khác';
		address: string;
		talent: string;
		clubId: string;
		joinedAt: string;
	}

	export interface HistoryLog {
		id: string;
		action: string;
		applicationId?: string;
		admin: string;
		status?: 'Approved' | 'Rejected';
		notes?: string;
		timestamp: string;
	}
}
