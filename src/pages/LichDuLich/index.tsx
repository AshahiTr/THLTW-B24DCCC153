import { Button, Row, Col, Card, Space, Statistic } from 'antd';
import { useHistory } from 'react-router-dom';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';

const LichDuLichHome: React.FC = () => {
	const history = useHistory();
	const { destinations, itineraries, loadData } = useModel('lichdulich');

	useEffect(() => {
		loadData();
	}, []);

	const totalDestinations = destinations.length;
	const totalItineraries = itineraries.length;
	const totalCost = itineraries.reduce((sum, it) => {
		return sum + it.days.reduce((daySum, day) => daySum + day.totalCost, 0);
	}, 0);

	const features = [
		{
			title: '🌍 Khám Phá Điểm Đến',
			description: 'Duyệt qua các điểm đến phổ biến, lọc theo loại hình, giá cả, đánh giá',
			onClick: () => history.push('/lich-du-lich/destinations'),
			color: '#1890ff',
		},
		{
			title: '📝 Lịch Trình Du Lịch',
			description: 'Tạo lịch trình chi tiết, sắp xếp điểm đến theo ngày, tính toán ngân sách',
			onClick: () => history.push('/lich-du-lich/itinerary'),
			color: '#52c41a',
		},
		{
			title: '💰 Quản Lý Ngân Sách',
			description: 'Theo dõi chi phí, xem biểu đồ phân bổ ngân sách, cảnh báo vượt chi',
			onClick: () => history.push('/lich-du-lich/budget'),
			color: '#faad14',
		},
		{
			title: '📊 Bảng Điều Khiển Quản Trị',
			description: 'Thống kê, quản lý điểm đến, xem doanh thu và các chỉ số quan trọng',
			onClick: () => history.push('/lich-du-lich/admin'),
			color: '#f5222d',
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				{/* Welcome Section */}
				<div style={{ textAlign: 'center', paddingTop: '20px' }}>
					<h1 style={{ fontSize: '36px', marginBottom: '10px' }}>✈️ Lập Kế Hoạch Du Lịch</h1>
					<p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
						Ứng dụng giúp bạn lên kế hoạch du lịch hoàn hảo với quản lý lịch trình, ngân sách và các điểm đến tuyệt đẹp
					</p>
				</div>

				{/* Statistics */}
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<Card hoverable style={{ textAlign: 'center' }}>
							<Statistic
								title='Điểm Đến'
								value={totalDestinations}
								prefix='🌍'
								valueStyle={{ color: '#1890ff' }}
								suffix='địa'
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card hoverable style={{ textAlign: 'center' }}>
							<Statistic
								title='Lịch Trình'
								value={totalItineraries}
								prefix='📝'
								valueStyle={{ color: '#52c41a' }}
								suffix='chuyến'
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card hoverable style={{ textAlign: 'center' }}>
							<Statistic
								title='Ngân Sách'
								value={totalCost}
								prefix='💰'
								suffix='đ'
								valueStyle={{ color: '#faad14' }}
								precision={0}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card hoverable style={{ textAlign: 'center' }}>
							<Statistic
								title='Địa Điểm/Chuyến'
								value={totalItineraries > 0 ? (totalDestinations * totalItineraries / totalItineraries).toFixed(0) : 0}
								prefix='📍'
								valueStyle={{ color: '#13c2c2' }}
								suffix='địa'
							/>
						</Card>
					</Col>
				</Row>

				{/* Features Grid */}
				<div>
					<h2 style={{ marginBottom: '20px' }}>🎯 Các Tính Năng Chính</h2>
					<Row gutter={[16, 16]}>
						{features.map((feature, index) => (
							<Col xs={24} sm={12} md={12} lg={6} key={index}>
								<Card
									hoverable
									style={{
										borderTop: `4px solid ${feature.color}`,
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<div style={{ flex: 1 }}>
										<h3 style={{ marginBottom: '12px', color: feature.color }}>
											{feature.title}
										</h3>
										<p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
											{feature.description}
										</p>
									</div>
									<Button
										type='primary'
										block
										onClick={feature.onClick}
										icon={<ArrowRightOutlined />}
										style={{ marginTop: 'auto' }}
									>
										Truy Cập
									</Button>
								</Card>
							</Col>
						))}
					</Row>
				</div>

				{/* Getting Started */}
				<Card
					title='🚀 Bắt Đầu Nhanh'
					type='inner'
					bordered={false}
					style={{ backgroundColor: '#fafafa' }}
				>
					<ol style={{ lineHeight: '1.8' }}>
						<li>
							<strong>Khởi Tạo Điểm Đến:</strong> Vào "Khám Phá Điểm Đến" để thêm các điểm đến yêu thích của bạn
							{totalDestinations === 0 && <span style={{ color: '#faad14' }}> (Hiện chưa có)</span>}
						</li>
						<li>
							<strong>Tạo Lịch Trình:</strong> Vào "Lịch Trình Du Lịch" để tạo chuyến đi mới
							{totalItineraries === 0 && <span style={{ color: '#faad14' }}> (Hiện chưa có)</span>}
						</li>
						<li>
							<strong>Quản Lý Ngân Sách:</strong> Kiểm tra chi phí và cảnh báo vượt ngân sách
						</li>
						<li>
							<strong>Xem Thống Kê:</strong> Vào "Bảng Điều Khiển Quản Trị" để xem chi tiết thống kê
						</li>
					</ol>
				</Card>

				{/* Features Detail */}
				<Card type='inner' title='📌 Chi Tiết Tính Năng' bordered={false}>
					<Space direction='vertical' style={{ width: '100%' }}>
						<div>
							<h4>🌍 Khám Phá Điểm Đến</h4>
							<ul style={{ margin: 0 }}>
								<li>Hiển thị danh sách điểm đến với hình ảnh, giá cả, đánh giá</li>
								<li>Lọc theo loại hình: Biển, Núi, Thành phố, Nông thôn</li>
								<li>Sắp xếp theo giá cả, đánh giá</li>
								<li>Thêm/chỉnh sửa/xóa điểm đến</li>
								<li>Upload hình ảnh cho mỗi điểm đến</li>
								<li>Thiết lập chi phí: Ăn uống, lưu trú, di chuyển</li>
							</ul>
						</div>
						<div>
							<h4>📝 Lịch Trình Du Lịch</h4>
							<ul style={{ margin: 0 }}>
								<li>Tạo lịch trình với nhiều ngày</li>
								<li>Sắp xếp điểm đến theo thứ tự trong ngày</li>
								<li>Tính toán tổng thời gian và chi phí per ngày</li>
								<li>Thiết lập ngân sách tổng cho chuyến đi</li>
								<li>Theo dõi ghi chú cho từng lịch trình</li>
								<li>Quản lý trạng thái: Bản nháp, Đang lên kế hoạch, Đã xác nhận</li>
							</ul>
						</div>
						<div>
							<h4>💰 Quản Lý Ngân Sách</h4>
							<ul style={{ margin: 0 }}>
								<li>Biểu đồ phân bổ chi phí theo lịch trình</li>
								<li>So sánh ngân sách kế hoạch vs chi phí thực tế</li>
								<li>Cảnh báo khi vượt ngân sách</li>
								<li>Tỷ lệ tiêu thụ ngân sách</li>
								<li>Chi tiết chi phí theo danh mục</li>
							</ul>
						</div>
						<div>
							<h4>📊 Bảng Điều Khiển Quản Trị</h4>
							<ul style={{ margin: 0 }}>
								<li>Thống kê tổng điểm đến, lịch trình, doanh thu</li>
								<li>Top 5 điểm đến được đánh giá cao</li>
								<li>Phân tích điểm đến theo loại hình</li>
								<li>Doanh thu theo danh mục chi phí</li>
								<li>Danh sách tất cả lịch trình và điểm đến</li>
							</ul>
						</div>
					</Space>
				</Card>
			</Space>
		</div>
	);
};

export default LichDuLichHome;
