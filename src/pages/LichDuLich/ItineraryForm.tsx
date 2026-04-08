import { Button, Form, Input, InputNumber, Select, DatePicker, Modal, message, Card, Space, Row, Col, Table, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { useState, useEffect } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Simple UUID alternative
const generateId = () => Math.random().toString(36).substr(2, 9);

const ItineraryForm: React.FC = () => {
	const [form] = Form.useForm();
	const {
		itineraryFormVisible,
		setItineraryFormVisible,
		currentItinerary,
		setCurrentItinerary,
		addOrUpdateItinerary,
		destinations,
		addOrUpdateBudget,
	} = useModel('lichdulich');

	const [days, setDays] = useState<LichDuLich.ItineraryDay[]>([]);
	const [selectedDestinations, setSelectedDestinations] = useState<Record<number, string[]>>({});

	useEffect(() => {
		if (currentItinerary) {
			form.setFieldsValue({
				name: currentItinerary.name,
				budget: currentItinerary.budget,
				startDate: dayjs(currentItinerary.startDate),
				endDate: dayjs(currentItinerary.endDate),
				notes: currentItinerary.notes,
			});
			setDays(currentItinerary.days);
		} else {
			form.resetFields();
			setDays([]);
			setSelectedDestinations({});
		}
	}, [currentItinerary, form]);

	const handleAddDay = () => {
		const newDay: LichDuLich.ItineraryDay = {
			dayNumber: days.length + 1,
			destinations: [],
			totalTime: 0,
			totalCost: 0,
		};
		setDays([...days, newDay]);
		setSelectedDestinations({ ...selectedDestinations, [days.length]: [] });
	};

	const handleAddDestinationToDay = (dayIndex: number, destinationId: string) => {
		const destination = destinations.find((d) => d.id === destinationId);
		if (destination) {
			const newDays = [...days];
			newDays[dayIndex].destinations.push(destination);
			newDays[dayIndex].totalTime += destination.viewingTime;
			newDays[dayIndex].totalCost +=
				destination.price + (destination.food || 0) + (destination.accommodation || 0) + (destination.transport || 0);
			setDays(newDays);
		}
	};

	const handleRemoveDestinationFromDay = (dayIndex: number, destIndex: number) => {
		const newDays = [...days];
		const dest = newDays[dayIndex].destinations[destIndex];
		newDays[dayIndex].totalTime -= dest.viewingTime;
		newDays[dayIndex].totalCost -=
			dest.price + (dest.food || 0) + (dest.accommodation || 0) + (dest.transport || 0);
		newDays[dayIndex].destinations.splice(destIndex, 1);
		setDays(newDays);
	};

	const handleRemoveDay = (dayIndex: number) => {
		const newDays = days.filter((_, index) => index !== dayIndex);
		newDays.forEach((day, index) => {
			day.dayNumber = index + 1;
		});
		setDays(newDays);
	};

	const handleSubmit = (values: any) => {
		if (days.length === 0) {
			message.error('Vui lòng thêm ít nhất 1 ngày lịch trình!');
			return;
		}

		const totalCost = days.reduce((sum, day) => sum + day.totalCost, 0);
		const itinerary: LichDuLich.Itinerary = {
			id: currentItinerary?.id || generateId(),
			name: values.name,
			startDate: values.startDate.format('YYYY-MM-DD'),
			endDate: values.endDate.format('YYYY-MM-DD'),
			budget: values.budget,
			days: days.map((day) => ({
				...day,
				date: dayjs(values.startDate).add(day.dayNumber - 1, 'day').format('YYYY-MM-DD'),
			})),
			status: currentItinerary?.status || 'draft',
			notes: values.notes,
			createdAt: currentItinerary?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		addOrUpdateItinerary(itinerary);

		// Create budget record
		const budget: LichDuLich.Budget = {
			itineraryId: itinerary.id,
			totalBudget: values.budget,
			spent: totalCost,
			categories: [
				{
					category: 'activity',
					spent: totalCost,
					planned: values.budget,
					percentage: (totalCost / values.budget) * 100,
				},
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		addOrUpdateBudget(budget);

		message.success(currentItinerary ? 'Cập nhật thành công!' : 'Tạo lịch trình thành công!');
		handleClose();
	};

	const handleClose = () => {
		form.resetFields();
		setDays([]);
		setSelectedDestinations({});
		setCurrentItinerary(undefined);
		setItineraryFormVisible(false);
	};

	return (
		<Modal
			title={currentItinerary ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình du lịch'}
			visible={itineraryFormVisible}
			onCancel={handleClose}
			footer={null}
			width={900}
			style={{ maxHeight: '90vh', overflow: 'auto' }}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Tên lịch trình'
							name='name'
							rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
						>
							<Input placeholder='Vd: Chuyến đi Hạ Long 3 ngày' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Ngân sách (đ)'
							name='budget'
							rules={[{ required: true, message: 'Vui lòng nhập ngân sách!' }]}
						>
							<InputNumber min={0} placeholder='Vd: 5000000' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Ngày bắt đầu'
							name='startDate'
							rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
						>
							<DatePicker style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Ngày kết thúc'
							name='endDate'
							rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
						>
							<DatePicker style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label='Ghi chú' name='notes'>
					<Input.TextArea rows={2} placeholder='Ghi chú về chuyến đi' />
				</Form.Item>

				{/* Days Section */}
				<div style={{ marginTop: '24px' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
						<h3 style={{ marginBottom: 0 }}>📅 Lịch Trình Theo Ngày ({days.length})</h3>
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAddDay}>
							Thêm Ngày
						</Button>
					</div>

					<Space direction='vertical' style={{ width: '100%' }} size='middle'>
						{days.map((day, dayIndex) => (
							<Card
								key={dayIndex}
								size='small'
								title={`Ngày ${day.dayNumber}`}
								extra={
									<Popconfirm
										title='Xóa ngày'
										description='Bạn có chắc chắn muốn xóa ngày này?'
										onConfirm={() => handleRemoveDay(dayIndex)}
										okText='Có'
										cancelText='Không'
									>
										<Button danger size='small' icon={<DeleteOutlined />} />
									</Popconfirm>
								}
							>
								<Space direction='vertical' style={{ width: '100%' }} size='small'>
									{/* Destination selector */}
									<div>
										<label style={{ marginBottom: '8px', display: 'block' }}>Chọn điểm đến:</label>
										<Select
											style={{ width: '100%' }}
											placeholder='Chọn điểm đến'
											options={destinations
												.filter(
													(d) =>
														!day.destinations.some((dest) => dest.id === d.id)
												)
												.map((d) => ({
													value: d.id,
													label: `${d.name} (${d.location}) - ${d.price.toLocaleString()}đ`,
												}))}
											onChange={(value) => handleAddDestinationToDay(dayIndex, value)}
										/>
									</div>

									{/* Destinations list */}
									{day.destinations.length > 0 && (
										<Table
											size='small'
											pagination={false}
											columns={[
												{
													title: 'Điểm Đến',
													dataIndex: 'name',
													key: 'name',
												},
												{
													title: 'Thời Gian',
													dataIndex: 'viewingTime',
													key: 'viewingTime',
													render: (time) => `${time} phút`,
												},
												{
													title: 'Giá',
													dataIndex: 'price',
													key: 'price',
													render: (price) => price.toLocaleString() + 'đ',
												},
												{
													title: 'Hành Động',
													key: 'action',
													render: (_, record, index) => (
														<Button
															danger
															size='small'
															icon={<DeleteOutlined />}
															onClick={() => handleRemoveDestinationFromDay(dayIndex, index)}
														/>
													),
												},
											]}
											dataSource={day.destinations}
											rowKey={(_, index: any) => `${dayIndex}-${index}`}
										/>
									)}

									{/* Summary */}
									<div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
										⏱️ Tổng thời gian: <strong>{day.totalTime}</strong> phút | 💰 Tổng chi phí:{' '}
										<strong>{day.totalCost.toLocaleString()}</strong>đ
									</div>
								</Space>
							</Card>
						))}
					</Space>
				</div>

				<Form.Item style={{ marginTop: '24px' }}>
					<Button type='primary' htmlType='submit' block>
						{currentItinerary ? 'Cập nhật' : 'Tạo lịch trình'}
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ItineraryForm;
