import { Button, Space, Table, Empty, Tag, Popconfirm, message, Row, Col, Card, Statistic, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import ItineraryForm from './ItineraryForm';
import dayjs from 'dayjs';

const ItineraryList: React.FC = () => {
	const {
		itineraries,
		setCurrentItinerary,
		setItineraryFormVisible,
		deleteItinerary,
		loadData,
	} = useModel('lichdulich');

	const [selectedItinerary, setSelectedItinerary] = useState<LichDuLich.Itinerary | null>(null);
	const [drawerVisible, setDrawerVisible] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const handleAddNew = () => {
		setCurrentItinerary(undefined);
		setItineraryFormVisible(true);
	};

	const handleEdit = (record: LichDuLich.Itinerary) => {
		setCurrentItinerary(record);
		setItineraryFormVisible(true);
	};

	const handleDelete = (id: string) => {
		deleteItinerary(id);
		message.success('Xóa thành công!');
	};

	const handleView = (record: LichDuLich.Itinerary) => {
		setSelectedItinerary(record);
		setDrawerVisible(true);
	};

	const statusMap: Record<string, any> = {
		draft: { color: 'default', label: 'Bản nháp' },
		planning: { color: 'processing', label: 'Đang lên kế hoạch' },
		confirmed: { color: 'success', label: 'Đã xác nhận' },
	};

	const columns = [
		{
			title: 'Tên Lịch Trình',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <strong>{text}</strong>,
			responsive: ['md'] as any,
		},
		{
			title: 'Thời Gian',
			dataIndex: 'startDate',
			key: 'duration',
			render: (_, record: LichDuLich.Itinerary) => (
				<>
					{dayjs(record.startDate).format('DD/MM')} - {dayjs(record.endDate).format('DD/MM')}
					<br />
					<span style={{ fontSize: '12px', color: '#999' }}>
						({record.days.length} ngày)
					</span>
				</>
			),
		},
		{
			title: 'Ngân Sách',
			dataIndex: 'budget',
			key: 'budget',
			render: (budget: number) => <span>{budget.toLocaleString()}đ</span>,
			responsive: ['md'] as any,
		},
		{
			title: 'Điểm Đến',
			dataIndex: 'days',
			key: 'destinations',
			render: (days: LichDuLich.ItineraryDay[]) => {
				const total = days.reduce((sum, day) => sum + day.destinations.length, 0);
				return <Tag color='blue'>{total} địa điểm</Tag>;
			},
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				const info = statusMap[status];
				return <Tag color={info.color}>{info.label}</Tag>;
			},
		},
		{
			title: 'Hành Động',
			key: 'action',
			render: (_, record: LichDuLich.Itinerary) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EyeOutlined />}
						onClick={() => handleView(record)}
					>
						Xem
					</Button>
					<Button
						icon={<EditOutlined />}
						size='small'
						onClick={() => handleEdit(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa lịch trình'
						description='Bạn có chắc chắn muốn xóa lịch trình này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger size='small' icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const totalSpent = itineraries.reduce((sum, it) => {
		return sum + it.days.reduce((daySum, day) => daySum + day.totalCost, 0);
	}, 0);

	const totalDestinations = itineraries.reduce((sum, it) => {
		return sum + it.days.reduce((daySum, day) => daySum + day.destinations.length, 0);
	}, 0);

	return (
		<div style={{ padding: '20px' }}>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				{/* Header */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
					<h1 style={{ marginBottom: 0 }}>📝 Lịch Trình Du Lịch</h1>
					<Button type='primary' size='large' icon={<PlusOutlined />} onClick={handleAddNew}>
						Tạo Lịch Trình
					</Button>
				</div>

				{/* Statistics */}
				<Row gutter={[16, 16]}>
					<Col xs={12} sm={12} md={6}>
						<Card>
							<Statistic
								title='Số Lịch Trình'
								value={itineraries.length}
								prefix='📋'
								valueStyle={{ color: '#1890ff' }}
							/>
						</Card>
					</Col>
					<Col xs={12} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Địa Điểm'
								value={totalDestinations}
								prefix='📍'
								valueStyle={{ color: '#52c41a' }}
							/>
						</Card>
					</Col>
					<Col xs={12} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Chi Phí'
								value={totalSpent}
								prefix='💰'
								suffix='đ'
								valueStyle={{ color: '#faad14' }}
								precision={0}
							/>
						</Card>
					</Col>
					<Col xs={12} sm={12} md={6}>
						<Card>
							<Statistic
								title='Trung Bình'
								value={itineraries.length > 0 ? totalSpent / itineraries.length : 0}
								prefix='📊'
								suffix='đ'
								valueStyle={{ color: '#ff4d4f' }}
								precision={0}
							/>
						</Card>
					</Col>
				</Row>

				{/* Table */}
				{itineraries.length === 0 ? (
					<Empty description='Chưa có lịch trình nào' />
				) : (
					<Table
						dataSource={itineraries}
						columns={columns}
						rowKey='id'
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showTotal: (total) => `Tổng ${total} lịch trình`,
						}}
						scroll={{ x: 900 }}
					/>
				)}
			</Space>

			{/* Detail Drawer */}
			<Drawer
				title='Chi Tiết Lịch Trình'
				placement='right'
				onClose={() => setDrawerVisible(false)}
				visible={drawerVisible}
				width={600}
			>
				{selectedItinerary && (
					<Space direction='vertical' style={{ width: '100%' }} size='large'>
						<div>
							<label style={{ color: '#666', fontSize: '12px' }}>Tên Lịch Trình</label>
							<p style={{ marginBottom: 0, fontSize: '16px', fontWeight: 'bold' }}>
								{selectedItinerary.name}
							</p>
						</div>

						<Row gutter={16}>
							<Col span={12}>
								<label style={{ color: '#666', fontSize: '12px' }}>Ngày Bắt Đầu</label>
								<p style={{ marginBottom: 0 }}>
									{dayjs(selectedItinerary.startDate).format('DD/MM/YYYY')}
								</p>
							</Col>
							<Col span={12}>
								<label style={{ color: '#666', fontSize: '12px' }}>Ngày Kết Thúc</label>
								<p style={{ marginBottom: 0 }}>
									{dayjs(selectedItinerary.endDate).format('DD/MM/YYYY')}
								</p>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<label style={{ color: '#666', fontSize: '12px' }}>Ngân Sách</label>
								<p style={{ marginBottom: 0, color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
									{selectedItinerary.budget.toLocaleString()}đ
								</p>
							</Col>
							<Col span={12}>
								<label style={{ color: '#666', fontSize: '12px' }}>Trạng Thái</label>
								<p style={{ marginBottom: 0 }}>
									<Tag color={statusMap[selectedItinerary.status].color}>
										{statusMap[selectedItinerary.status].label}
									</Tag>
								</p>
							</Col>
						</Row>

						{selectedItinerary.notes && (
							<div>
								<label style={{ color: '#666', fontSize: '12px' }}>Ghi Chú</label>
								<p style={{ marginBottom: 0 }}>{selectedItinerary.notes}</p>
							</div>
						)}

						<div>
							<h4>📅 Chi Tiết Theo Ngày</h4>
							<Space direction='vertical' style={{ width: '100%' }} size='small'>
								{selectedItinerary.days.map((day) => (
									<Card key={day.dayNumber} size='small' title={`Ngày ${day.dayNumber}`}>
										<Space direction='vertical' size='small' style={{ width: '100%' }}>
											{day.destinations.map((dest, index) => (
												<div key={index} style={{ paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
													<p style={{ marginBottom: 4 }}>
														<strong>{dest.name}</strong> ({dest.location})
													</p>
													<p style={{ marginBottom: 0, fontSize: '12px', color: '#666' }}>
														⏱️ {dest.viewingTime} phút | 💰 {dest.price.toLocaleString()}đ
													</p>
												</div>
											))}
											<div style={{ paddingTop: '8px', fontWeight: 'bold' }}>
												Tổng: {day.totalTime} phút | {day.totalCost.toLocaleString()}đ
											</div>
										</Space>
									</Card>
								))}
							</Space>
						</div>
					</Space>
				)}
			</Drawer>

			<ItineraryForm />
		</div>
	);
};

export default ItineraryList;
