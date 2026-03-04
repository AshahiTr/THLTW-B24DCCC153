import { Button, Form, InputNumber, Select, DatePicker } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const GoalForm = () => {
	const { subjects, goals, updateGoals, selectedItem, isEdit, setVisibleForm, setSelectedItem, setIsEdit } =
		useModel('hocTap');
	const [form] = Form.useForm();

	const handleSubmit = (values: any) => {
		const subject = subjects.find((s) => s.id === values.subjectId);
		const month = values.month.format('YYYY-MM');

		if (isEdit && selectedItem) {
			const newGoals = goals.map((g) =>
				g.id === selectedItem.id
					? {
							...g,
							subjectId: values.subjectId,
							subjectName: subject?.name,
							month,
							targetHours: values.targetHours,
					  }
					: g
			);
			updateGoals(newGoals);
		} else {
			const newGoal: HocTap.MonthlyGoal = {
				id: Date.now().toString(),
				subjectId: values.subjectId,
				subjectName: subject?.name || '',
				month,
				targetHours: values.targetHours,
				createdAt: new Date().toISOString(),
			};
			updateGoals([...goals, newGoal]);
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
							month: moment(selectedItem.month),
							targetHours: selectedItem.targetHours,
					  }
					: {
							month: moment(),
					  }
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
				label='Tháng'
				name='month'
				rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
			>
				<DatePicker picker='month' style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				label='Mục tiêu học (giờ)'
				name='targetHours'
				rules={[{ required: true, message: 'Vui lòng nhập mục tiêu!' }]}
			>
				<InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
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

export default GoalForm;
