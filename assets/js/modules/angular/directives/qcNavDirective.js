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

import variables from '../../../../generated/variables.pass2';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';

export class NavController {
	static $inject: string[];

	$scope: $DecoratedScope<NavController>;
	comicService: ComicService;
	latestComic: number;
	randomComic: number;

	constructor(
		$scope: $DecoratedScope<NavController>,
		comicService: ComicService,
		latestComic: number
	) {
		this.$scope = $scope;
		this.comicService = comicService;
		this.latestComic = latestComic;

		this._updateRandomComic();
	}

	_updateRandomComic() {
		this.$scope.randomComic = Math.floor(Math.random() *
			(parseInt(this.latestComic) + 1));
	}

	first(event: UIEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.comicService.first();
	}

	previous(event: UIEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.comicService.previous();
	}

	next(event: UIEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.comicService.next();
	}

	last(event: UIEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.comicService.last();
	}

	random(event: UIEvent) {
		event.preventDefault();
		event.stopPropagation();

		this.comicService.gotoComic(this.$scope.randomComic);
		this._updateRandomComic();
	}
}
NavController.$inject = ['$scope', 'comicService', 'latestComic'];

export default function (app: AngularModule) {
	app.directive('qcNav', function () {
		return {
			restrict: 'E',
			scope: { randomComic: '=' },
			controller: NavController,
			controllerAs: 'n',
			template: variables.html.navigation
		};
	});
}
