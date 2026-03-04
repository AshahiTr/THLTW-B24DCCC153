import { Modal, Tabs, Empty, Button } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import SubjectItem from './SubjectItem';
import SubjectForm from './SubjectForm';
import ProgressItem from './ProgressItem';
import ProgressForm from './ProgressForm';
import GoalItem from './GoalItem';
import GoalForm from './GoalForm';
import useInitHocTapData from './useInitHocTapData';

const HocTap: React.FC = () => {
	// Auto init sample data if not exists
	useInitHocTapData();

	const {
		subjects,
		progress,
		goals,
		selectedTab,
		setSelectedTab,
		visibleForm,
		setVisibleForm,
		selectedItem,
		setSelectedItem,
		formType,
		setFormType,
		setIsEdit,
		getDataHocTap,
	} = useModel('hocTap');

	useEffect(() => {
		getDataHocTap();
	}, []);

	const openSubjectForm = () => {
		setSelectedItem(null);
		setFormType('subject');
		setIsEdit(false);
		setVisibleForm(true);
	};

	const openProgressForm = () => {
		setSelectedItem(null);
		setFormType('progress');
		setIsEdit(false);
		setVisibleForm(true);
	};

	const openGoalForm = () => {
		setSelectedItem(null);
		setFormType('goal');
		setIsEdit(false);
		setVisibleForm(true);
	};

	const getFormTitle = () => {
		if (formType === 'subject') {
			return selectedItem ? 'Cập nhật môn học' : 'Thêm môn học';
		} else if (formType === 'progress') {
			return selectedItem ? 'Cập nhật tiến độ' : 'Thêm tiến độ học tập';
		} else {
			return selectedItem ? 'Cập nhật mục tiêu' : 'Thêm mục tiêu hàng tháng';
		}
	};

	const renderForm = () => {
		if (formType === 'subject') {
			return <SubjectForm />;
		} else if (formType === 'progress') {
			return <ProgressForm />;
		} else {
			return <GoalForm />;
		}
	};

	return (
		<div>
			<div style={{ textAlign: 'center', marginBottom: 30 }}>
				<h1>Quản lý Tiến độ Học tập</h1>
				<p>Theo dõi và quản lý các môn học, tiến độ học tập hàng ngày, mục tiêu học tập hàng tháng</p>
			</div>

			<Tabs
				activeKey={selectedTab}
				onChange={(key) => setSelectedTab(key)}
			>
				<Tabs.TabPane tab='Danh mục môn học' key='1'>
					<div>
						<Button type='primary' style={{ marginBottom: 16 }} onClick={openSubjectForm}>
							Thêm môn học
						</Button>
						{subjects.length === 0 ? (
							<Empty description='Chưa có môn học' />
						) : (
							subjects.map((subject) => <SubjectItem key={subject.id} subject={subject} />)
						)}
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Tiến độ học tập' key='2'>
					<div>
						<Button type='primary' style={{ marginBottom: 16 }} onClick={openProgressForm}>
							Thêm tiến độ
						</Button>
						{progress.length === 0 ? (
							<Empty description='Chưa có tiến độ học tập' />
						) : (
							progress
								.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
								.map((item) => <ProgressItem key={item.id} record={item} />)
						)}
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Mục tiêu hàng tháng' key='3'>
					<div>
						<Button type='primary' style={{ marginBottom: 16 }} onClick={openGoalForm}>
							Thêm mục tiêu
						</Button>
						{goals.length === 0 ? (
							<Empty description='Chưa có mục tiêu' />
						) : (
							goals
								.sort((a, b) => b.month.localeCompare(a.month))
								.map((goal) => <GoalItem key={goal.id} goal={goal} />)
						)}
					</div>
				</Tabs.TabPane>
			</Tabs>

			<Modal
				destroyOnClose
				title={getFormTitle()}
				visible={visibleForm}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				{renderForm()}
			</Modal>
		</div>
	);
};

export default HocTap;
