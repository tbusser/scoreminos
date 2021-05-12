import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { RemainingPoints } from '01-global/interfaces/RemainingPoints';
import { TurnSummary } from '01-global/interfaces/TurnSummary';

import { NavigationManager, Step } from '03-modules/NavigationManager';
import { PlayerManager } from '03-modules/PlayerManager';
import { getInitialTileCount, getRoundBonus } from '03-modules/rules';
import { awardRemainingPoints } from '03-modules/scoring';

import { BaseController } from '04-components/BaseController';
import { Dialog } from '04-components/Dialog';

import { GameStartController } from '05-widgets/controllers/GameStartController';
import { PlayerSelectController } from '05-widgets/controllers/PlayerSelectController';
import { PointCollectionController } from '05-widgets/controllers/PointCollectionController';
import { PointLimitController } from '05-widgets/controllers/PointLimitController';
import {
	RoundController,
	RoundCompletedReason
} from '05-widgets/controllers/RoundController';
import { LeaderboardController } from '05-widgets/controllers/LeaderboardController';

import { TimedButton } from '04-components/TimedButton';

/* == INTERFACES ============================================================ */
interface Configuration {
	limitReached: boolean;
	pointsLimit: number;
	round: number;
	roundReason: RoundCompletedReason;
	startingPlayer: PlayerSummary | null;
}

enum StepId {
	Names = 'names',
	PlayerSelect = 'player-select',
	PointsLimit = 'points-limit',
	Round = 'round',
	Collection = 'collection',
	Leaderboard = 'leader-board'
}

/* == CONST ================================================================= */
const config: Configuration = {
	limitReached: false,
	pointsLimit: 0,
	round: 1,
	roundReason: RoundCompletedReason.RoundWon,
	startingPlayer: null
};

const dialogId = {
	gameWinner: 'game-winner',
	lastRound: 'last-round',
	roundWinner: 'round-winner',
	turnPlayed: 'turn-played'
};

const dialog = new Dialog();

// const debugPlayers: PlayerSummary[] = [
// 	{
// 		hasEmptyHand: false,
// 		id: Symbol('Player__0'),
// 		isActive: true,
// 		name: 'Player 1',
// 		score: 10,
// 		tileCount: 1
// 	},
// 	{
// 		hasEmptyHand: true,
// 		id: Symbol('Player__1'),
// 		isActive: false,
// 		name: 'Player 2',
// 		score: 17,
// 		tileCount: 1
// 	},
// 	{
// 		hasEmptyHand: false,
// 		id: Symbol('Player__2'),
// 		isActive: false,
// 		name: 'Player 3',
// 		score: 3,
// 		tileCount: 1
// 	},
// 	{
// 		hasEmptyHand: false,
// 		id: Symbol('Player__2'),
// 		isActive: false,
// 		name: 'Player 4',
// 		score: 7,
// 		tileCount: 1
// 	}
// ];

const playerManager = PlayerManager.instance;
const navigationManager = new NavigationManager(
	[
		{ id: StepId.Names },
		{ id: StepId.PointsLimit },
		{ id: StepId.PlayerSelect },
		{ id: StepId.Round },
		{ id: StepId.Collection },
		{ id: StepId.Leaderboard }
	],
	{
		instanceFactory,
		onInstanceActivated
	}
);

/* == CALLBACKS ============================================================= */
function onCancel(): void {
	navigationManager.goBack();
}

function onInstanceActivated(step: Step): void {
	switch (step.id) {
		case StepId.Collection:
			(step.instance as PointCollectionController).setPlayers(
				playerManager.players
			);
			// (step.instance as PointCollectionController).setPlayers(debugPlayers);
			break;

		case StepId.Leaderboard:
			(step.instance as LeaderboardController).showLeaderboard(
				playerManager.players
			);
			// (step.instance as LeaderboardController).showLeaderboard(debugPlayers);
			break;

		case StepId.PlayerSelect:
			(step.instance as PlayerSelectController).setPlayers(playerManager.players);
			(step.instance as PlayerSelectController).round = config.round++;
			break;

		case StepId.Round:
			(step.instance as RoundController).start(config.startingPlayer.id);
			break;
	}
}

function onPlayersSelected(names: string[]): void {
	const initialTileCount = getInitialTileCount(names.length);

	playerManager.createPlayers(names, initialTileCount);
	navigationManager.goForward();
}

function onPointsCollected(result: RemainingPoints[]): void {
	const winner = awardRemainingPoints(result);
	const name =
		playerManager.players.find(player => player.id === winner.id)?.name ?? '';

	playerManager.updatePlayerScore(winner.id, winner.points);

	showRoundWinnerDialog(winner.points, name);
}

function onPointLimitSet(points: number): void {
	config.pointsLimit = points;
	navigationManager.goForward();
}

function onRoundCompleted(): void {
	if (config.roundReason === RoundCompletedReason.RoundWon) {
		playerManager.updateActivePlayerScore(getRoundBonus());
	}
	config.limitReached = false;
	navigationManager.goForward();
}

function onStartingPlayerSelected(player: PlayerSummary): void {
	config.startingPlayer = player;
	navigationManager.goForward();
}

