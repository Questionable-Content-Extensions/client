// @flow
/*
 * Copyright (C) 2016-2018 Alexander Krivács Schrøder <alexschrod@gmail.com>
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
import settings, { Settings } from '../../settings';
import variables from '../../../../generated/variables.pass2';

import { ComicDataControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class RibbonController extends ComicDataControllerBase<RibbonController> {
	static $inject: string[];

	settings: Settings;
	isNonCanon: ?boolean;
	isGuestComic: ?boolean;
	isSmall: boolean;

	constructor(
		$scope: $DecoratedScope<RibbonController>,
		$log: $Log,
		eventService: EventService
	) {
		$log.debug('START RibbonController');

		super($scope, eventService);

		this.settings = settings;
		this.isNonCanon = false;
		this.isGuestComic = false;
		this.isSmall = settings.values.showSmallRibbonByDefault;

		$log.debug('END RibbonController');
	}

	_comicDataLoaded(comicData: ComicData) {
		this.isNonCanon = comicData.isNonCanon;
		this.isGuestComic = comicData.isGuestComic;
	}

}
RibbonController.$inject = ['$scope', '$log', 'eventService'];

export default function (app: AngularModule) {
	app.directive('qcRibbon', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: RibbonController,
			controllerAs: 'r',
			template: variables.html.ribbon
		};
	});
}
