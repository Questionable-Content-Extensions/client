// @flow
/*
 * Copyright (C) 2016-2019 Alexander Krivács Schrøder <alexschrod@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { AngularModule, $Log } from 'angular';

import constants from '../../../constants';
import variables from '../../../../generated/variables.pass2';

import { EventHandlingControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class ComicNavController extends EventHandlingControllerBase<ComicNavController> {
	static $inject: string[];

	$log: $Log;
	comicService: ComicService;
	latestComic: number;

	currentComic: ?number;

	constructor(
		$scope: $DecoratedScope<ComicNavController>,
		$log: $Log,
		comicService: ComicService,
		eventService: EventService,
		latestComic: number
	) {
		$log.debug('START ComicNavController');

		super($scope, eventService);

		this.$log = $log;
		this.comicService = comicService;
		this.latestComic = latestComic;

		this.currentComic = null;

		$log.debug('END ComicNavController');
	}

	_comicDataLoaded(comicData: ComicData) {
		this.currentComic = comicData.comic;
	}

	go() {
		this.$log.debug(`ComicNavController::go(): ${this.currentComic ? this.currentComic : 'NONE'}`);
		if (!this.currentComic) {
			this.currentComic = this.latestComic;
		} else if (this.currentComic < 1) {
			this.currentComic = 1;
		} else if (this.currentComic > this.latestComic) {
			this.currentComic = this.latestComic;
		}
		this.comicService.gotoComic(this.currentComic);
	}

	keyPress(event: KeyboardEvent) {
		if (event.keyCode === 13) {
			// ENTER key
			this.go();
		}
	}

}
ComicNavController.$inject = ['$scope', '$log', 'comicService', 'eventService', 'latestComic'];

export default function (app: AngularModule) {
	app.directive('qcComicNav', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ComicNavController,
			controllerAs: 'cn',
			template: variables.html.comicNav
		};
	});
}
