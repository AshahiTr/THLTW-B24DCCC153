import { Button, Input, Card, Tag, Divider, Empty } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';

const GameBoard: React.FC = () => {
	const { secretNumber, attempts, messages, guesses, gameStatus, submitGuess } =
		useModel('doanSo');
	const [inputValue, setInputValue] = useState<string>('');
	const handleSubmit = () => {
		const guess = parseInt(inputValue, 10);
		if (isNaN(guess) || guess < 1 || guess > 100) {
			alert('Vui lòng nhập một số từ 1 đến 100');
			return;
		}
		submitGuess(guess);
		setInputValue('');
	};
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	};
	return (
		<div className='doan-so-container'>
			<Card className='game-card'>
				<h1 className='game-title'>Đoán Số</h1>
				<div className='game-info'>
					<div className='info-item'>
						<span className='label'>Lượt còn lại:</span>
						<Tag color={attempts <= 3 ? 'red' : 'blue'} className='info-value'>
							{attempts} / 10
						</Tag>
					</div>
					<div className='info-item'>
						<span className='label'>Số lần đoán:</span>
						<Tag color='cyan' className='info-value'>
							{guesses.length}
						</Tag>
					</div>
				</div>
				<Divider />
				{gameStatus === 'playing' && (
					<>
						<div className='input-section'>
							<Input
								type='number'
								min={1}
								max={100}
								placeholder='Nhập số từ 1 đến 100'
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyPress={handleKeyPress}
								disabled={gameStatus !== 'playing'}
								className='guess-input'
							/>
							<Button type='primary' onClick={handleSubmit} className='submit-btn'>
								Dự Đoán
							</Button>
						</div>
						{messages && (
							<div className='message info'>
								{messages}
							</div>
						)}
					</>
				)}
				{gameStatus === 'won' && (
					<div className='message success'>
						<div style={{ fontSize: 20, marginBottom: 16 }}>{messages}</div>
						<Button type='primary' size='large' onClick={() => window.location.reload()}>
							Chơi Lại
						</Button>
					</div>
				)}
				{gameStatus === 'lost' && (
					<div className='message error'>
						<div style={{ fontSize: 20, marginBottom: 16 }}>{messages}</div>
						<Button type='primary' size='large' onClick={() => window.location.reload()}>
							Chơi Lại
						</Button>
					</div>
				)}
				{guesses?.length > 0 && (
					<>
						<Divider orientation='left'>Lịch sử đoán</Divider>
						<div className='guesses-history'>
							{guesses.map((guess, index) => (
								<Tag
									key={index}
									color={
										guess === secretNumber
											? 'success'
											: guess < secretNumber
												? 'processing'
												: 'error'
									}
									className='guess-tag'
								>
									{guess}
									{guess === secretNumber ? ' ✓' : guess < secretNumber ? ' ↑' : ' ↓'}
								</Tag>
							))}
						</div>
					</>
				)}
				{guesses?.length === 0 && gameStatus === 'playing' && (
					<Empty description='Chưa có lần dự đoán nào' style={{ marginTop: 30 }} />
				)}
			</Card>
		</div>
	);
};

export default GameBoard;
