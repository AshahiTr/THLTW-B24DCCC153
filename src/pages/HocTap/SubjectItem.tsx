import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';

const SubjectItem = (props: { subject: HocTap.Subject }) => {
	const { subject } = props;
	const { updateSubjects, subjects, setSelectedItem, setFormType, setVisibleForm, setIsEdit } =
		useModel('hocTap');

	const handleDelete = () => {
		const newSubjects = subjects.filter((s) => s.id !== subject.id);
		updateSubjects(newSubjects);
	};

	const handleEdit = () => {
		setSelectedItem(subject);
		setFormType('subject');
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
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: '#fafafa',
			}}
		>
			<span style={{ fontSize: '16px', fontWeight: '500' }}>{subject.name}</span>
			<div>
				<FormOutlined
					onClick={handleEdit}
					style={{ color: '#1890ff', cursor: 'pointer', marginRight: '12px' }}
				/>
				<Popconfirm
					title='Bạn có chắc chắn muốn xóa môn học này?'
					onConfirm={handleDelete}
					okText='Xóa'
					cancelText='Hủy'
				>
					<DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
				</Popconfirm>
			</div>
		</div>
	);
};

export default SubjectItem;
