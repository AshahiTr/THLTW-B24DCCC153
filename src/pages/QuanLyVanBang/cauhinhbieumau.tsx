import { Button, Table, Modal, Form, Input, Select, Space, message } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const FormFieldConfig: React.FC = () => {
	const model = useModel('QuanLyVanBang.index');
	const { fields = [], setFields, currentRecord, setCurrentRecord, isEdit, setIsEdit, visible, setVisible, getLocalData } = model as any;
	const [form] = Form.useForm();

	useEffect(() => {
		getLocalData();
	}, []);

	const handleSave = async (values: any) => {
		const id = isEdit ? currentRecord?.id : Date.now().toString();
		const newFields = isEdit
			? fields.map((f: any) => f.id === id ? { ...values, id } : f)
			: [...fields, { ...values, id, created_at: new Date().toISOString() }];
		setFields(newFields);
		localStorage.setItem('fields', JSON.stringify(newFields));
			message.success('Lưu thành công');
		setVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newFields = fields.filter((f: any) => f.id !== id);
		setFields(newFields);
		localStorage.setItem('fields', JSON.stringify(newFields));
	};

	return (
		<div style={{ padding: 20 }}>
			<Button type='primary' onClick={() => { setIsEdit(false); setCurrentRecord(null); form.resetFields(); setVisible(true); }} style={{ marginBottom: 16 }}>
				Thêm Trường
			</Button>
			<Table
				dataSource={fields}
				columns={[
				{ title: 'Tên Trường', dataIndex: 'field_name', key: 'field_name' },
				{ title: 'Kiểu Dữ Liệu', dataIndex: 'field_type', key: 'field_type' },
				{ title: 'Bắt Buộc', dataIndex: 'is_required', key: 'is_required', render: (val) => val ? 'Có' : 'Không' },
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
			<Modal title={isEdit ? 'Sửa Trường' : 'Thêm Trường'} visible={visible} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} onFinish={handleSave} layout='vertical'>
				<Form.Item label='Tên Trường' name='field_name' rules={[{ required: true }]}>
					<Input placeholder='VD: Dân tộc, Nơi sinh' />
				</Form.Item>
				<Form.Item label='Kiểu Dữ Liệu' name='field_type' initialValue='String' rules={[{ required: true }]}>
					<Select options={[{ label: 'Văn Bản', value: 'String' }, { label: 'Số', value: 'Number' }, { label: 'Ngày', value: 'Date' }]} />
				</Form.Item>
				<Form.Item name='is_required' valuePropName='checked'>
					<input type='checkbox' /> Bắt Buộc
				</Form.Item>
				<Button type='primary' htmlType='submit' block>Lưu</Button>
				</Form>
			</Modal>
		</div>
	);
};
export default FormFieldConfig;