function onTurnSubmitted(turn: TurnSummary): void {
	const canShowLimitDialog = !config.limitReached;

	config.limitReached =
		config.limitReached || playerManager.activePlayer.score >= config.pointsLimit;
	const onClose =
		canShowLimitDialog && config.limitReached ? showLastRoundDialog : undefined;

	showTurnPlayedDialog(turn.scoreDelta, onClose);
}

function onStartNewGame(): void {
	navigationManager.goTo(StepId.Names);
}

/* == PRIVATE METHODS ======================================================= */
function instanceFactory(id: string): BaseController | null {
	// eslint-disable-line complexity
	switch (id) {
		case StepId.Collection:
			return initCollectionController();

		case StepId.Leaderboard:
			return initLeaderboardController();

		case StepId.Names:
			return initGameStartController();

		case StepId.PlayerSelect:
			return initPlayerSelectController();

		case StepId.PointsLimit:
			return initPointLimitController();

		case StepId.Round:
			return initRoundController();

		default:
			return null;
	}
}

function showGameWinnerDialog(): void {
	const winner = playerManager.firstRankedPlayer;

	dialog.showDialog(dialogId.gameWinner, {
		onClose: () => navigationManager.goForward(),
		placeholders: {
			name: winner.name,
			score: winner.score.toString(10)
		}
	});
}

function showLastRoundDialog(): void {
	dialog.showDialog(dialogId.lastRound, {
		placeholders: {
			name: playerManager.activePlayer.name,
			limit: config.pointsLimit.toString(10)
		}
	});
}

function showRoundWinnerDialog(points: number, name: string): void {
	dialog.showDialog(dialogId.roundWinner, {
		onClose: () => {
			if (config.limitReached) {
				setTimeout(showGameWinnerDialog, 0);
			} else {
				navigationManager.goTo(StepId.PlayerSelect);
			}
		},
		placeholders: {
			name,
			points: points.toString(10)
		}
	});
}

function showTurnPlayedDialog(delta: number, onClose): void {
	const formattedDelta = `${delta > 0 ? '+' : ''}${delta}`;
	const onBeforeShow = (content: HTMLElement) => {
		const button = content.querySelector('.js-dialog__close') as HTMLElement;
		if (button === null) {
			return;
		}
		const timedButton = new TimedButton(button, () => dialog.hideDialog());
		setTimeout(() => timedButton.start(), 0);
	};

	dialog.showDialog(dialogId.turnPlayed, {
		onBeforeShow,
		onClose,
		placeholders: {
			delta: formattedDelta,
			name: playerManager.activePlayer.name,
			score: playerManager.activePlayer.score.toString(10)
		}
	});
}

/* == INIT ================================================================== */
function init(): void {
	//
}

function initCollectionController(): PointCollectionController | null {
	const base = document.querySelector('.js-point-collection') as HTMLElement;

	return base === null
		? null
		: new PointCollectionController(base, {
				isVisible: false,
				onPointsCollected: onPointsCollected,
				selectors: {
					flyOut: '.js-point-collection__fly-out',
					numberEntry: '.js-point-collection__number-entry',
					playerList: '.js-point-collection__list',
					setPoints: '.js-point-collection__set-points'
				},
				translations: {
					headerPrompt: 'Select a player'
				},
				warningId: 'warning-points-missing'
		  });
}

function initGameStartController(): GameStartController | null {
	const base = document.querySelector('.js-game-start') as HTMLElement;

	return base
		? new GameStartController(base, {
				onPlayersSelected: onPlayersSelected,
				selectors: {
					form: ''
				},
				warningId: 'warning-required-players'
		  })
		: null;
}

function initLeaderboardController(): LeaderboardController | null {
	const base = document.querySelector('.js-leaderboard') as HTMLElement;

	return base === null
		? null
		: new LeaderboardController(base, {
				onStartNewGame,
				selectors: {
					board: '.js-leaderboard__board'
				}
		  });
}

function initPointLimitController(): PointLimitController | null {
	const base = document.querySelector('.js-point-limit') as HTMLElement;

	return base === null
		? null
		: new PointLimitController(base, {
				defaultPoints: 200,
				isVisible: false,
				onCancel,
				onLimitSet: onPointLimitSet,
				pointsValidation: {
					minimum: 100,
					maximum: 1000,
					warningId: 'warning-invalid-points-limit'
				},
				selectors: {
					numberEntry: '.js-point-limit__number-entry'
				}
		  });
}

function initPlayerSelectController(): PlayerSelectController | null {
	const base = document.querySelector('.js-player-select') as HTMLElement;

	return base === null
		? null
		: new PlayerSelectController(base, {
				isVisible: false,
				onCancel,
				onPlayerSelected: onStartingPlayerSelected,
				selectors: {
					nameList: '.js-player-select__list'
				},
				warningId: 'warning-select-starting-player'
		  });
}

function initRoundController(): RoundController | null {
	const base = document.querySelector('.js-round') as HTMLElement;

	return base === null
		? null
		: new RoundController(base, {
				onRoundCompleted: onRoundCompleted,
				onTurnSubmitted: onTurnSubmitted,
				selectors: {
					flyOut: '.js-round__fly-out',
					flyOutClose: '.js-round__fly-out-close',
					leaderboard: '.js-round__leaderboard'
				}
		  });
}

init();
