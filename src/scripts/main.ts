import { RoundStatus, StepId } from '01-global/enum';
import { PlayerSummary } from '01-global/interface/PlayerSummary';
import { RemainingPoints } from '01-global/interface/RemainingPoints';

import { NavigationManager, Step } from '01-global/manager/NavigationManager';
import { PlayerManager } from '01-global/manager/PlayerManager';
import { getInitialTileCount, getRoundBonus } from '01-global/utility/rules';
import { awardRemainingPoints } from '01-global/utility/scoring';

import { GameStartController } from '03-domain/view-controller/GameStartController';
import { PlayerSelectController } from '03-domain/view-controller/PlayerSelectController';
import { PointCollectionController } from '03-domain/view-controller/PointCollectionController';
import { PointLimitController } from '03-domain/view-controller/PointLimitController';

import { RoundController, TurnReport } from '03-domain/round-controller';
import { LeaderboardController } from '03-domain/view-controller/LeaderboardController';
import { LeaderboardFlyInController } from '03-domain/view-controller/LeaderboardFlyInController';

import {
	showGameWinnerDialog,
	showLastRoundDialog,
	showRoundWinnerDialog,
	showTurnPlayedDialog
} from '03-domain/dialog';
import { ManagedViewController } from '01-global/interface/ManagedViewController';

/* == INTERFACES ============================================================ */
interface Configuration {
	leaderBoardFlyOut?: LeaderboardFlyInController;
	limitReached: boolean;
	pointsLimit: number;
	round: number;
	startingPlayer: PlayerSummary | null;
}

/* == CONST ================================================================= */
const config: Configuration = {
	limitReached: false,
	pointsLimit: 0,
	round: 1,
	startingPlayer: null
};
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
			break;

		case StepId.Leaderboard:
			(step.instance as LeaderboardController).showLeaderboard(
				playerManager.players
			);
			break;

		case StepId.PlayerSelect:
			preparePlayerSelect(step.instance as PlayerSelectController);
			break;

		case StepId.PointsLimit:
			(step.instance as PointLimitController).reset();
			break;

		case StepId.Round:
			(step.instance as RoundController).startRound(playerManager.numberOfPlayers);
			break;
	}
}

function onPlayersSelected(names: string[]): void {
	const tilesPerRound = getInitialTileCount(names.length);

	playerManager.createPlayers(names, tilesPerRound);
	navigationManager.goForward();
}

function onPointsCollected(result: RemainingPoints[]): void {
	const winner = awardRemainingPoints(result);
	const name =
		playerManager.players.find(player => player.id === winner.id)?.name ?? '';

	playerManager.updatePlayerScore(winner.id, winner.points);

	showRoundWinnerDialog(winner.points, name, onRoundWinnerDialogClosed);
	config.round++;
}

function onPointLimitSet(points: number): void {
	config.pointsLimit = points;
	config.limitReached = false;
	navigationManager.goForward();
}

// function onRoundCompleted(): void {
// 	if (config.roundReason === RoundCompletedReason.RoundWon) {
// 		playerManager.updateActivePlayerScore(getRoundBonus());
// 	}
// 	navigationManager.goForward();
// }

function onRoundWinnerDialogClosed(): void {
	if (config.limitReached) {
		const winner = playerManager.firstRankedPlayer;

		setTimeout(
			() => showGameWinnerDialog(winner, () => navigationManager.goForward()),
			0
		);
	} else {
		navigationManager.goTo(StepId.PlayerSelect);
	}
}

function onStartingPlayerSecondaryAction(): void {
	if (isFirstRound()) {
		navigationManager.goBack();
	} else {
		showLeaderboardFlyin();
	}
}

function onStartingPlayerSelected(player: PlayerSummary): void {
	config.startingPlayer = player;
	playerManager.setActivePlayer(player.id);
	playerManager.resetTileCount();

	navigationManager.goForward();
}

function onTurnSubmitted(report: TurnReport): void {
	if (report.state !== RoundStatus.InProgress) {
		if (report.state === RoundStatus.Won) {
			playerManager.updateActivePlayerScore(getRoundBonus());
		}
		navigationManager.goForward();

		return;
	}

	const canShowLimitDialog = !config.limitReached;
	const activePlayer = playerManager.activePlayer as PlayerSummary;
	config.limitReached ||=
		(playerManager.activePlayer?.score ?? 0) >= config.pointsLimit;
	const onClose =
		canShowLimitDialog && config.limitReached
			? () => onTurnPlayedDialogClosed(activePlayer)
			: playNextTurn;

	showTurnPlayedDialog(activePlayer, report.scoreDelta, onClose);
}

function onTurnPlayedDialogClosed(currentPlayer: PlayerSummary): void {
	setTimeout(
		() =>
			showLastRoundDialog(currentPlayer.name, config.pointsLimit, playNextTurn),
		0
	);
}

function onStartNewGame(): void {
	navigationManager.goTo(StepId.Names);
}

/* == PRIVATE METHODS ======================================================= */
/* eslint-disable complexity */
function instanceFactory(id: string): ManagedViewController | null {
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
/* eslint-enable complexity */

function isFirstRound(): boolean {
	return config.round === 1;
}

function showLeaderboardFlyin(showTiles = false): void {
	config.leaderBoardFlyOut?.showLeaderboard(playerManager.players, showTiles);
}

/* == INIT ================================================================== */
function playNextTurn(): void {
	const activeStep = navigationManager.activeStep;
	if (activeStep === undefined || activeStep.instance === undefined) {
		return;
	}

	(activeStep.instance as RoundController).continueRound();
}

function init(): void {
	const leaderboardFlyoutBase = document.querySelector(
		'.js-leaderboard-fly-out'
	) as HTMLElement;

	if (leaderboardFlyoutBase !== null) {
		config.leaderBoardFlyOut = new LeaderboardFlyInController(
			leaderboardFlyoutBase,
			{
				selectors: {
					background: 'main',
					board: '.js-leaderboard-fly-out__leaderboard',
					closeTrigger: '.js-leaderboard-fly-out__close'
				}
			}
		);
	}
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
				defaultPoints: 400,
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
				onCancel: onStartingPlayerSecondaryAction,
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
				onShowLeaderboard: () => showLeaderboardFlyin(true),
				onTurnSubmitted: onTurnSubmitted
		  });
	// return base === null
	// 	? null
	// 	: new RoundController(base, {
	// 			onRoundCompleted: onRoundCompleted,
	// 			onShowLeaderboard: () => showLeaderboardFlyin(true),
	// 			onTurnSubmitted: onTurnSubmitted
	// 	  });
}

function preparePlayerSelect(instance: PlayerSelectController): void {
	instance.setPlayers(playerManager.players);
	instance.secondaryActionTitle = isFirstRound() ? 'Back' : 'Leaderboard';
	instance.round = config.round;
}

init();
