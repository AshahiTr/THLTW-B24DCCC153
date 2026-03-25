import { Button, Table, Modal, Form, Input, DatePicker, Space, message } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const GraduationDecision: React.FC = () => {
	const model = useModel('QuanLyVanBang.index');
	const { decisions = [], setDecisions, currentRecord, setCurrentRecord, isEdit, setIsEdit, visible, setVisible, getLocalData } = model as any;
	const [form] = Form.useForm();

	useEffect(() => {
		getLocalData();
	}, []);

	const handleSave = async (values: any) => {
		const id = isEdit ? currentRecord?.id : Date.now().toString();
		const newDecisions = isEdit
			? decisions.map((d: any) => d.id === id ? { ...values, id, issued_date: values.issued_date.format('YYYY-MM-DD') } : d)
			: [...decisions, { ...values, id, issued_date: values.issued_date.format('YYYY-MM-DD'), created_at: new Date().toISOString() }];
		setDecisions(newDecisions);
		localStorage.setItem('decisions', JSON.stringify(newDecisions));
			message.success('Lưu thành công');
		setVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newDecisions = decisions.filter((d: any) => d.id !== id);
		setDecisions(newDecisions);
		localStorage.setItem('decisions', JSON.stringify(newDecisions));
	};

	return (
		<div style={{ padding: 20 }}>
			<Button type='primary' onClick={() => { setIsEdit(false); setCurrentRecord(null); form.resetFields(); setVisible(true); }} style={{ marginBottom: 16 }}>
				Tạo Quyết Định
			</Button>
			<Table
				dataSource={decisions}
				columns={[
				{ title: 'Số QĐ', dataIndex: 'decision_number', key: 'decision_number' },
				{ title: 'Ngày Ban Hành', dataIndex: 'issued_date', key: 'issued_date' },
				{ title: 'Trích Yếu', dataIndex: 'summary', key: 'summary', width: 300 },
				{ title: 'Lượt Xem', dataIndex: 'view_count', key: 'view_count' },
				{
					title: 'Thao Tác',
						key: 'actions',
						render: (_, record) => (
							<Space>
							<Button size='small' onClick={() => { setIsEdit(true); setCurrentRecord(record); form.setFieldsValue(record); setVisible(true); }}>Sửa</Button>
							<Button danger size='small' onClick={() => handleDelete(record.id)}>Xóa</Button>
							</Space>
						)
					}
				]}
				rowKey='id'
			/>
			<Modal title={isEdit ? 'Sửa Quyết Định' : 'Tạo Quyết Định'} visible={visible} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} onFinish={handleSave} layout='vertical'>
				<Form.Item label='Số QĐ' name='decision_number' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item label='Ngày Ban Hành' name='issued_date' rules={[{ required: true }]}>
					<DatePicker format='YYYY-MM-DD' />
				</Form.Item>
				<Form.Item label='Trích Yếu' name='summary' rules={[{ required: true }]}>
					<Input.TextArea />
				</Form.Item>
				<Button type='primary' htmlType='submit' block>Lưu</Button>
				</Form>
			</Modal>
		</div>
	);
};
export default GraduationDecision;
