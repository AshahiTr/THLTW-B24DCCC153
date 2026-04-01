import { Tabs } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import ClubList from './ClubList';
import ApplicationList from './ApplicationList';
import MemberList from './MemberList';
import Reports from './Reports';

const Clubs: React.FC = () => {
	const { loadData } = useModel('clubs');

	useEffect(() => {
		loadData();
	}, []);

	return (
		<div style={{ padding: '20px' }}>
			<h1>Quản Lý Câu Lạc Bộ</h1>
			<Tabs defaultActiveKey='clubs'>
				<Tabs.TabPane key='clubs' tab='Danh Sách Câu Lạc Bộ'>
					<ClubList />
				</Tabs.TabPane>
				<Tabs.TabPane key='applications' tab='Quản Lý Đơn Đăng Ký'>
					<ApplicationList />
				</Tabs.TabPane>
				<Tabs.TabPane key='members' tab='Quản Lý Thành Viên'>
					<MemberList />
				</Tabs.TabPane>
				<Tabs.TabPane key='reports' tab='Báo Cáo & Thống Kê'>
					<Reports />
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default Clubs;
