declare module LichDuLich {
	export interface Destination {
		id: string;
		name: string;
		type: 'beach' | 'mountain' | 'city' | 'countryside'; // Biển, Núi, Thành phố, Nông thôn
		location: string;
		rating: number; // 1-5 sao
		price: number; // Chi phí tham quan
		description: string;
		image?: string; // URL hình ảnh hoặc base64
		viewingTime: number; // Thời gian tham quan (phút)
		food?: number; // Chi phí ăn uống
		accommodation?: number; // Chi phí lưu trú
		transport?: number; // Chi phí di chuyển
		createdAt?: string;
	}

	export interface ItineraryDay {
		dayNumber: number;
		date?: string;
		destinations: Destination[];
		notes?: string;
		totalTime: number; // Tổng thời gian (phút)
		totalCost: number; // Chi phí tổng cộng ngày này
	}

	export interface Itinerary {
		id: string;
		name: string;
		startDate: string;
		endDate: string;
		budget: number; // Ngân sách tổng
		days: ItineraryDay[];
		status: 'draft' | 'planning' | 'confirmed'; // Trạng thái lịch trình
		notes?: string;
		createdAt: string;
		updatedAt: string;
	}

	export interface BudgetCategory {
		category: 'food' | 'accommodation' | 'transport' | 'activity' | 'other';
		spent: number;
		planned: number;
		percentage?: number;
	}

	export interface Budget {
		itineraryId: string;
		totalBudget: number;
		spent: number;
		categories: BudgetCategory[];
		alerts?: string[];
		createdAt: string;
		updatedAt: string;
	}

	export interface Statistics {
		totalItineraries: number;
		totalDestinations: number;
		topDestinations: Destination[];
		populationByType: Record<string, number>;
		totalRevenue: number;
		revenueByCategory: Record<string, number>;
	}
}
