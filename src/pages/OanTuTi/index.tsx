import { Button, Card, Col, Row, Statistic, Table, Tag, Space, Divider, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import './style.less';

const OanTuTi: React.FC = () => {
	const { history, stats, currentRound, playRound, resetGame } = useModel('oantuti');

	const getChoiceEmoji = (choice: OanTuTi.Choice | null) => {
		switch (choice) {
			case 'rock':
				return '✊ Búa';
			case 'paper':
				return '✋ Bao';
			case 'scissors':
				return '✌️ Kéo';
			default:
				return '-';
		}
	};

	const getResultColor = (result: OanTuTi.Result) => {
		switch (result) {
			case 'win':
				return 'green';
			case 'lose':
				return 'red';
			case 'draw':
				return 'orange';
		}
	};

	const getResultText = (result: OanTuTi.Result) => {
		switch (result) {
			case 'win':
				return 'Thắng';
			case 'lose':
				return 'Thua';
			case 'draw':
				return 'Hòa';
		}
	};

	const columns = [
		{
			title: 'Ván thứ',
			dataIndex: 'index',
			key: 'index',
			width: 80,
			render: (text: any, record: any, index: number) => index + 1,
		},
		{
			title: 'Lựa chọn của bạn',
			dataIndex: 'playerChoice',
			key: 'playerChoice',
			render: (choice: OanTuTi.Choice) => getChoiceEmoji(choice),
		},
		{
			title: 'Lựa chọn của máy',
			dataIndex: 'computerChoice',
			key: 'computerChoice',
			render: (choice: OanTuTi.Choice) => getChoiceEmoji(choice),
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			render: (result: OanTuTi.Result) => (
				<Tag color={getResultColor(result)}>{getResultText(result)}</Tag>
			),
		},
		{
			title: 'Thời gian',
			dataIndex: 'timestamp',
			key: 'timestamp',
			render: (timestamp: number) => new Date(timestamp).toLocaleTimeString('vi-VN'),
		},
	];

	const handleResetGame = () => {
		Modal.confirm({
			title: 'Xác nhận',
			content: 'Bạn có chắc chắn muốn xóa tất cả lịch sử?',
			okText: 'Có',
			cancelText: 'Không',
			onOk() {
				resetGame();
				message.success('Đã xóa lịch sử');
			},
		});
	};

	return (
		<div className="oantuti-container">
			<div style={{ textAlign: 'center', marginBottom: 30 }}>
				<h1>🎮 Trò Chơi Oẳn Tù Tì</h1>
			</div>


			<Card className="game-card" style={{ marginBottom: 20 }}>
				<div style={{ textAlign: 'center' }}>
					<h2>Chọn của bạn</h2>
					<Space wrap style={{ justifyContent: 'center', marginBottom: 20 }}>
						<Button
							size="large"
							type="primary"
							style={{ fontSize: 16, height: 100, width: 100 }}
							onClick={() => {
								playRound('rock');
							}}
						>
							✊<br />
							Búa
						</Button>
						<Button
							size="large"
							type="primary"
							style={{ fontSize: 16, height: 100, width: 100 }}
							onClick={() => {
								playRound('paper');
							}}
						>
							✋<br />
							Bao
						</Button>
						<Button
							size="large"
							type="primary"
							style={{ fontSize: 16, height: 100, width: 100 }}
							onClick={() => {
								playRound('scissors');
							}}
						>
							✌️<br />
							Kéo
						</Button>
					</Space>

					{currentRound && (
						<>
							<Divider />
							<Row gutter={20} style={{ marginTop: 20, marginBottom: 20 }}>
								<Col xs={24} sm={8}>
									<Card>
										<p style={{ fontSize: 14, color: '#999' }}>Bạn chọn</p>
										<p style={{ fontSize: 32 }}>{getChoiceEmoji(currentRound.playerChoice)}</p>
									</Card>
								</Col>
								<Col xs={24} sm={8}>
									<Card>
										<p style={{ fontSize: 14, color: '#999' }}>Kết quả</p>
										<p style={{ fontSize: 32, fontWeight: 'bold', color: getResultColor(currentRound.result) }}>
											{getResultText(currentRound.result)}
										</p>
									</Card>
								</Col>
								<Col xs={24} sm={8}>
									<Card>
										<p style={{ fontSize: 14, color: '#999' }}>Máy chọn</p>
										<p style={{ fontSize: 32 }}>{getChoiceEmoji(currentRound.computerChoice)}</p>
									</Card>
								</Col>
							</Row>
						</>
					)}
				</div>
			</Card>


			{stats.totalRounds > 0 && (
				<Card style={{ marginBottom: 20 }}>
					<Row gutter={16}>
						<Col xs={24} sm={6}>
							<Statistic
								title="Tổng ván"
								value={stats.totalRounds}
								valueStyle={{ color: '#1890ff' }}
							/>
						</Col>
						<Col xs={24} sm={6}>
							<Statistic
								title="Thắng"
								value={stats.wins}
								valueStyle={{ color: '#52c41a' }}
								prefix="🎉 "
							/>
						</Col>
						<Col xs={24} sm={6}>
							<Statistic
								title="Thua"
								value={stats.losses}
								valueStyle={{ color: '#f5222d' }}
								prefix="😢 "
							/>
						</Col>
						<Col xs={24} sm={6}>
							<Statistic
								title="Hòa"
								value={stats.draws}
								valueStyle={{ color: '#faad14' }}
								prefix="🤝 "
							/>
						</Col>
					</Row>
					<Divider />
					<Row gutter={16}>
						<Col xs={24} sm={8}>
							<Statistic
								title="Tỷ lệ thắng"
								value={((stats.wins / stats.totalRounds) * 100).toFixed(1)}
								suffix="%"
								precision={1}
								valueStyle={{ color: '#52c41a' }}
							/>
						</Col>
						<Col xs={24} sm={8}>
							<Statistic
								title="Tỷ lệ thua"
								value={((stats.losses / stats.totalRounds) * 100).toFixed(1)}
								suffix="%"
								precision={1}
								valueStyle={{ color: '#f5222d' }}
							/>
						</Col>
						<Col xs={24} sm={8}>
							<Statistic
								title="Tỷ lệ hòa"
								value={((stats.draws / stats.totalRounds) * 100).toFixed(1)}
								suffix="%"
								precision={1}
								valueStyle={{ color: '#faad14' }}
							/>
						</Col>
					</Row>
				</Card>
			)}

			{/* History */}
			{history.length > 0 && (
				<Card
					title="Lịch sử kết quả"
					extra={
						<Button
							danger
							icon={<DeleteOutlined />}
							onClick={handleResetGame}
						>
							Xóa lịch sử
						</Button>
					}
				>
					<Table
						columns={columns}
						dataSource={history}
						rowKey="timestamp"
						pagination={{ pageSize: 10, position: ['bottomCenter'] }}
						size="small"
					/>
				</Card>
			)}
		</div>
	);
};

export default OanTuTi;
