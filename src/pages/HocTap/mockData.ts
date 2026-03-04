// Dữ liệu mẫu cho ứng dụng Quản lý Tiến độ Học tập

const sampleData = {
	// Danh mục môn học
	subjects: [
		{
			id: '1',
			name: 'Toán',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			name: 'Văn',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '3',
			name: 'Anh',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '4',
			name: 'Khoa học',
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '5',
			name: 'Công nghệ',
			createdAt: '2024-01-01T00:00:00Z',
		},
	],

	// Tiến độ học tập
	progress: [
		{
			id: '101',
			subjectId: '1',
			subjectName: 'Toán',
			date: '2024-03-01T09:00:00Z',
			duration: 2,
			content: 'Học về phương trình bậc 2, cách giải và ứng dụng',
			notes: 'Hiểu rõ hơn về delta và công thức nghiệm',
			createdAt: '2024-03-01T09:00:00Z',
		},
		{
			id: '102',
			subjectId: '1',
			subjectName: 'Toán',
			date: '2024-03-02T14:00:00Z',
			duration: 1.5,
			content: 'Luyện tập bài tập phương trình, giải hệ phương trình',
			notes: 'Làm được 8/10 bài tập',
			createdAt: '2024-03-02T14:00:00Z',
		},
		{
			id: '103',
			subjectId: '2',
			subjectName: 'Văn',
			date: '2024-03-01T10:00:00Z',
			duration: 1,
			content: 'Đọc và phân tích bài thơ "Chiều tối"',
			notes: 'Hiểu được ý chủ đề và cảm xúc của tác giả',
			createdAt: '2024-03-01T10:00:00Z',
		},
		{
			id: '104',
			subjectId: '3',
			subjectName: 'Anh',
			date: '2024-03-02T15:00:00Z',
			duration: 2,
			content: 'Học Unit 5 - Present Perfect tense',
			notes: 'Làm bài tập từ vựng và ngữ pháp',
			createdAt: '2024-03-02T15:00:00Z',
		},
	],

	// Mục tiêu hàng tháng
	goals: [
		{
			id: '201',
			subjectId: '1',
			subjectName: 'Toán',
			month: '2024-03',
			targetHours: 20,
			createdAt: '2024-03-01T00:00:00Z',
		},
		{
			id: '202',
			subjectId: '2',
			subjectName: 'Văn',
			month: '2024-03',
			targetHours: 15,
			createdAt: '2024-03-01T00:00:00Z',
		},
		{
			id: '203',
			subjectId: '3',
			subjectName: 'Anh',
			month: '2024-03',
			targetHours: 18,
			createdAt: '2024-03-01T00:00:00Z',
		},
		{
			id: '204',
			subjectId: '4',
			subjectName: 'Khoa học',
			month: '2024-03',
			targetHours: 12,
			createdAt: '2024-03-01T00:00:00Z',
		},
	],
};

// Hàm khởi tạo dữ liệu mẫu vào localStorage
export function initSampleData() {
	const existingSubjects = localStorage.getItem('hocTap_subjects');
	const existingProgress = localStorage.getItem('hocTap_progress');
	const existingGoals = localStorage.getItem('hocTap_goals');

	// Chỉ init data nếu chưa có
	if (!existingSubjects) {
		localStorage.setItem('hocTap_subjects', JSON.stringify(sampleData.subjects));
	}
	if (!existingProgress) {
		localStorage.setItem('hocTap_progress', JSON.stringify(sampleData.progress));
	}
	if (!existingGoals) {
		localStorage.setItem('hocTap_goals', JSON.stringify(sampleData.goals));
	}
}

// Hàm xóa tất cả dữ liệu
export function clearAllData() {
	localStorage.removeItem('hocTap_subjects');
	localStorage.removeItem('hocTap_progress');
	localStorage.removeItem('hocTap_goals');
}

// Hàm reset về dữ liệu mẫu
export function resetToSampleData() {
	clearAllData();
	initSampleData();
}

export default sampleData;
