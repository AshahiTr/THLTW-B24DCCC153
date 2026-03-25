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
	{
		path: '/quan-ly-van-bang',
		name: 'Quản Lý Văn Bằng',
		icon: 'FileTextOutlined',
		routes: [
			{
				path: '/quan-ly-van-bang/certificate-books',
				name: 'Sổ Văn Bằng',
				component: './QuanLyVanBang/sachvanbang',
			},
			{
				path: '/quan-ly-van-bang/graduation-decisions',
				name: 'Quyết Định Tốt Nghiệp',
				component: './QuanLyVanBang/quyetdinhtotnghiep',
			},
			{
				path: '/quan-ly-van-bang/form-field-config',
				name: 'Cấu Hình Biểu Mẫu',
				component: './QuanLyVanBang/cauhinhbieumau',
			},
			{
				path: '/quan-ly-van-bang/certificate-infos',
				name: 'Thông Tin Văn Bằng',
				component: './QuanLyVanBang/thongtinvanbang',
			},
		],
	},
	{
		path: '/tra-cuu-van-bang',
		name: 'Tra Cứu Văn Bằng',
		component: './QuanLyVanBang/tracuuvanbang',
		layout: false,
		hideInMenu: true,
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
