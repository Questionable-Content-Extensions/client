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
import type { MessageReportingService } from '../services/messageReportingService';
import type { ComicData } from '../api/comicData';

export class SetPublishDateController extends SetValueControllerBase<SetPublishDateController> {
	static $inject: string[];

	$log: $Log;

	messageReportingService: MessageReportingService;

	publishDate: ?Date;
	isAccuratePublishDate: ?boolean;

	isUpdating: boolean;

	constructor(
		$scope: $DecoratedScope<SetPublishDateController>,
		$log: $Log,
		comicService: ComicService,
		eventService: EventService,
		messageReportingService: MessageReportingService
	) {
		$log.debug('START SetPublishDateController');

		super($scope, comicService, eventService);
		this.$log = $log;
		this.messageReportingService = messageReportingService;

		this.publishDate = new Date();

		$log.debug('END SetPublishDateController');
	}

	_comicDataLoaded(comicData: ComicData) {
		if (comicData.publishDate != null) {
			this.publishDate = new Date(comicData.publishDate);
		} else {
			this.publishDate = null;
		}
		this.isAccuratePublishDate =
			comicData.isAccuratePublishDate;
		this.$scope.isUpdating = false;
	}

	_updateValue() {
		this.setPublishDate(false);
	}

	setAccuratePublishDate() {
		this.setPublishDate(true);
	}

	async setPublishDate(setAccurate: boolean) {
		if (this.publishDate == null) {
			// Error
			this.messageReportingService.reportWarning(
				'The date entered is not valid!');
			return;
		}

		this.$scope.isUpdating = true;
		const response = await this.comicService.setPublishDate(this.publishDate,
			this.isAccuratePublishDate != null ? this.isAccuratePublishDate : false);
		if (response.status !== 200) {
			this.$scope.safeApply(() => {
				this.$scope.isUpdating = false;
				if (setAccurate) {
					this.isAccuratePublishDate = !this.isAccuratePublishDate;
				}
			});
		}
	}
}
SetPublishDateController.$inject = ['$scope', '$log', 'comicService', 'eventService', 'messageReportingService'];

export default function (app: AngularModule) {
	app.directive('qcSetPublishDate', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: { isUpdating: '=' },
			controller: SetPublishDateController,
			controllerAs: 's',
			template: variables.html.setPublishDate
		};
	});
}
