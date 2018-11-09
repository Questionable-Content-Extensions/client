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

import angular from 'angular';

import constants from '../../../constants';
import settings from '../../settings';
import variables from '../../../../generated/variables.pass2';

export default function (app) {
	function Controller($scope, $log, comicService, latestComic, Event, $sce) {
		var comicDataLoadingEvent = new Event(constants.comicdataLoadingEvent);
		var comicDataLoadedEvent = new Event(constants.comicdataLoadedEvent);
		var comicDataErrorEvent = new Event(constants.comicdataErrorEvent);

		$scope.safeApply = function (fn) {
			var phase = this.$root.$$phase;

			if (phase === '$apply' || phase === '$digest') {
				if (fn &&
					typeof fn === 'function') {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		var self = this;

		this.comicService = comicService;
		this.settings = settings;
		this.constants = constants;
		this.items = {};
		this.allItems = {};
		this.editorData = {};
		this.messages = [];
		this.missingDataInfo = [];

		function reset() {
			self.isLoading = false;
			self.items = {};
			self.allItems = {};
			self.editorData = {};
			self.messages.length = 0;
			self.missingDataInfo.length = 0;
			self.hasError = false;
			self.hasWarning = false;
		}

		function loading() {
			reset();
			self.isLoading = true;
			self.messages.push('Loading...');
		}

		comicDataLoadingEvent.subscribe($scope, function () {
			$scope.safeApply(loading);
		});

		comicDataLoadedEvent.subscribe($scope,
			function (event, comicData) {
				$scope.safeApply(function () {
					reset();

					if (self.settings.editMode &&
						comicData.editorData) {
						self.editorData = comicData.editorData;
						self.editorData.missing.cast.any =
							self.editorData.missing.cast.first !== null;
						self.editorData.missing.location.any =
							self.editorData.missing.location.first !== null;
						self.editorData.missing.storyline.any =
							self.editorData.missing.storyline.first !== null;
						self.editorData.missing.title.any =
							self.editorData.missing.title.first !== null;
						self.editorData.missing.tagline.any =
							self.editorData.missing.tagline.first !== null;
						self.editorData.missing.any =
							self.editorData.missing.cast.any ||
							self.editorData.missing.location.any ||
							self.editorData.missing.storyline.any ||
							self.editorData.missing.title.any ||
							self.editorData.missing.tagline.any;

						if (self.editorData.missing.cast.first == comicService.comic) {
							self.editorData.missing.cast.first = null;
						}
						if (self.editorData.missing.cast.last == comicService.comic) {
							self.editorData.missing.cast.last = null;
						}

						if (self.editorData.missing.location.first == comicService.comic) {
							self.editorData.missing.location.first = null;
						}
						if (self.editorData.missing.location.last == comicService.comic) {
							self.editorData.missing.location.last = null;
						}

						if (self.editorData.missing.storyline.first == comicService.comic) {
							self.editorData.missing.storyline.first = null;
						}
						if (self.editorData.missing.storyline.last == comicService.comic) {
							self.editorData.missing.storyline.last = null;
						}
					}

					function processItem(item) {
						if (!(item.type in self.items)) {
							self.items[item.type] = [];
						}
						self.items[item.type].push(item);
					}

					function processAllItem(item) {
						if (!(item.type in self.allItems)) {
							self.allItems[item.type] = [];
						}
						self.allItems[item.type].push(item);
					}

					if (!comicData.hasData) {
						self.messages.push(
							'This strip has no navigation data yet'
						);
						self.hasWarning = true;

						if (settings.showAllMembers) {
							angular.forEach(comicData.allItems, processAllItem);
						}
						return;
					}

					var hasCast = false;
					var hasLocation = false;
					//var hasStoryline = false;
					angular.forEach(comicData.items,
						function (item) {
							processItem(item);

							if (item.type === 'cast') {
								hasCast = true;
							} else if (item.type === 'location') {
								hasLocation = true;
							} else if (item.type === 'storyline') {
								//hasStoryline = true;
							}
						}
					);
					if (settings.showAllMembers) {
						angular.forEach(comicData.allItems, processAllItem);
					}

					if (!hasCast) {
						self.missingDataInfo.push('cast members');
					}
					if (!hasLocation) {
						self.missingDataInfo.push('a location');
					}
					/* #if (!hasStoryline) {
						self.missingDataInfo.push('a storyline');
					}*/
					if (!comicData.title) {
						self.missingDataInfo.push('a title');
					}
					if (!comicData.tagline &&
						comicService.comic > constants.taglineThreshold) {
						self.missingDataInfo.push('a tagline');
					}

					var currentVersion = GM.info.script.version;
					if (settings.version === undefined) {
						// Version is undefined. We're a new user!
						$log.debug('qcExtra(): Version undefined!');
						self.showWelcomeMessage = true;
					} else if (settings.version !==
						currentVersion) {
						// Version is changed. Script has been updated!
						self.showUpdateMessage = true;
					}
				});
			});

		comicDataErrorEvent.subscribe($scope,
			function (event, data) {
				$scope.safeApply(reset);
				$scope.safeApply(function () {
					if (data.status !== 503) {
						self.messages.push('Error communicating with server');
						self.hasError = true;
					} else {
						self.messages.push(constants.messages.maintenance);
					}
				});
			});

		this.getTypeDescription = function (type) {
			switch (type) {
				case 'cast':
					return 'Cast Members';
				case 'storyline':
					return 'Storylines';
				case 'location':
					return 'Locations';

				case 'all-cast':
					return $sce.trustAsHtml('Cast Members<br>' +
						'<small>(Non-Present)</small>');
				case 'all-storyline':
					return $sce.trustAsHtml('Storylines<br>' +
						'<small>(Non-Present)</small>');
				case 'all-location':
					return $sce.trustAsHtml('Locations<br>' +
						'<small>(Non-Present)</small>');
			}
		};

		this.openSettings = function () {
			$('#settingsDialog').modal('show');
		};

		this.editComicData = function () {
			$('#editComicDataDialog').modal('show');
		};

		this.showDetailsFor = function (item) {
			$('#itemDetailsDialog').data('itemId', item.id);
			$('#itemDetailsDialog').modal('show');
		};

		this.enableTagModeFor = function (item) {
			$log.debug(item);
		};

		this.showChangeLog = function () {
			self.showWelcomeMessage = false;
			self.showUpdateMessage = false;
			$('#changeLogDialog').modal('show');
		};
	}

	app.directive('qcExtra', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ['$scope', '$log', 'comicService', 'latestComic',
				'eventFactory', '$sce', Controller],
			controllerAs: 'e',
			template: variables.html.extra
		};
	});
}
