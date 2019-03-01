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

import type { AngularModule } from 'angular';


export default function (app: AngularModule) {
	app.directive('qcComic', function () {
		return {
			restrict: 'E',
			transclude: true,
			scope: {},
			link: function (scope, element, attrs, ctrl, transclude) {
				transclude(scope, function (clone) {
					element.append(clone);
				});
			},
			controller: ['comicService',
				function (comicService) {
					this.comicService = comicService;
				}],
			controllerAs: 'c'
		};
	});
}
