import { Button, Input, Form } from 'antd';
import { useModel } from 'umi';

const SubjectForm = () => {
	const { subjects, updateSubjects, selectedItem, isEdit, setVisibleForm, setSelectedItem, setIsEdit } =
		useModel('hocTap');
	const [form] = Form.useForm();

	const handleSubmit = (values: any) => {
		if (isEdit && selectedItem) {
			const newSubjects = subjects.map((s) =>
				s.id === selectedItem.id ? { ...s, name: values.name } : s
			);
			updateSubjects(newSubjects);
		} else {
			const newSubject: HocTap.Subject = {
				id: Date.now().toString(),
				name: values.name,
				createdAt: new Date().toISOString(),
			};
			updateSubjects([...subjects, newSubject]);
		}
		setVisibleForm(false);
		setSelectedItem(null);
		setIsEdit(false);
		form.resetFields();
	};

	return (
		<Form
			form={form}
			labelCol={{ span: 24 }}
			initialValues={isEdit && selectedItem ? { name: selectedItem.name } : {}}
			onFinish={handleSubmit}
		>
			<Form.Item
				label='Tên môn học'
				name='name'
				rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
			>
				<Input placeholder='Nhập tên môn học' />
			</Form.Item>
			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default SubjectForm;
