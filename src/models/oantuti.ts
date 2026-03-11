import { useState, useEffect } from 'react';

export default () => {
	const [history, setHistory] = useState<OanTuTi.GameRound[]>([]);
	const [stats, setStats] = useState<OanTuTi.GameStats>({
		wins: 0,
		losses: 0,
		draws: 0,
		totalRounds: 0,
	});
	const [currentRound, setCurrentRound] = useState<OanTuTi.GameRound | null>(null);

	const loadData = () => {
		const savedHistory: any = localStorage.getItem('oantuti_history');
		const savedStats: any = localStorage.getItem('oantuti_stats');

		if (savedHistory) {
			setHistory(JSON.parse(savedHistory));
		}
		if (savedStats) {
			setStats(JSON.parse(savedStats));
		}
	};

	const getComputerChoice = (): OanTuTi.Choice => {
		const choices: OanTuTi.Choice[] = ['rock', 'paper', 'scissors'];
		return choices[Math.floor(Math.random() * 3)];
	};

	const determineResult = (
		playerChoice: OanTuTi.Choice,
		computerChoice: OanTuTi.Choice,
	): OanTuTi.Result => {
		if (playerChoice === computerChoice) return 'draw';

		if (
			(playerChoice === 'rock' && computerChoice === 'scissors') ||
			(playerChoice === 'paper' && computerChoice === 'rock') ||
			(playerChoice === 'scissors' && computerChoice === 'paper')
		) {
			return 'win';
		}

		return 'lose';
	};

	const playRound = (playerChoice: OanTuTi.Choice) => {
		const computerChoice = getComputerChoice();
		const result = determineResult(playerChoice, computerChoice);

		const newRound: OanTuTi.GameRound = {
			playerChoice,
			computerChoice,
			result,
			timestamp: Date.now(),
		};

		const newHistory = [newRound, ...history];
		setHistory(newHistory);
		localStorage.setItem('oantuti_history', JSON.stringify(newHistory));

		const newStats = { ...stats };
		if (result === 'win') {
			newStats.wins++;
		} else if (result === 'lose') {
			newStats.losses++;
		} else if (result === 'draw') {
			newStats.draws++;
		}
		newStats.totalRounds++;
		setStats(newStats);
		localStorage.setItem('oantuti_stats', JSON.stringify(newStats));

		setCurrentRound(newRound);
	};

	const resetGame = () => {
		setHistory([]);
		setStats({
			wins: 0,
			losses: 0,
			draws: 0,
			totalRounds: 0,
		});
		setCurrentRound(null);
		localStorage.removeItem('oantuti_history');
		localStorage.removeItem('oantuti_stats');
	};

	useEffect(() => {
		loadData();
	}, []);

	return {
		history,
		stats,
		currentRound,
		playRound,
		resetGame,
	};
};
