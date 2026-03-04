import { Button, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const ProgressForm = () => {
	const { subjects, progress, updateProgress, selectedItem, isEdit, setVisibleForm, setSelectedItem, setIsEdit } =
		useModel('hocTap');
	const [form] = Form.useForm();

	const handleSubmit = (values: any) => {
		const subject = subjects.find((s) => s.id === values.subjectId);
		if (isEdit && selectedItem) {
			const newProgress = progress.map((p) =>
				p.id === selectedItem.id
					? {
							...p,
							subjectId: values.subjectId,
							subjectName: subject?.name,
							date: values.date.toISOString(),
							duration: values.duration,
							content: values.content,
							notes: values.notes || '',
					  }
					: p
			);
			updateProgress(newProgress);
		} else {
			const newRecord: HocTap.LearningProgress = {
				id: Date.now().toString(),
				subjectId: values.subjectId,
				subjectName: subject?.name || '',
				date: values.date.toISOString(),
				duration: values.duration,
				content: values.content,
				notes: values.notes || '',
				createdAt: new Date().toISOString(),
			};
			updateProgress([...progress, newRecord]);
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
			initialValues={
				isEdit && selectedItem
					? {
							subjectId: selectedItem.subjectId,
							date: moment(selectedItem.date),
							duration: selectedItem.duration,
							content: selectedItem.content,
							notes: selectedItem.notes,
					  }
					: {}
			}
			onFinish={handleSubmit}
		>
			<Form.Item
				label='Môn học'
				name='subjectId'
				rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
			>
				<Select
					placeholder='Chọn môn học'
					options={subjects.map((s) => ({ value: s.id, label: s.name }))}
				/>
			</Form.Item>
			<Form.Item
				label='Ngày học'
				name='date'
				rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
			>
				<DatePicker style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				label='Thời lượng (giờ)'
				name='duration'
				rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
			>
				<InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				label='Nội dung đã học'
				name='content'
				rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
			>
				<Input.TextArea rows={3} placeholder='Nhập nội dung đã học' />
			</Form.Item>
			<Form.Item label='Ghi chú' name='notes'>
				<Input.TextArea rows={2} placeholder='Ghi chú (tùy chọn)' />
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

export default ProgressForm;
