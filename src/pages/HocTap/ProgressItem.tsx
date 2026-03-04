import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';

const ProgressItem = (props: { record: HocTap.LearningProgress }) => {
	const { record } = props;
	const { progress, updateProgress, setSelectedItem, setFormType, setVisibleForm, setIsEdit } =
		useModel('hocTap');

	const handleDelete = () => {
		const newProgress = progress.filter((p) => p.id !== record.id);
		updateProgress(newProgress);
	};

	const handleEdit = () => {
		setSelectedItem(record);
		setFormType('progress');
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
				<span style={{ fontSize: '16px', fontWeight: '500' }}>{record.subjectName}</span>
				<div>
					<FormOutlined
						onClick={handleEdit}
						style={{ color: '#1890ff', cursor: 'pointer', marginRight: '12px' }}
					/>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa tiến độ này?'
						onConfirm={handleDelete}
						okText='Xóa'
						cancelText='Hủy'
					>
						<DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
					</Popconfirm>
				</div>
			</div>
			<div style={{ fontSize: '12px', color: '#666' }}>
				<p>
					<strong>Ngày:</strong> {new Date(record.date).toLocaleDateString('vi-VN')}
				</p>
				<p>
					<strong>Thời lượng:</strong> {record.duration} giờ
				</p>
				<p>
					<strong>Nội dung:</strong> {record.content}
				</p>
				{record.notes && (
					<p>
						<strong>Ghi chú:</strong> {record.notes}
					</p>
				)}
			</div>
		</div>
	);
};

export default ProgressItem;
