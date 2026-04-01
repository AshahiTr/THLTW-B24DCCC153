import { Button, Table, Modal, Form, Select, message, Space, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const MemberList: React.FC = () => {
	const { members, saveMembers, clubs } = useModel('clubs');
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [changeClubModal, setChangeClubModal] = useState(false);
	const [newClubId, setNewClubId] = useState<string>();

	const handleChangeClub = () => {
		if (!newClubId) {
			message.error('Vui lòng chọn câu lạc bộ');
			return;
		}
		const updated = members.map((m: any) => 
			selectedIds.includes(m.id) ? { ...m, clubId: newClubId } : m
		);
		saveMembers(updated);
		message.success(`Đã chuyển ${selectedIds.length} thành viên sang ${clubs.find((c: any) => c.id === newClubId)?.name}`);
		setChangeClubModal(false);
		setNewClubId(undefined);
		setSelectedIds([]);
	};

	const handleDelete = (id: string) => {
		saveMembers(members.filter((m: any) => m.id !== id));
		message.success('Xóa thành công');
	};

	const columns = [
		{ title: 'Họ Tên', dataIndex: 'fullName', key: 'fullName', width: 120 },
		{ title: 'Email', dataIndex: 'email', key: 'email', width: 150 },
		{ title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 100 },
		{ title: 'Giới Tính', dataIndex: 'gender', key: 'gender', width: 80 },
		{ title: 'Địa Chỉ', dataIndex: 'address', key: 'address', width: 150 },
		{ title: 'Sở Trường', dataIndex: 'talent', key: 'talent', width: 120 },
		{ 
			title: 'Câu Lạc Bộ', 
			dataIndex: 'clubId', 
			key: 'clubId',
			render: (clubId: string) => clubs.find((c: any) => c.id === clubId)?.name || '—'
		},
		{ title: 'Ngày Tham Gia', dataIndex: 'joinedAt', key: 'joinedAt', width: 140 },
		{
			title: 'Thao Tác',
			key: 'action',
			width: 120,
			render: (_: any, record: Clubs.Member) => (
				<Space size='small'>
					<Popconfirm title='Xác nhận' description='Bạn chắc chắn?' onConfirm={() => handleDelete(record.id)} okText='Xóa' cancelText='Hủy'>
						<Button danger size='small' icon={<DeleteOutlined />}/>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Space style={{ marginBottom: 20 }}>
				<span style={{ color: '#666' }}>Tổng thành viên: <strong>{members.length}</strong></span>
				<Button 
					disabled={selectedIds.length === 0}
					type='primary'
					onClick={() => setChangeClubModal(true)}
				>
					Chuyển CLB ({selectedIds.length})
				</Button>
				<span style={{ color: '#666' }}>Đã chọn: {selectedIds.length}</span>
			</Space>

			<Table 
				dataSource={members} 
				columns={columns} 
				rowKey='id'
				pagination={{ pageSize: 15 }}
				rowSelection={{
					selectedRowKeys: selectedIds,
					onChange: (keys) => setSelectedIds(keys as string[]),
				}}
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={`Chuyển Câu Lạc Bộ (${selectedIds.length} thành viên)`}
				open={changeClubModal}
				onOk={handleChangeClub}
				onCancel={() => {
					setChangeClubModal(false);
					setNewClubId(undefined);
				}}
				okText='Chuyển'
				cancelText='Hủy'
			>
				<Form layout='vertical'>
					<Form.Item label='Câu Lạc Bộ Đích (*)'>
						<Select 
							placeholder='Chọn câu lạc bộ'
							options={clubs.map(c => ({ label: c.name, value: c.id }))}
							value={newClubId}
							onChange={setNewClubId}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default MemberList;
