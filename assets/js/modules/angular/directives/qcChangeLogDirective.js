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

import GM from 'greasemonkey';

import constants from '../../../constants';
import settings from '../../settings';
import variables from '../../../../generated/variables.pass2';

import { ComicDataControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class ChangeLogController extends ComicDataControllerBase<ChangeLogController> {
	static $inject: string[];

	$log: $Log;

	versionUpdated: boolean;
	currentVersion: string;
	previousVersion: ?string;

	constructor(
		$scope: $DecoratedScope<ChangeLogController>,
		$log: $Log,
		eventService: EventService
	) {
		$log.debug('START ChangeLogController');

		super($scope, eventService);

		this.$log = $log;

		this.versionUpdated = false;
		this.currentVersion = GM.info.script.version;
		this.previousVersion = null;

		$('#changeLogDialog').on('hide.bs.modal', () => {
			this.$log.debug('Saving settings...');
			settings.values.version = this.currentVersion;
			settings.saveSettings().then(() => {
				this.$log.debug('Settings saved.');
			});
		});

		$log.debug('END ChangeLogController');
	}

	_comicDataLoaded(comicData: ComicData) {
		if (!settings.values.version) {
			// Version is undefined. We're a new user!
			this.$log.debug('ChangeLogController::_comicDataLoaded(): Version undefined!');
		} else if (settings.values.version !==
			this.currentVersion) {
			// Version is changed. Script has been updated!
			// Show the change log dialog.
			this.previousVersion = settings.values.version;
			this.$log.debug('ChangeLogController::_comicDataLoaded(): Version different!');
		} else {
			return;
		}
		this.versionUpdated = true;
	}
	
	close() {
		($('#changeLogDialog'): any).modal('hide');
	}

}
ChangeLogController.$inject = ['$scope', '$log', 'eventService'];

export default function (app: AngularModule) {
	app.directive('qcChangeLog', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ChangeLogController,
			controllerAs: 'clvm',
			template: variables.html.changeLog
		};
	});
}
