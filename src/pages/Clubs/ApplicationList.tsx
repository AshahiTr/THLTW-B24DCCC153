import { Button, Table, Modal, Form, Input, Select, message, Space, Popconfirm, Drawer, Empty } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';
import { EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';

const ApplicationList: React.FC = () => {
	const { applications, saveApplications, clubs, members, saveMembers, addHistory, history } = useModel('clubs');
	const [visible, setVisible] = useState(false);
	const [historyDrawer, setHistoryDrawer] = useState(false);
	const [selectedAppId, setSelectedAppId] = useState<string>();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [rejectReason, setRejectReason] = useState('');
	const [rejectAppId, setRejectAppId] = useState<string>();
	const [form] = Form.useForm();
	const [isEdit, setIsEdit] = useState(false);

	const adminName = localStorage.getItem('adminName') || 'Admin';

	const handleSave = (values: any) => {
		if (isEdit && selectedAppId) {
			const data = applications.map((a: any) => a.id === selectedAppId ? { ...a, ...values } : a);
			saveApplications(data);
		} else {
			const newApp: Clubs.Application = {
				...values,
				id: Date.now().toString(),
				status: 'Pending',
				createdAt: new Date().toLocaleString('vi-VN'),
			};
			saveApplications([newApp, ...applications]);
		}
		setVisible(false);
		form.resetFields();
		message.success(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
	};

	const handleOpen = (record?: Clubs.Application) => {
		if (record) {
			setIsEdit(true);
			setSelectedAppId(record.id);
			form.setFieldsValue(record);
		} else {
			setIsEdit(false);
			form.resetFields();
		}
		setVisible(true);
	};

	const handleApprove = (ids: string[]) => {
		const approved = applications.map((a: any) => 
			ids.includes(a.id) ? { ...a, status: 'Approved' as const } : a
		);
		saveApplications(approved);
		
		ids.forEach(id => {
			const app = applications.find((a: any) => a.id === id);
			if (app) {
				// Add as member
				const newMember: Clubs.Member = {
					id: Date.now().toString() + Math.random(),
					fullName: app.fullName,
					email: app.email,
					phone: app.phone,
					gender: app.gender,
					address: app.address,
					talent: app.talent,
					clubId: app.clubId,
					joinedAt: new Date().toLocaleString('vi-VN'),
				};
				saveMembers([newMember, ...members]);
				addHistory({
					applicationId: id,
					action: `${adminName} đã duyệt đơn đăng ký`,
					admin: adminName,
					status: 'Approved',
				});
			}
		});
		setSelectedIds([]);
		message.success(`Đã duyệt ${ids.length} đơn`);
	};

	const handleReject = () => {
		if (!rejectAppId || !rejectReason) {
			message.error('Vui lòng nhập lý do từ chối');
			return;
		}
		const updated = applications.map((a: any) => 
			a.id === rejectAppId ? { ...a, status: 'Rejected' as const, notes: rejectReason } : a
		);
		saveApplications(updated);
		addHistory({
			applicationId: rejectAppId,
			action: `${adminName} đã từ chối đơn đăng ký`,
			admin: adminName,
			status: 'Rejected',
			notes: rejectReason,
		});
		setRejectAppId(undefined);
		setRejectReason('');
		message.success('Từ chối thành công');
	};

	const handleDelete = (id: string) => {
		saveApplications(applications.filter((a: any) => a.id !== id));
		message.success('Xóa thành công');
	};

	const appHistory = history.filter((h: any) => selectedAppId && selectedIds.length === 0 ? h.applicationId === selectedAppId : false);

	const columns = [
		{ title: 'Họ Tên', dataIndex: 'fullName', key: 'fullName', width: 120 },
		{ title: 'Email', dataIndex: 'email', key: 'email', width: 150 },
		{ title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 100 },
		{ title: 'Giới Tính', dataIndex: 'gender', key: 'gender', width: 80 },
		{ title: 'Câu Lạc Bộ', dataIndex: 'clubId', key: 'clubId', 
			render: (clubId: string) => clubs.find((c: any) => c.id === clubId)?.name || '—'
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'status',
			key: 'status',
			width: 100,
			render: (status: string) => {
				const colors: any = { Pending: '#faad14', Approved: '#52c41a', Rejected: '#f5222d' };
				return <span style={{ color: colors[status] }}>● {status}</span>;
			},
		},
		{
			title: 'Thao Tác',
			key: 'action',
			width: 200,
			render: (_, record: Clubs.Application) => (
				<Space size='small' wrap>
					<Button type='link' size='small' onClick={() => {
						setSelectedAppId(record.id);
						setHistoryDrawer(true);
					}} icon={<HistoryOutlined />}>
						Lịch sử
					</Button>
					<Button type='primary' size='small' onClick={() => handleApprove([record.id])}>Duyệt</Button>
					<Button 
						danger 
						size='small'
						onClick={() => setRejectAppId(record.id)}
					>
						Từ chối
					</Button>
					<Button type='default' size='small' onClick={() => handleOpen(record)} icon={<EditOutlined />}/>
					<Popconfirm onConfirm={() => handleDelete(record.id)} okText='Xóa' cancelText='Hủy'>
						<Button danger size='small' icon={<DeleteOutlined />}/>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Space style={{ marginBottom: 20 }}>
				<Button type='primary' onClick={() => handleOpen()}>Thêm Mới</Button>
				<Button 
					disabled={selectedIds.length === 0}
					type='primary'
					onClick={() => handleApprove(selectedIds)}
				>
					Duyệt {selectedIds.length} đơn
				</Button>
				<span style={{ color: '#666' }}>Đã chọn: {selectedIds.length}</span>
			</Space>

			<Table 
				dataSource={applications} 
				columns={columns} 
				rowKey='id'
				pagination={{ pageSize: 10 }}
				rowSelection={{
					selectedRowKeys: selectedIds,
					onChange: (keys) => setSelectedIds(keys as string[]),
				}}
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={isEdit ? 'Chỉnh Sửa Đơn Đăng Ký' : 'Thêm Mới Đơn'}
				open={visible}
				onOk={() => form.submit()}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item name='fullName' label='Họ Tên' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='phone' label='SĐT' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='gender' label='Giới Tính' rules={[{ required: true }]}>
						<Select options={[
							{ label: 'Nam', value: 'Nam' },
							{ label: 'Nữ', value: 'Nữ' },
							{ label: 'Khác', value: 'Khác' },
						]} />
					</Form.Item>
					<Form.Item name='address' label='Địa Chỉ' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='talent' label='Sở Trường'>
						<Input />
					</Form.Item>
					<Form.Item name='clubId' label='Câu Lạc Bộ' rules={[{ required: true }]}>
						<Select options={clubs.map((c: any) => ({ label: c.name, value: c.id }))} />
					</Form.Item>
					<Form.Item name='reason' label='Lý Do Đăng Ký' rules={[{ required: true }]}>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Từ Chối Đơn Đăng Ký'
				open={!!rejectAppId}
				onOk={handleReject}
				onCancel={() => setRejectAppId(undefined)}
			>
				<Form layout='vertical'>
					<Form.Item label='Lý Do Từ Chối (*)'>
						<Input.TextArea 
							rows={3} 
							value={rejectReason}
							onChange={(e) => setRejectReason(e.target.value)}
							placeholder='Nhập lý do từ chối'
						/>
					</Form.Item>
				</Form>
			</Modal>

			<Drawer
				title='Lịch Sử Thao Tác'
				onClose={() => setHistoryDrawer(false)}
				open={historyDrawer}
				width={600}
			>
				{appHistory.length === 0 ? (
					<Empty description='Không có lịch sử' />
				) : (
					<div>
						{appHistory.map((log: any) => (
							<div key={log.id} style={{ 
								padding: '10px', 
								borderBottom: '1px solid #eee',
								marginBottom: '10px'
							}}>
								<div><strong>{log.action}</strong></div>
								<div style={{ fontSize: 12, color: '#666' }}>{log.timestamp}</div>
								{log.status && <div><span style={{ color: log.status === 'Approved' ? '#52c41a' : '#f5222d' }}>● {log.status}</span></div>}
								{log.notes && <div style={{ marginTop: 5, color: '#999' }}>Lý do: {log.notes}</div>}
							</div>
						))}
					</div>
				)}
			</Drawer>
		</>
	);
};

export default ApplicationList;
