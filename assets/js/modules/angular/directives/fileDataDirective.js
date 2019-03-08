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

import type { AngularModule } from 'angular';

export default function (app: AngularModule) {
	app.directive('fileData', function () {
		return {
			restrict: 'A',
			scope: {
				fileData: '=',
				fileInfo: '='
			},
			link: function (scope, element, attrs) {
				element.bind('change', function (changeEvent) {
					const fileReader = new FileReader();
					fileReader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.fileInfo = changeEvent.target.files[0];
							scope.fileData = loadEvent.target.result;
						});
					};
					fileReader.readAsDataURL(changeEvent.target.files[0]);
				});
			}
		};
	});
}
