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

import variables from '../../../../generated/variables.pass2';

export default function (app: AngularModule) {
	app.directive('donut',
		function () {
			return {
				restrict: 'E',
				scope: {
					size: '@',
					innerColor: '@',
					color: '@',
					highlightColor: '@',
					percent: '@',
					borderSize: '@'
				},
				controller: ['$scope',
					function ($scope) {
						function calculateRotationValues() {
							$scope.rotation = $scope.percent / 100 * 180;
							$scope.fixRotation = $scope.rotation * 2;
						}
						function calculateSizeValues() {
							$scope.maskClip = {
								top: 0,
								right: $scope.size,
								bottom: $scope.size,
								left: $scope.size / 2
							};
							$scope.fillClip = {
								top: 0,
								right: $scope.size / 2,
								bottom: $scope.size,
								left: 0
							};
							$scope.insetSize = $scope.size - $scope.borderSize;
							$scope.insetMargin = $scope.borderSize / 2;
						}
						calculateRotationValues();
						calculateSizeValues();

						$scope.$watch('percent', calculateRotationValues);
						$scope.$watch('size', calculateSizeValues);
						$scope.$watch('borderSize', calculateSizeValues);
					}
				],
				template: variables.html.donut
			};
		});
}
