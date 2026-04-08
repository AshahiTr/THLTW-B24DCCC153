import { Button, Form, Input, InputNumber, Select, Modal, message, Upload, Row, Col } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

// Simple UUID alternative
const generateId = () => Math.random().toString(36).substr(2, 9);

const DestinationForm: React.FC = () => {
	const [form] = Form.useForm();
	const {
		editingDestination,
		isEditingDestination,
		destinationFormVisible,
		setDestinationFormVisible,
		addOrUpdateDestination,
		setEditingDestination,
		setIsEditingDestination,
	} = useModel('lichdulich');

	const [imageBase64, setImageBase64] = useState<string | undefined>(editingDestination?.image);

	const handleImageUpload = (file: any) => {
		const reader = new FileReader();
		reader.onload = (e: any) => {
			setImageBase64(e.target.result);
		};
		reader.readAsDataURL(file);
		return false;
	};

	const handleSubmit = (values: any) => {
		const destination: LichDuLich.Destination = {
			id: editingDestination?.id || generateId(),
			...values,
			image: imageBase64,
			rating: values.rating || 5,
			createdAt: editingDestination?.createdAt || new Date().toISOString(),
		};

		addOrUpdateDestination(destination);
		message.success(isEditingDestination ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
		handleClose();
	};

	const handleClose = () => {
		form.resetFields();
		setImageBase64(undefined);
		setDestinationFormVisible(false);
		setEditingDestination(undefined);
		setIsEditingDestination(false);
	};

	return (
		<Modal
			title={isEditingDestination ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
			visible={destinationFormVisible}
			onCancel={handleClose}
			footer={null}
			width={700}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={handleSubmit}
				initialValues={editingDestination || {}}
			>
				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Tên điểm đến'
							name='name'
							rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
						>
							<Input placeholder='Vd: Hạ Long' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Loại hình'
							name='type'
							rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}
						>
							<Select
								options={[
									{ value: 'beach', label: '🌊 Biển' },
									{ value: 'mountain', label: '⛰️ Núi' },
									{ value: 'city', label: '🏙️ Thành phố' },
									{ value: 'countryside', label: '🌾 Nông thôn' },
								]}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Tỉnh/Thành phố'
							name='location'
							rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
						>
							<Input placeholder='Vd: Quảng Ninh' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Đánh giá (sao)'
							name='rating'
							rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}
						>
							<InputNumber min={1} max={5} step={0.5} placeholder='Vd: 4.5' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Giá tham quan (đ)'
							name='price'
							rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
						>
							<InputNumber min={0} placeholder='Vd: 100000' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Thời gian tham quan (phút)'
							name='viewingTime'
							rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
						>
							<InputNumber min={0} placeholder='Vd: 120' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item label='Chi phí ăn uống (đ)' name='food'>
							<InputNumber min={0} placeholder='Vd: 50000' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label='Chi phí lưu trú (đ)' name='accommodation'>
							<InputNumber min={0} placeholder='Vd: 200000' />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label='Chi phí di chuyển (đ)' name='transport'>
					<InputNumber min={0} placeholder='Vd: 100000' />
				</Form.Item>

				<Form.Item label='Mô tả' name='description'>
					<Input.TextArea rows={4} placeholder='Mô tả chi tiết về điểm đến' />
				</Form.Item>

				<Form.Item label='Hình ảnh'>
					<Upload
						maxCount={1}
						beforeUpload={handleImageUpload}
						listType='picture-card'
						onRemove={() => setImageBase64(undefined)}
					>
						<div>
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Tải ảnh</div>
						</div>
					</Upload>
				</Form.Item>

				<Form.Item>
					<Button type='primary' htmlType='submit' block>
						{isEditingDestination ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DestinationForm;
