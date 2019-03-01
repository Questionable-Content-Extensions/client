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

import settings, { Settings } from '../../settings';
import variables from '../../../../generated/variables.pass2';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';

export class SettingsController {
	static $inject: string[];

	$scope: $DecoratedScope<SettingsController>;
	$log: $Log;
	comicService: ComicService;

	settings: Settings;

	constructor($scope: $DecoratedScope<SettingsController>, $log: $Log, comicService: ComicService) {
		$log.debug('START SettingsController');

		this.$scope = $scope;
		this.$log = $log;
		this.comicService = comicService;

		this.settings = settings;

		$scope.$watchGroup([() => {
			return this.settings.values.showAllMembers;
		}, () => {
			return this.settings.values.editMode;
		}], () => {
			this.comicService.refreshComicData();
		});

		$('#settingsDialog').on('hide.bs.modal', () => {
			$log.debug('Saving settings...');
			this.settings.saveSettings().then(() => {
				$log.debug('Settings saved.');
			});
		});

		$log.debug('END SettingsController');
	}

	close() {
		($('#settingsDialog'): any).modal('hide');
	}
}

export default function (app: AngularModule) {
	app.directive('qcSettings', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: SettingsController,
			controllerAs: 'svm',
			template: variables.html.settings
		};
	});
}
