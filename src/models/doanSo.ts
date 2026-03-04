import { useState } from 'react';

export default () => {
	const [secretNumber, setSecretNumber] = useState<number>(0);
	const [attempts, setAttempts] = useState<number>(10);
	const [messages, setMessages] = useState<string>('');
	const [guesses, setGuesses] = useState<number[]>([]);
	const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
	const [currentGuess, setCurrentGuess] = useState<string>('');

	const startNewGame = () => {
		const random = Math.floor(Math.random() * 100) + 1;
        console.log(random)
		setSecretNumber(random);
		setAttempts(10);
		setMessages('');
		setGuesses([]);
		setGameStatus('playing');
		setCurrentGuess('');
	};

	const submitGuess = (guess: number) => {
		if (gameStatus !== 'playing') {
			return;
		}

		const newGuesses = [...guesses, guess];
		setGuesses(newGuesses);
		setCurrentGuess('');

		if (guess === secretNumber) {
			setGameStatus('won');
			setMessages(`Chúc mừng! Bạn đã đoán đúng! Số đó là ${secretNumber}`);
		} else if (guess < secretNumber) {
			const newAttempts = attempts - 1;
			setAttempts(newAttempts);
			setMessages('Bạn đoán quá thấp!');

			if (newAttempts === 0) {
				setGameStatus('lost');
				setMessages(`Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
			}
		} else {
			const newAttempts = attempts - 1;
			setAttempts(newAttempts);
			setMessages('Bạn đoán quá cao!');

			if (newAttempts === 0) {
				setGameStatus('lost');
				setMessages(`Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
			}
		}
	};

	return {
		secretNumber,
		attempts,
		messages,
		guesses,
		gameStatus,
		currentGuess,
		setCurrentGuess,
		startNewGame,
		submitGuess,
	};
};
