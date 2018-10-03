/*
 * Copyright (C) 2016, 2017 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

/* global constants */

var qcExt;

(function(qcExt) {
	'use strict';

	qcExt.app.directive('qcDate', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ['$scope', '$log', 'eventFactory',
				function($scope, $log, Event) {
					var comicDataLoadingEvent =
						new Event(constants.comicdataLoadingEvent);
					var comicDataLoadedEvent =
						new Event(constants.comicdataLoadedEvent);
					
					$log.debug('START qcDate()');

					$scope.safeApply = function(fn) {
						var phase = this.$root.$$phase;

						if (phase === '$apply' || phase === '$digest') {
							if (fn && typeof fn === 'function') {
								fn();
							}
						} else {
							this.$apply(fn);
						}
					};

					var self = this;
					this.settings = qcExt.settings;
					this.date = null;
					this.approximateDate = false;
					comicDataLoadingEvent.subscribe($scope,
						function() {
							$scope.safeApply(function() {
								self.date = null;
								self.approximateDate = false;
							});
						});
					comicDataLoadedEvent.subscribe($scope,
						function(event, comicData) {
							$scope.safeApply(function() {
								self.approximateDate = !comicData.isAccuratePublishDate;
								var publishDate = comicData.publishDate;
								$log.debug('qcDate(): ', publishDate);
								if (publishDate !== null &&
									publishDate !== undefined) {
									var date = new Date(publishDate);
									self.date = date;
								} else {
									self.date = null;
								}
							});
						});
						
					$log.debug('END qcDate()');
				}],
			controllerAs: 'd',
			template: qcExt.variables.angularTemplates.date
		};
	});
})(qcExt || (qcExt = {}));
