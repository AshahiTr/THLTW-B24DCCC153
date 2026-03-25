import { Button, Table, Modal, Form, Input, Select, Space, message, InputNumber } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const CertificateInfo: React.FC = () => {
	const model = useModel('QuanLyVanBang.index');
	const { certificates = [], setCertificates, decisions = [], books = [], fields = [], currentRecord, setCurrentRecord, isEdit, setIsEdit, visible, setVisible, getLocalData } = model as any;
	const [form] = Form.useForm();

	useEffect(() => {
		getLocalData();
	}, []);

	const handleSave = async (values: any) => {
		const bookId = values.book_id;
		const entryNum = certificates.filter((c: any) => c.book_id === bookId).length + 1;
		const certNum = `BĐ-${new Date().getFullYear()}-${String(entryNum).padStart(5, '0')}`;
		
		const id = isEdit ? currentRecord?.id : Date.now().toString();
		const newCerts = isEdit
			? certificates.map((c: any) => c.id === id ? { ...values, id, certificate_number: certNum } : c)
			: [...certificates, { ...values, id, entry_number: entryNum, certificate_number: certNum, created_at: new Date().toISOString() }];
		
		setCertificates(newCerts);
		localStorage.setItem('certificates', JSON.stringify(newCerts));
			message.success('Lưu thành công');
		setVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newCerts = certificates.filter((c: any) => c.id !== id);
		setCertificates(newCerts);
		localStorage.setItem('certificates', JSON.stringify(newCerts));
	};

	return (
		<div style={{ padding: 20 }}>
			<Button type='primary' onClick={() => { setIsEdit(false); setCurrentRecord(null); form.resetFields(); setVisible(true); }} style={{ marginBottom: 16 }}>
				Thêm Văn Bằng
			</Button>
			<Table
				dataSource={certificates}
				columns={[
				{ title: 'Số Vào Sổ', dataIndex: 'entry_number', key: 'entry_number' },
				{ title: 'Số Hiệu Văn Bằng', dataIndex: 'certificate_number', key: 'certificate_number', width: 150 },
				{ title: 'MSV', dataIndex: 'student_id', key: 'student_id' },
				{ title: 'Họ Tên', dataIndex: 'full_name', key: 'full_name' },
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
				scroll={{ x: 800 }}
			/>
			<Modal title={isEdit ? 'Sửa Văn Bằng' : 'Thêm Văn Bằng'} visible={visible} onCancel={() => setVisible(false)} footer={null} width={600}>
				<Form form={form} onFinish={handleSave} layout='vertical'>
				<Form.Item label='Sổ Văn Bằng' name='book_id' rules={[{ required: true }]}>
					<Select options={books.map((b: any) => ({ label: `${b.year}`, value: b.id }))} />
				</Form.Item>
				<Form.Item label='Quyết Định' name='graduation_decision_id' rules={[{ required: true }]}>
					<Select options={decisions.map((d: any) => ({ label: d.decision_number, value: d.id }))} />
				</Form.Item>
				<Form.Item label='MSV' name='student_id' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item label='Họ Tên' name='full_name' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item label='Ngày Sinh' name='dob' rules={[{ required: true }]}>
						<Input type='date' />
					</Form.Item>
					{fields.map((f: any) => (
						<Form.Item key={f.id} label={f.field_name} name={['fields', f.field_name]}>
							{f.field_type === 'Date' ? <Input type='date' /> : f.field_type === 'Number' ? <InputNumber /> : <Input />}
						</Form.Item>
					))}
					<Button type='primary' htmlType='submit' block>Lưu</Button>
				</Form>
			</Modal>
		</div>
	);
};
export default CertificateInfo;
