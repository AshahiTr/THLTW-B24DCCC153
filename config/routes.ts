export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// DỊCH VỤ LỊCH HẸN
	{
		path: '/dich-vu-lich-hen',
		name: 'Dịch Vụ Lịch Hẹn',
		icon: 'CalendarOutlined',
		routes: [
			{
				path: '/dich-vu-lich-hen',
				redirect: '/dich-vu-lich-hen/booking',
			},
			{
				path: '/dich-vu-lich-hen/booking',
				name: 'Đặt Lịch Hẹn',
				component: './DichVuLichHen/Booking',
			},
			{
				path: '/dich-vu-lich-hen/staff',
				name: 'Quản Lý Nhân Viên',
				component: './DichVuLichHen/StaffManagement',
			},
			{
				path: '/dich-vu-lich-hen/service',
				name: 'Quản Lý Dịch Vụ',
				component: './DichVuLichHen/ServiceManagement',
			},
			{
				path: '/dich-vu-lich-hen/review',
				name: 'Đánh Giá & Phản Hồi',
				component: './DichVuLichHen/ReviewManagement',
			},
			{
				path: '/dich-vu-lich-hen/statistics',
				name: 'Thống Kê & Báo Cáo',
				component: './DichVuLichHen/Statistics',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
