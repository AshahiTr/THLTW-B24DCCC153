import { Button, Table, Modal, Form, Input, Switch, message, Space, Popconfirm, Drawer } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';

const ClubList: React.FC = () => {
	const { clubs, saveClubs, members } = useModel('clubs');
	const [visible, setVisible] = useState(false);
	const [memberDrawer, setMemberDrawer] = useState(false);
	const [selectedClubId, setSelectedClubId] = useState<string>();
	const [form] = Form.useForm();
	const [isEdit, setIsEdit] = useState(false);

	const handleSave = (values: any) => {
		if (isEdit && selectedClubId) {
			const data = clubs.map(c => c.id === selectedClubId ? { ...c, ...values } : c);
			saveClubs(data);
		} else {
			const newClub: Clubs.Club = {
				...values,
				id: Date.now().toString(),
				createdAt: new Date().toLocaleString('vi-VN'),
			};
			saveClubs([newClub, ...clubs]);
		}
		setVisible(false);
		form.resetFields();
		message.success(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
	};

	const handleOpen = (record?: Clubs.Club) => {
		if (record) {
			setIsEdit(true);
			setSelectedClubId(record.id);
			form.setFieldsValue(record);
		} else {
			setIsEdit(false);
			form.resetFields();
		}
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		saveClubs(clubs.filter((c: any) => c.id !== id));
		message.success('Xóa thành công');
	};



	const clubMembers = members.filter((m: any) => m.clubId === selectedClubId);

	const columns = [
		{ title: 'Tên Câu Lạc Bộ', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
		{ title: 'Ngày Thành Lập', dataIndex: 'foundedDate', key: 'foundedDate' },
		{ title: 'Chủ Nhiệm', dataIndex: 'head', key: 'head' },
		{ 
			title: 'Hoạt Động', 
			dataIndex: 'active', 
			key: 'active',
			render: (active: boolean) => active ? '✓' : '✗'
		},
		{
			title: 'Thao Tác',
			key: 'action',
			render: (_: any, record: Clubs.Club) => (
				<Space size='small'>
					<Button 
						type='primary' 
						size='small' 
						onClick={() => {
							setSelectedClubId(record.id);
							setMemberDrawer(true);
						}}
						icon={<TeamOutlined />}
					>
						Thành viên
					</Button>
					<Button 
						type='default' 
						size='small' 
						onClick={() => handleOpen(record)}
						icon={<EditOutlined />}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xác nhận xóa'
						description='Bạn chắc chắn muốn xóa câu lạc bộ này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
						trigger='click'
					>
						<Button danger size='small' icon={<DeleteOutlined />}>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Button 
				type='primary' 
				onClick={() => handleOpen()}
				style={{ marginBottom: 20 }}
			>
				Thêm Câu Lạc Bộ
			</Button>
			<Table 
				dataSource={clubs} 
				columns={columns} 
				rowKey='id'
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				title={isEdit ? 'Chỉnh Sửa Câu Lạc Bộ' : 'Thêm Mới Câu Lạc Bộ'}
			open={visible}
				onOk={() => form.submit()}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<Form 
					form={form} 
					layout='vertical' 
					onFinish={handleSave}
				>
					<Form.Item name='name' label='Tên Câu Lạc Bộ' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='foundedDate' label='Ngày Thành Lập' rules={[{ required: true }]}>
						<Input type='date' />
					</Form.Item>
					<Form.Item name='avatar' label='Ảnh Đại Diện'>
						<Input placeholder='URL ảnh' />
					</Form.Item>
					<Form.Item name='description' label='Mô Tả'>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item name='head' label='Chủ Nhiệm' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='active' label='Hoạt Động' valuePropName='checked'>
						<Switch />
					</Form.Item>
				</Form>
			</Modal>

			<Drawer
				title={`Thành Viên - ${clubs.find(c => c.id === selectedClubId)?.name}`}
				placement='right'
				onClose={() => setMemberDrawer(false)}
				open={memberDrawer}
				width={800}
			>
				<Table 
					dataSource={clubMembers} 
					columns={[
						{ title: 'Họ Tên', dataIndex: 'fullName', key: 'fullName' },
						{ title: 'Email', dataIndex: 'email', key: 'email' },
						{ title: 'SĐT', dataIndex: 'phone', key: 'phone' },
						{ title: 'Giới Tính', dataIndex: 'gender', key: 'gender' },
						{ title: 'Sở Trường', dataIndex: 'talent', key: 'talent' },
					]} 
					rowKey='id'
					pagination={{ pageSize: 5 }}
				/>
			</Drawer>
		</>
	);
};

export default ClubList;
