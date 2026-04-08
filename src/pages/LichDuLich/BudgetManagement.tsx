import { Card, Empty, Row, Col, Statistic, Alert, Progress, Space, Table } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const BudgetManagement: React.FC = () => {
	const { itineraries, budgets, loadData } = useModel('lichdulich');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		loadData();
		setLoading(false);
	}, []);

	if (loading || itineraries.length === 0) {
		return (
			<div style={{ padding: '20px' }}>
				<h1>💰 Quản Lý Ngân Sách</h1>
				<Empty description='Chưa có lịch trình nào để hiển thị ngân sách' style={{ marginTop: '40px' }} />
			</div>
		);
	}

	// Calculate total statistics
	const totalBudget = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
	const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
	const percentageSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
	const remaining = totalBudget - totalSpent;

	// Prepare data for pie chart (Budget by itinerary)
	const itineraryBudgetData = itineraries.map((it) => {
		const totalCost = it.days.reduce((sum, day) => sum + day.totalCost, 0);
		return {
			name: it.name,
			value: totalCost,
			budget: it.budget,
		};
	});

	const pieChartOptions = {
		labels: itineraryBudgetData.map((d) => d.name),
		colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2', '#eb2f96'],
	};

	const pieChartSeries = itineraryBudgetData.map((d) => d.value);

	// Prepare data for bar chart (Budget vs Spent by itinerary)
	const barChartOptions = {
		chart: {
			type: 'bar',
			stacked: false,
		},
		colors: ['#1890ff', '#52c41a'],
		plotOptions: {
			bar: {
				columnWidth: '55%',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		tooltip: {
			y: {
				formatter: (val: number) => val.toLocaleString() + 'đ',
			},
		},
		xaxis: {
			categories: itineraryBudgetData.map((d) => d.name.substring(0, 15)),
		},
		yaxis: {
			title: {
				text: 'Chi Phí (đ)',
			},
		},
	};

	const barChartSeries = [
		{
			name: 'Ngân Sách',
			data: itineraryBudgetData.map((d) => d.budget),
		},
		{
			name: 'Đã Chi',
			data: itineraryBudgetData.map((d) => d.value),
		},
	];

	// Alerts for overspending
	const alerts = budgets
		.filter((b) => b.spent > b.totalBudget)
		.map((b) => {
			const itinerary = itineraries.find((i) => i.id === b.itineraryId);
			return {
				id: b.itineraryId,
				name: itinerary?.name || 'Unknown',
				overspent: b.spent - b.totalBudget,
			};
		});

	// Table columns for detailed view
	const columns = [
		{
			title: 'Lịch Trình',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Ngân Sách',
			dataIndex: 'budget',
			key: 'budget',
				render: (budget: any) => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{(budget as number).toLocaleString()}đ</span>,
		},
		{
			title: 'Đã Chi',
			dataIndex: 'spent',
			key: 'spent',
				render: (spent: any) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{(spent as number).toLocaleString()}đ</span>,
		},
		{
			title: 'Còn Lại',
			key: 'remaining',
				render: (_: any, record: any) => {
				const remaining = record.budget - record.spent;
				const color = remaining < 0 ? '#f5222d' : '#52c41a';
				return <span style={{ color, fontWeight: 'bold' }}>{remaining.toLocaleString()}đ</span>;
			},
		},
		{
			title: 'Tỷ Lệ',
			key: 'percentage',
			render: (_, record: any) => {
				const percentage = record.budget > 0 ? (record.spent / record.budget) * 100 : 0;
				const color = percentage > 100 ? '#f5222d' : percentage > 80 ? '#faad14' : '#52c41a';
				return (
					<Progress
						type='circle'
						percent={Math.min(percentage, 100)}
						width={50}
						strokeColor={color}
						format={(percent) => `${percent?.toFixed(0)}%`}
					/>
				);
			},
		},
	];

	const tableData = itineraryBudgetData.map((d) => ({
		name: d.name,
		budget: d.budget,
		spent: d.value,
	}));

	return (
		<div style={{ padding: '20px' }}>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				<h1>💰 Quản Lý Ngân Sách</h1>

				{/* Alerts */}
				{alerts.length > 0 && (
					<Alert
						message='⚠️ Cảnh Báo: Một số lịch trình đã vượt ngân sách!'
						description={alerts.map((a) => (
							<div key={a.id}>
								📍 {a.name}: Vượt <strong style={{ color: '#f5222d' }}>{a.overspent.toLocaleString()}đ</strong>
							</div>
						))}
						type='warning'
						showIcon
						closable
					/>
				)}

				{/* Top Stats */}
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Ngân Sách'
								value={totalBudget}
								prefix='💵'
								suffix='đ'
								valueStyle={{ color: '#1890ff' }}
								precision={0}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Tổng Đã Chi'
								value={totalSpent}
								prefix='📊'
								suffix='đ'
								valueStyle={{ color: '#52c41a' }}
								precision={0}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<Statistic
								title='Còn Lại'
								value={remaining}
								prefix='💰'
								suffix='đ'
								valueStyle={{ color: remaining < 0 ? '#f5222d' : '#1890ff' }}
								precision={0}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card>
							<div style={{ textAlign: 'center' }}>
								<Statistic
									title='Tỷ Lệ Tiêu Thụ'
									value={percentageSpent}
									suffix='%'
									precision={1}
									valueStyle={{
										color: percentageSpent > 100 ? '#f5222d' : percentageSpent > 80 ? '#faad14' : '#52c41a',
									}}
								/>
								<Progress
									type='circle'
									percent={Math.min(percentageSpent, 100)}
									width={60}
									strokeColor={
										percentageSpent > 100 ? '#f5222d' : percentageSpent > 80 ? '#faad14' : '#52c41a'
									}
									format={(percent) => `${percent?.toFixed(0)}%`}
									style={{ marginTop: '8px' }}
								/>
							</div>
						</Card>
					</Col>
				</Row>

				{/* Charts */}
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<Card title='📈 Chi Phí Theo Lịch Trình' bordered={false}>
							<Chart
								options={pieChartOptions}
								series={pieChartSeries}
								type='donut'
								height={300}
							/>
						</Card>
					</Col>
					<Col xs={24} lg={12}>
						<Card title='💹 So Sánh Ngân Sách vs Chi Phí' bordered={false}>
							<Chart
								options={barChartOptions}
								series={barChartSeries}
								type='bar'
								height={300}
							/>
						</Card>
					</Col>
				</Row>

				{/* Detailed Table */}
				<Card title='📋 Chi Tiết Ngân Sách Theo Lịch Trình' bordered={false}>
					<Table
						dataSource={tableData}
						columns={columns}
						rowKey='name'
						pagination={{ pageSize: 10, showSizeChanger: true }}
						scroll={{ x: 900 }}
					/>
				</Card>

				{/* Legend and Notes */}
				<Card title='📌 Hướng Dẫn' type='inner' bordered={false}>
					<Space direction='vertical'>
						<div>
							🟢 <strong>Xanh:</strong> Đã chi dưới 80% ngân sách
						</div>
						<div>
							🟡 <strong>Vàng:</strong> Đã chi từ 80-99% ngân sách
						</div>
						<div>
							🔴 <strong>Đỏ:</strong> Đã chi vượt ngân sách
						</div>
					</Space>
				</Card>
			</Space>
		</div>
	);
};

export default BudgetManagement;
