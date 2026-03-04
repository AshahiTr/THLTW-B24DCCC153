import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Progress, Popconfirm } from 'antd';
import { useModel } from 'umi';

const GoalItem = (props: { goal: HocTap.MonthlyGoal }) => {
	const { goal } = props;
	const { goals, progress, updateGoals, setSelectedItem, setFormType, setVisibleForm, setIsEdit } =
		useModel('hocTap');

	const actualHours = progress
		.filter((p) => {
			const progressMonth = new Date(p.date).toISOString().slice(0, 7);
			return p.subjectId === goal.subjectId && progressMonth === goal.month;
		})
		.reduce((sum, p) => sum + p.duration, 0);

	const percentage = Math.min((actualHours / goal.targetHours) * 100, 100);
	const status = actualHours >= goal.targetHours ? 'success' : actualHours >= goal.targetHours * 0.5 ? 'active' : 'exception';

	const handleDelete = () => {
		const newGoals = goals.filter((g) => g.id !== goal.id);
		updateGoals(newGoals);
	};

	const handleEdit = () => {
		setSelectedItem(goal);
		setFormType('goal');
		setIsEdit(true);
		setVisibleForm(true);
	};

	return (
		<div
			style={{
				padding: '12px',
				marginBottom: '8px',
				border: '1px solid #f0f0f0',
				borderRadius: '4px',
				backgroundColor: '#fafafa',
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
				<span style={{ fontSize: '16px', fontWeight: '500' }}>{goal.subjectName}</span>
				<div>
					<FormOutlined
						onClick={handleEdit}
						style={{ color: '#1890ff', cursor: 'pointer', marginRight: '12px' }}
					/>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa mục tiêu này?'
						onConfirm={handleDelete}
						okText='Xóa'
						cancelText='Hủy'
					>
						<DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
					</Popconfirm>
				</div>
			</div>
			<div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
				<p>
					<strong>Tháng:</strong> {goal.month}
				</p>
				<p>
					<strong>Mục tiêu:</strong> {goal.targetHours} giờ | <strong>Đã học:</strong> {actualHours.toFixed(1)} giờ
				</p>
			</div>
			<Progress
				percent={percentage}
				status={status}
				format={() => `${actualHours.toFixed(1)}/${goal.targetHours} giờ`}
			/>
		</div>
	);
};

export default GoalItem;
