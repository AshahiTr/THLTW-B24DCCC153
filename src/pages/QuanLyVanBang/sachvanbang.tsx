import { Button, Table, Modal, Form, Input, Select, Space, message } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const CertificateBook: React.FC = () => {
	const model = useModel('QuanLyVanBang.index');
	const { books = [], setBooks, currentRecord, setCurrentRecord, isEdit, setIsEdit, visible, setVisible, getLocalData } = model as any;
	const [form] = Form.useForm();

	useEffect(() => {
		getLocalData();
	}, []);

	const handleSave = async (values: any) => {
		const id = isEdit ? currentRecord?.id : Date.now().toString();
		const newBooks = isEdit 
			? books.map((b: any) => b.id === id ? { ...values, id } : b)
			: [...books, { ...values, id, created_at: new Date().toISOString() }];
		setBooks(newBooks);
		localStorage.setItem('books', JSON.stringify(newBooks));
			message.success('Lưu thành công');
		setVisible(false);
		form.resetFields();
	};

	const handleDelete = (id: string) => {
		const newBooks = books.filter((b: any) => b.id !== id);
		setBooks(newBooks);
		localStorage.setItem('books', JSON.stringify(newBooks));
		message.success('Xóa thành công');
	};

	return (
		<div style={{ padding: 20 }}>
			<Button type='primary' onClick={() => { setIsEdit(false); setCurrentRecord(null); form.resetFields(); setVisible(true); }} style={{ marginBottom: 16 }}>
				Tạo Sổ
			</Button>
			<Table
				dataSource={books}
				columns={[
					{ title: 'Năm', dataIndex: 'year', key: 'year' },
					{ title: 'Trạng Thái', dataIndex: 'status', key: 'status' },
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
			<Modal title={isEdit ? 'Sửa Sổ' : 'Tạo Sổ'} visible={visible} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} onFinish={handleSave} layout='vertical'>
				<Form.Item label='Năm' name='year' rules={[{ required: true }]}>
					<Input type='number' />
				</Form.Item>
				<Form.Item label='Trạng Thái' name='status' initialValue='draft' rules={[{ required: true }]}>
					<Select options={[{ label: 'Nháp', value: 'draft' }, { label: 'Đã Duyệt', value: 'approved' }, { label: 'Công Bố', value: 'published' }]} />
				</Form.Item>
				<Button type='primary' htmlType='submit' block>Lưu</Button>
				</Form>
			</Modal>
		</div>
	);
};
export default CertificateBook;
