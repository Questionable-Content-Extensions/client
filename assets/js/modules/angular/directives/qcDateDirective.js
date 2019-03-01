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

export class DateController extends ComicDataControllerBase<DateController> {
	static $inject: string[];

	$log: $Log;

	settings: Settings;

	date: ?Date;
	approximateDate: boolean;

	constructor(
		$scope: $DecoratedScope<DateController>,
		$log: $Log,
		eventService: EventService
	) {
		$log.debug('START DateController');

		super($scope, eventService);

		this.$log = $log;

		this.settings = settings;
		this.date = null;
		this.approximateDate = false;

		$log.debug('END DateController');
	}

	_comicDataLoading(comic: number) {
		self.date = null;
		self.approximateDate = false;
	}

	_comicDataLoaded(comicData: ComicData) {
		this.approximateDate = !comicData.isAccuratePublishDate;
		const publishDate = comicData.publishDate;
		this.$log.debug('DateController::_comicDataLoaded(): ', publishDate);
		if (publishDate !== null &&
			publishDate !== undefined) {
			const date = new Date(publishDate);
			this.date = date;
		} else {
			this.date = null;
		}
	}

}
DateController.$inject = ['$scope', '$log', 'eventService'];

export default function (app: AngularModule) {
	app.directive('qcDate', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: DateController,
			controllerAs: 'd',
			template: variables.html.date
		};
	});
}
