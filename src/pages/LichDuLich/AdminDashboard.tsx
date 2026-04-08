import { Card, Row, Col, Statistic, Table, Empty, Space } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const AdminDashboard: React.FC = () => {
	const { getStatistics, loadData, destinations, itineraries } = useModel('lichdulich');
	const [stats, setStats] = useState<LichDuLich.Statistics | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		loadData();
		const statistics = getStatistics();
		setStats(statistics);
		setLoading(false);
	}, []);

	if (loading || !stats) {
		return <Empty description='Loading...' />;
	}

	// Icon mapping for destination types
	const typeMap: Record<string, string> = {
		beach: '🌊 Biển',
		mountain: '⛰️ Núi',
		city: '🏙️ Thành phố',
		countryside: '🌾 Nông thôn',
	};

	// Prepare chart data for destinations by type
	const typeChartOptions = {
		chart: {
			type: 'bar',
		},
		colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
		plotOptions: {
			bar: {
				horizontal: true,
				columnWidth: '55%',
			},
		},
		dataLabels: {
			enabled: true,
		},
		xaxis: {
			categories: Object.keys(stats.populationByType).map((key) => typeMap[key] || key),
		},
	};

	const typeChartSeries = [
		{
			name: 'Số Lượng',
			data: Object.values(stats.populationByType),
		},
	];

	// Prepare chart data for revenue by category
	const revenueChartOptions = {
		labels: Object.keys(stats.revenueByCategory).map((key) => {
			const categoryMap: Record<string, string> = {
				food: '🍽️ Ăn Uống',
				accommodation: '🛏️ Lưu Trú',
				transport: '🚗 Di Chuyển',
				activity: '🎯 Hoạt Động',
				other: 'Khác',
			};
			return categoryMap[key] || key;
		}),
		colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2'],
	};

	const revenueChartSeries = Object.values(stats.revenueByCategory);

	// Top destinations table
	const topDestinationsColumns = [
		{
			title: 'Tên Điểm Đến',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Loại Hình',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => <span>{typeMap[type] || type}</span>,
		},
		{
			title: 'Địa Điểm',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Đánh Giá',
			dataIndex: 'rating',
			key: 'rating',
			render: (rating: number) => (
				<span>
					{'⭐'.repeat(Math.floor(rating))} {rating.toFixed(1)}
				</span>
			),
		},
		{
			title: 'Giá Tham Quan',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{price.toLocaleString()}đ</span>,
		},
	];

	// Itinerary statistics table
	const itineraryColumns = [
		{
			title: 'Tên Lịch Trình',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Số Ngày',
			dataIndex: 'days',
			key: 'days',
			render: (days: LichDuLich.ItineraryDay[]) => <span>{days.length}</span>,
		},
		{
			title: 'Tổng Địa Điểm',
			key: 'totalDestinations',
			render: (_, record: LichDuLich.Itinerary) => (
				<span>{record.days.reduce((sum, day) => sum + day.destinations.length, 0)}</span>
			),
		},
		{
			title: 'Ngân Sách',
			dataIndex: 'budget',
			key: 'budget',
			render: (budget: number) => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{budget.toLocaleString()}đ</span>,
		},
		{
			title: 'Chi Phí Thực Tế',
			key: 'spent',
					render: (_: any, record: LichDuLich.Itinerary) => {
				const spent = record.days.reduce((sum, day) => sum + day.totalCost, 0);
				return <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{spent.toLocaleString()}đ</span>;
			},
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				const statusMap: Record<string, string> = {
					draft: 'Bản Nháp',
					planning: 'Đang Lên Kế Hoạch',
					confirmed: 'Đã Xác Nhận',
				};
				return <span>{statusMap[status] || status}</span>;
			},
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				<h1>📊 Bảng Điều Khiển Quản Trị</h1>

				{/* Top Statistics */}
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Điểm Đến'
								value={stats.totalDestinations}
								prefix='📍'
								valueStyle={{ color: '#1890ff' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Lịch Trình'
								value={stats.totalItineraries}
								prefix='📋'
								valueStyle={{ color: '#52c41a' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Doanh Thu'
								value={stats.totalRevenue}
								prefix='💰'
								suffix='đ'
								valueStyle={{ color: '#faad14' }}
								precision={0}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Doanh Thu Trung Bình'
								value={stats.totalItineraries > 0 ? stats.totalRevenue / stats.totalItineraries : 0}
								prefix='📊'
								suffix='đ'
								valueStyle={{ color: '#f5222d' }}
								precision={0}
							/>
						</Card>
					</Col>
				</Row>

				{/* Charts */}
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<Card title='📍 Quan Điểm Đến Theo Loại Hình' bordered={false}>
							<Chart
								options={typeChartOptions}
								series={typeChartSeries}
								type='bar'
								height={300}
							/>
						</Card>
					</Col>
					<Col xs={24} lg={12}>
						<Card title='💰 Doanh Thu Theo Danh Mục' bordered={false}>
							<Chart
								options={revenueChartOptions}
								series={revenueChartSeries}
								type='donut'
								height={300}
							/>
						</Card>
					</Col>
				</Row>

				{/* Top Destinations */}
				<Card title='⭐ Top 5 Điểm Đến Được Đánh Giá Cao Nhất' bordered={false}>
					{stats.topDestinations.length === 0 ? (
						<Empty description='Chưa có điểm đến nào' />
					) : (
						<Table
							dataSource={stats.topDestinations}
							columns={topDestinationsColumns}
							rowKey='id'
							pagination={false}
							scroll={{ x: 900 }}
						/>
					)}
				</Card>

				{/* Itinerary Statistics */}
				<Card title='📝 Danh Sách Lịch Trình' bordered={false}>
					{itineraries.length === 0 ? (
						<Empty description='Chưa có lịch trình nào' />
					) : (
						<Table
							dataSource={itineraries}
							columns={itineraryColumns}
							rowKey='id'
							pagination={{ pageSize: 10, showSizeChanger: true }}
							scroll={{ x: 1000 }}
						/>
					)}
				</Card>

				{/* Destination Management Summary */}
				<Card title='📊 Tóm Tắt Quản Lý Điểm Đến' bordered={false}>
					<Row gutter={[16, 16]}>
						<Col xs={12} sm={6}>
							<Card size='small' bordered={false} style={{ textAlign: 'center' }}>
								<Statistic
									title='🌊 Biển'
									value={stats.populationByType.beach || 0}
									valueStyle={{ color: '#1890ff' }}
								/>
							</Card>
						</Col>
						<Col xs={12} sm={6}>
							<Card size='small' bordered={false} style={{ textAlign: 'center' }}>
								<Statistic
									title='⛰️ Núi'
									value={stats.populationByType.mountain || 0}
									valueStyle={{ color: '#52c41a' }}
								/>
							</Card>
						</Col>
						<Col xs={12} sm={6}>
							<Card size='small' bordered={false} style={{ textAlign: 'center' }}>
								<Statistic
									title='🏙️ Thành Phố'
									value={stats.populationByType.city || 0}
									valueStyle={{ color: '#faad14' }}
								/>
							</Card>
						</Col>
						<Col xs={12} sm={6}>
							<Card size='small' bordered={false} style={{ textAlign: 'center' }}>
								<Statistic
									title='🌾 Nông Thôn'
									value={stats.populationByType.countryside || 0}
									valueStyle={{ color: '#13c2c2' }}
								/>
							</Card>
						</Col>
					</Row>
				</Card>

				{/* All Destinations Table */}
				<Card title='📍 Danh Sách Tất Cả Điểm Đến' bordered={false}>
					{destinations.length === 0 ? (
						<Empty description='Chưa có điểm đến nào' />
					) : (
						<Table
							dataSource={destinations}
							columns={[
								{
									title: 'Tên',
									dataIndex: 'name',
									key: 'name',
									render: (text: string) => <strong>{text}</strong>,
								},
								{
									title: 'Loại',
									dataIndex: 'type',
									key: 'type',
									render: (type: string) => <span>{typeMap[type] || type}</span>,
								},
								{
									title: 'Địa Điểm',
									dataIndex: 'location',
									key: 'location',
								},
								{
									title: 'Đánh Giá',
									dataIndex: 'rating',
									key: 'rating',
									render: (rating: number) => (
										<span>
											{rating >= 4.5 && '⭐⭐⭐⭐⭐'} {rating >= 4 && rating < 4.5 && '⭐⭐⭐⭐'}
											{rating >= 3 && rating < 4 && '⭐⭐⭐'} {rating < 3 && '⭐⭐'} {rating.toFixed(1)}
										</span>
									),
								},
								{
									title: 'Giá',
									dataIndex: 'price',
									key: 'price',
									render: (price: number) => <span style={{ color: '#52c41a' }}>{price.toLocaleString()}đ</span>,
								},
							]}
							rowKey='id'
							pagination={{ pageSize: 10, showSizeChanger: true }}
							scroll={{ x: 900 }}
						/>
					)}
				</Card>
			</Space>
		</div>
	);
};

export default AdminDashboard;
