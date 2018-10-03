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

	qcExt.app.directive('qcSettings', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ['$scope', 'comicService', '$log',
				function($scope, comicService, $log) {
					var self = this;
					this.settings = qcExt.settings;
					
					$scope.$watchGroup([function() {
						return self.settings.showAllMembers;
					}, function() {
						return self.settings.editMode;
					}], function() {
						comicService.refreshComicData();
					});
					
					$('#settingsDialog').on('hide.bs.modal', function() {
						$log.debug('Saving settings...');
						GM_setValue(constants.settingsKey,
							JSON.stringify(self.settings));
					});

					this.close = function() {
						$('#settingsDialog').modal('hide');
					};
				}],
			controllerAs: 'svm',
			template: qcExt.variables.angularTemplates.settings
		};
	});
})(qcExt || (qcExt = {}));

