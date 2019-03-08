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

import { SetValueControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class SetTitleController extends SetValueControllerBase<SetTitleController> {
	static $inject: string[];

	$log: $Log;

	title: ?string;

	isUpdating: boolean;

	constructor(
		$scope: $DecoratedScope<SetTitleController>,
		$log: $Log,
		comicService: ComicService,
		eventService: EventService
	) {
		$log.debug('START SetTitleController');

		super($scope, comicService, eventService);
		this.$log = $log;

		this.title = '';

		$log.debug('END SetTitleController');
	}

	_comicDataLoaded(comicData: ComicData) {
		this.title = comicData.title;
		this.$scope.isUpdating = false;
	}

	_updateValue() {
		this.setTitle();
	}

	async setTitle() {
		this.$scope.isUpdating = true;
		const response = await this.comicService.setTitle(this.title ? this.title : '');
		if (response.status !== 200) {
			this.$scope.safeApply(() => {
				this.$scope.isUpdating = false;
			});
		}
	}
}
SetTitleController.$inject = ['$scope', '$log', 'comicService', 'eventService'];

export default function (app: AngularModule) {
	app.directive('qcSetTitle', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: { isUpdating: '=' },
			controller: SetTitleController,
			controllerAs: 's',
			template: variables.html.setTitle
		};
	});
}
