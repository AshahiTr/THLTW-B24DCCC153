import { useState } from 'react';

const SAMPLE_CLUBS: Clubs.Club[] = [
	{
		id: '1',
		name: 'Câu Lạc Bộ Bóng Đá',
		avatar: '⚽',
		foundedDate: '2020-01-15',
		description: 'Câu lạc bộ bóng đá đại học, tham gia các giải đấu trong khuôn viên',
		head: 'Nguyễn Văn A',
		active: true,
		createdAt: '2020-01-15',
	},
	{
		id: '2',
		name: 'Câu Lạc Bộ Lập Trình',
		avatar: '💻',
		foundedDate: '2021-03-20',
		description: 'Học hỏi và chia sẻ kinh nghiệm lập trình, web development, mobile apps',
		head: 'Trần Thị B',
		active: true,
		createdAt: '2021-03-20',
	},
	{
		id: '3',
		name: 'Câu Lạc Bộ Âm Nhạc',
		avatar: '🎸',
		foundedDate: '2019-06-10',
		description: 'Trao đổi và biểu diễn âm nhạc, hát karaoke, học các nhạc cụ',
		head: 'Lê Văn C',
		active: true,
		createdAt: '2019-06-10',
	},
	{
		id: '4',
		name: 'Câu Lạc Bộ Tiếng Anh',
		avatar: '🌍',
		foundedDate: '2021-09-01',
		description: 'Cải thiện kỹ năng tiếng Anh, giao tiếp, TOEIC, IELTS',
		head: 'Phạm Hồng D',
		active: true,
		createdAt: '2021-09-01',
	},
];

const SAMPLE_APPLICATIONS: Clubs.Application[] = [
	{
		id: '101',
		fullName: 'Hoàng Văn E',
		email: 'hoang.e@student.edu.vn',
		phone: '0912345678',
		gender: 'Nam',
		address: 'Quận 1, TP.HCM',
		talent: 'Lập trình backend',
		clubId: '2',
		reason: 'Muốn nâng cao kỹ năng lập trình và kết nối với các developer khác',
		status: 'Pending',
		createdAt: '2026-03-25',
	},
	{
		id: '102',
		fullName: 'Ngô Thị F',
		email: 'ngo.f@student.edu.vn',
		phone: '0987654321',
		gender: 'Nữ',
		address: 'Quận 3, TP.HCM',
		talent: 'Tiếng Anh ngoại giao',
		clubId: '4',
		reason: 'Chuẩn bị thi IELT, muốn giao tiếp tốt hơn',
		status: 'Approved',
		createdAt: '2026-03-20',
	},
	{
		id: '103',
		fullName: 'Đặng Minh G',
		email: 'dang.g@student.edu.vn',
		phone: '0901234567',
		gender: 'Nam',
		address: 'Quận 7, TP.HCM',
		talent: 'Bóng đá thể hình',
		clubId: '1',
		reason: 'Thích chơi bóng đá và muốn tham gia các giải đấu',
		status: 'Pending',
		createdAt: '2026-03-28',
	},
	{
		id: '104',
		fullName: 'Vũ Thanh H',
		email: 'vu.h@student.edu.vn',
		phone: '0909876543',
		gender: 'Nam',
		address: 'Quận 2, TP.HCM',
		talent: 'Đàn guitar',
		clubId: '3',
		reason: 'Muốn học đàn guitar và biểu diễn cùng CLB',
		status: 'Rejected',
		notes: 'Không đủ điều kiện tham gia - mâu thuẫn với lịch học',
		createdAt: '2026-03-15',
	},
];

const SAMPLE_MEMBERS: Clubs.Member[] = [
	{
		id: '201',
		fullName: 'Ngô Thị F',
		email: 'ngo.f@student.edu.vn',
		phone: '0987654321',
		gender: 'Nữ',
		address: 'Quận 3, TP.HCM',
		talent: 'Tiếng Anh ngoại giao',
		clubId: '4',
		joinedAt: '2026-03-20',
	},
	{
		id: '202',
		fullName: 'Kiều Long I',
		email: 'kieu.i@student.edu.vn',
		phone: '0908765432',
		gender: 'Nam',
		address: 'Quận 4, TP.HCM',
		talent: 'Tiếng Anh công sở',
		clubId: '4',
		joinedAt: '2026-02-10',
	},
	{
		id: '203',
		fullName: 'Trương Minh K',
		email: 'truong.k@student.edu.vn',
		phone: '0898765432',
		gender: 'Nam',
		address: 'Quận 5, TP.HCM',
		talent: 'Lập trình fullstack',
		clubId: '2',
		joinedAt: '2026-01-15',
	},
	{
		id: '204',
		fullName: 'Cao Thị L',
		email: 'cao.l@student.edu.vn',
		phone: '0888765432',
		gender: 'Nữ',
		address: 'Quận 6, TP.HCM',
		talent: 'Web design',
		clubId: '2',
		joinedAt: '2026-02-28',
	},
];

