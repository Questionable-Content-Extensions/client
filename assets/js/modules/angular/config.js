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

import GM from 'greasemonkey';
import angular from 'angular';
import type { AngularModule } from 'angular';

import settings from './../settings';

import decorateHttpService from './decorateHttpService';
import decorateScope from './decorateScope';

export default function (app: AngularModule) {
	// Set up routing and do other configuration
	app.config(['$stateProvider', '$urlRouterProvider',
		'$locationProvider', '$provide', '$logProvider',
		function ($stateProvider, $urlRouterProvider, $locationProvider,
			$provide, $logProvider) {
			decorateHttpService($provide);
			decorateScope($provide);

			$stateProvider.state('homepage', {
				url: '^/$',
				controller: 'comicController',
				controllerAs: 'c',
				template: '<div></div>'
			}).state('view', {
				url: '^/view.php?comic',
				controller: 'comicController',
				controllerAs: 'c',
				template: '<div></div>'
			});
			$urlRouterProvider.otherwise(function ($injector, $location) {
				GM.openInTab($location.$$absUrl, false);
			});

			$locationProvider.html5Mode(true);

			$logProvider.debugEnabled(settings.values.showDebugLogs);
		}]);
}
