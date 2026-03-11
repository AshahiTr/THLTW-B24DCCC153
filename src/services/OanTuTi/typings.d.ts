declare module OanTuTi {
	export type Choice = 'rock' | 'paper' | 'scissors' | null;
	export type Result = 'win' | 'lose' | 'draw';

	export interface GameRound {
		playerChoice: Choice;
		computerChoice: Choice;
		result: Result;
		timestamp: number;
	}

	export interface GameStats {
		wins: number;
		losses: number;
		draws: number;
		totalRounds: number;
	}
}