const SAMPLE_HISTORY: Clubs.HistoryLog[] = [
	{
		id: '301',
		action: 'Admin đã duyệt đơn đăng ký',
		applicationId: '102',
		admin: 'Admin',
		status: 'Approved',
		timestamp: '20/03/2026 14:30:45',
	},
	{
		id: '302',
		action: 'Admin đã từ chối đơn đăng ký',
		applicationId: '104',
		admin: 'Admin',
		status: 'Rejected',
		notes: 'Không đủ điều kiện tham gia - mâu thuẫn với lịch học',
		timestamp: '15/03/2026 10:15:20',
	},
];

export default () => {
	const [clubs, setClubs] = useState<Clubs.Club[]>([]);
	const [applications, setApplications] = useState<Clubs.Application[]>([]);
	const [members, setMembers] = useState<Clubs.Member[]>([]);
	const [history, setHistory] = useState<Clubs.HistoryLog[]>([]);
	
	const [clubModal, setClubModal] = useState(false);
	const [appModal, setAppModal] = useState(false);
	const [historyModal, setHistoryModal] = useState(false);
	const [selectedClub, setSelectedClub] = useState<Clubs.Club>();
	const [selectedApp, setSelectedApp] = useState<Clubs.Application>();
	const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
	const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
	
	const loadData = () => {
		const clubsData = JSON.parse(localStorage.getItem('clubs') || '[]');
		const appData = JSON.parse(localStorage.getItem('applications') || '[]');
		const memberData = JSON.parse(localStorage.getItem('members') || '[]');
		const historyData = JSON.parse(localStorage.getItem('history') || '[]');

		// Initialize with sample data if empty
		if (clubsData.length === 0) {
			localStorage.setItem('clubs', JSON.stringify(SAMPLE_CLUBS));
			setClubs(SAMPLE_CLUBS);
		} else {
			setClubs(clubsData);
		}

		if (appData.length === 0) {
			localStorage.setItem('applications', JSON.stringify(SAMPLE_APPLICATIONS));
			setApplications(SAMPLE_APPLICATIONS);
		} else {
			setApplications(appData);
		}

		if (memberData.length === 0) {
			localStorage.setItem('members', JSON.stringify(SAMPLE_MEMBERS));
			setMembers(SAMPLE_MEMBERS);
		} else {
			setMembers(memberData);
		}

		if (historyData.length === 0) {
			localStorage.setItem('history', JSON.stringify(SAMPLE_HISTORY));
			setHistory(SAMPLE_HISTORY);
		} else {
			setHistory(historyData);
		}
	};

	const saveClubs = (data: Clubs.Club[]) => {
		localStorage.setItem('clubs', JSON.stringify(data));
		setClubs(data);
	};

	const saveApplications = (data: Clubs.Application[]) => {
		localStorage.setItem('applications', JSON.stringify(data));
		setApplications(data);
	};

	const saveMembers = (data: Clubs.Member[]) => {
		localStorage.setItem('members', JSON.stringify(data));
		setMembers(data);
	};

	const addHistory = (log: Omit<Clubs.HistoryLog, 'id' | 'timestamp'>) => {
		const newLog: Clubs.HistoryLog = {
			...log,
			id: Date.now().toString(),
			timestamp: new Date().toLocaleString('vi-VN'),
		};
		const newHistory = [newLog, ...history];
		localStorage.setItem('history', JSON.stringify(newHistory));
		setHistory(newHistory);
	};

	return {
		clubs, setClubs, saveClubs,
		applications, setApplications, saveApplications,
		members, setMembers, saveMembers,
		history, setHistory, addHistory,
		clubModal, setClubModal,
		appModal, setAppModal,
		historyModal, setHistoryModal,
		selectedClub, setSelectedClub,
		selectedApp, setSelectedApp,
		selectedAppIds, setSelectedAppIds,
		selectedMemberIds, setSelectedMemberIds,
		loadData,
	};
};
