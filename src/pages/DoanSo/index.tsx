import { Button, Col, Row } from 'antd';
import { useModel } from 'umi';
import GameBoard from './GameBoard';
import { useEffect } from 'react';

const DoanSo: React.FC = () => {
	const { startNewGame } = useModel('doanSo');

	useEffect(() => {
		startNewGame();
	}, []);

	return (
		<div>
			<div style={{ textAlign: 'center', marginBottom: 30 }}>
				<h1>Đoán Số</h1>
				<p>Đoán số từ 1 đến 100, có 10 lượt</p>
				<Button
					type='primary'
					size='large'
					onClick={() => {
						window.location.reload();
					}}
				>
					Chơi Mới
				</Button>
			</div>
			<Row justify='center'>
				<Col xs={24} sm={20} md={16} lg={12} xl={10}>
					<GameBoard />
				</Col>
			</Row>
		</div>
	);
};

export default DoanSo;
