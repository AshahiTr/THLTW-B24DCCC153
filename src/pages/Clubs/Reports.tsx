import { Card, Row, Col, Statistic, Empty } from 'antd';
import { useModel } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import { type DataChartType } from '@/components/Chart';

const Reports: React.FC = () => {
	const { clubs, applications, members } = useModel('clubs');

	const totalClubs = clubs.length;
	const totalApplications = applications.length;
	const pendingApps = applications.filter((a: any) => a.status === 'Pending').length;
	const approvedApps = applications.filter((a: any) => a.status === 'Approved').length;
	const rejectedApps = applications.filter((a: any) => a.status === 'Rejected').length;
	const totalMembers = members.length;

	// Prepare data for ColumnChart
	const clubNames = clubs.map((c: any) => c.name);
	const pendingData = clubs.map((c: any) => applications.filter((a: any) => a.clubId === c.id && a.status === 'Pending').length);
	const approvedData = clubs.map((c: any) => applications.filter((a: any) => a.clubId === c.id && a.status === 'Approved').length);
	const rejectedData = clubs.map((c: any) => applications.filter((a: any) => a.clubId === c.id && a.status === 'Rejected').length);

	const chartData: DataChartType = {
		title: 'Số Đơn Đăng Ký Theo Câu Lạc Bộ',
		xAxis: clubNames,
		yAxis: [pendingData, approvedData, rejectedData],
		yLabel: ['Pending', 'Approved', 'Rejected'],
		height: 400,
		colors: ['#faad14', '#52c41a', '#f5222d'],
	};

	return (
		<div>
			<Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
				<Col xs={12} sm={8} md={6}>
					<Card>
						<Statistic title='Tổng Câu Lạc Bộ' value={totalClubs} />
					</Card>
				</Col>
				<Col xs={12} sm={8} md={6}>
					<Card>
						<Statistic title='Tổng Đơn Đăng Ký' value={totalApplications} />
					</Card>
				</Col>
				<Col xs={12} sm={8} md={6}>
					<Card>
						<Statistic 
							title='Đơn Pending' 
							value={pendingApps} 
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={8} md={6}>
					<Card>
						<Statistic 
							title='Đơn Approved' 
							value={approvedApps}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={8} md={6}>
					<Card>
						<Statistic 
							title='Đơn Rejected' 
							value={rejectedApps}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={8} md={6}>
					<Card>
						<Statistic title='Tổng Thành Viên' value={totalMembers} />
					</Card>
				</Col>
			</Row>

			<Card title='Biểu Đồ Số Đơn Đăng Ký Theo Các Câu Lạc Bộ'>
				{clubs.length === 0 ? (
					<Empty description='Chưa có câu lạc bộ nào' />
				) : (
					<ColumnChart {...chartData} />
				)}
			</Card>

			<Card 
				title='Thống Kê Chi Tiết' 
				style={{ marginTop: 20 }}
			>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
							<th style={{ padding: '12px', textAlign: 'left' }}>Câu Lạc Bộ</th>
							<th style={{ padding: '12px', textAlign: 'center' }}>Pending</th>
							<th style={{ padding: '12px', textAlign: 'center' }}>Approved</th>
							<th style={{ padding: '12px', textAlign: 'center' }}>Rejected</th>
							<th style={{ padding: '12px', textAlign: 'center' }}>Tổng Đơn</th>
							<th style={{ padding: '12px', textAlign: 'center' }}>Tổng Thành Viên</th>
						</tr>
					</thead>
					<tbody>
						{clubs.map((club: any) => (
							<tr key={club.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
								<td style={{ padding: '12px' }}><strong>{club.name}</strong></td>
								<td style={{ padding: '12px', textAlign: 'center', color: '#faad14' }}>
									{applications.filter((a: any) => a.clubId === club.id && a.status === 'Pending').length}
								</td>
								<td style={{ padding: '12px', textAlign: 'center', color: '#52c41a' }}>
									{applications.filter((a: any) => a.clubId === club.id && a.status === 'Approved').length}
								</td>
								<td style={{ padding: '12px', textAlign: 'center', color: '#f5222d' }}>
									{applications.filter((a: any) => a.clubId === club.id && a.status === 'Rejected').length}
								</td>
								<td style={{ padding: '12px', textAlign: 'center' }}>
									{applications.filter((a: any) => a.clubId === club.id).length}
								</td>
								<td style={{ padding: '12px', textAlign: 'center' }}>
									{members.filter((m: any) => m.clubId === club.id).length}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Card>
		</div>
	);
};

export default Reports;
