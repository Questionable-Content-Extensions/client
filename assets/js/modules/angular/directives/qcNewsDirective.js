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

import type { AngularModule, $Log, $Sce } from 'angular';

import constants from '../../../constants';
import { nl2br, angularizeLinks } from '../util';

import { EventHandlingControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class NewsController extends EventHandlingControllerBase<NewsController> {
	static $inject: string[];

	$sce: $Sce;

	news: string;

	constructor(
		$scope: $DecoratedScope<NewsController>,
		$log: $Log,
		eventService: EventService,
		$sce: $Sce
	) {
		$log.debug('START NewsController');

		super($scope, eventService);
		this.$sce = $sce;

		this.news = $sce.trustAsHtml('Loading...');

		$log.debug('END NewsController');
	}

	_comicDataLoading(comic: number) {
		this.news = this.$sce.trustAsHtml('Loading...');
	}

	_comicDataLoaded(comicData: ComicData) {
		const news = comicData.news;
		if (news == null) {
			this.news = '';
		} else {
			this.news = this.$sce.trustAsHtml(nl2br(angularizeLinks(news), false));
		}
	}

}
NewsController.$inject = ['$scope', '$log', 'eventService', '$sce'];

export default function (app: AngularModule) {
	app.directive('qcNews', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: NewsController,
			controllerAs: 'n',
			template: '<div id="news" ng-bind-html="n.news" compile-template></div>'
		};
	});
}
