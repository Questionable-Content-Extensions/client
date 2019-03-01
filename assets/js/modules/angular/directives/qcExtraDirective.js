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

import type { AngularModule, $Log, $Http, $Sce } from 'angular';

import GM from 'greasemonkey';
import angular from 'angular';

import constants from '../../../constants';
import settings, { Settings } from '../../settings';
import variables from '../../../../generated/variables.pass2';

import { ComicDataControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { ColorService } from '../services/colorService';
import type { ComicService } from '../services/comicService';
import type { EventService } from '../services/eventService';
import type { MessageReportingService } from '../services/messageReportingService';
import type { StyleService } from '../services/styleService';
import type { ItemData } from '../api/itemData';
import type { ComicItemRepository, ComicData, ComicEditorData, ComicItem } from '../api/comicData';

export class ExtraController extends ComicDataControllerBase<ExtraController> {
	static $inject: string[];

	$log: $Log;
	$sce: $Sce;
	comicService: ComicService;

	settings: Settings;
	constants: *;

	messages: string[];
	missingDataInfo: string[];
	showWelcomeMessage: boolean;
	showUpdateMessage: boolean;
	isLoading: boolean;
	hasError: boolean;
	hasWarning: boolean;

	items: ComicItemRepository;
	allItems: ComicItemRepository;

	editorData: ComicEditorData;

	constructor(
		$scope: $DecoratedScope<ExtraController>,
		$log: $Log,
		$sce: $Sce,
		comicService: ComicService,
		eventService: EventService,
		latestComic: number
	) {
		$log.debug('START ExtraController');

		super($scope, eventService);

		this.$log = $log;
		this.$sce = $sce;
		this.comicService = comicService;

		this.settings = settings;
		this.constants = constants;
		this.items = {};
		this.allItems = {};
		this.editorData = (({}: any): ComicEditorData);
		this.messages = [];
		this.missingDataInfo = [];

		$log.debug('END ExtraController');
	}

	_comicDataLoading(comic: number) {
		this._loading();
	}

	_comicDataLoaded(comicData: ComicData) {
		this._reset();

		if (this.settings.values.editMode &&
			comicData.editorData) {
			this.editorData = comicData.editorData;
			this.editorData.missing.cast.any =
				this.editorData.missing.cast.first !== null;
			this.editorData.missing.location.any =
				this.editorData.missing.location.first !== null;
			this.editorData.missing.storyline.any =
				this.editorData.missing.storyline.first !== null;
			this.editorData.missing.title.any =
				this.editorData.missing.title.first !== null;
			this.editorData.missing.tagline.any =
				this.editorData.missing.tagline.first !== null;
			this.editorData.missing.any =
				this.editorData.missing.cast.any ||
				this.editorData.missing.location.any ||
				this.editorData.missing.storyline.any ||
				this.editorData.missing.title.any ||
				this.editorData.missing.tagline.any;

			if (this.editorData.missing.cast.first == this.comicService.comic) {
				this.editorData.missing.cast.first = null;
			}
			if (this.editorData.missing.cast.last == this.comicService.comic) {
				this.editorData.missing.cast.last = null;
			}

			if (this.editorData.missing.location.first == this.comicService.comic) {
				this.editorData.missing.location.first = null;
			}
			if (this.editorData.missing.location.last == this.comicService.comic) {
				this.editorData.missing.location.last = null;
			}

			if (this.editorData.missing.storyline.first == this.comicService.comic) {
				this.editorData.missing.storyline.first = null;
			}
			if (this.editorData.missing.storyline.last == this.comicService.comic) {
				this.editorData.missing.storyline.last = null;
			}
		}

		const self = this;
		function processItem(item: ComicItem) {
			let items: ComicItem[];
			if (!self.items[item.type]) {
				items = self.items[item.type] = [];
			} else {
				items = self.items[item.type];
			}
			items.push(item);
		}

		function processAllItem(item: ComicItem) {
			let items: ComicItem[];
			if (!self.allItems[item.type]) {
				items = self.allItems[item.type] = [];
			} else {
				items = self.allItems[item.type];
			}
			items.push(item);
		}

		if (!comicData.hasData) {
			this.messages.push(
				'This strip has no navigation data yet'
			);
			this.hasWarning = true;

			if (settings.values.showAllMembers && comicData.allItems) {
				angular.forEach(comicData.allItems, processAllItem);
			}
			return;
		}

		let hasCast = false;
		let hasLocation = false;
		//let hasStoryline = false;
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
		if (settings.values.showAllMembers && comicData.allItems) {
			angular.forEach(comicData.allItems, processAllItem);
		}

		if (!hasCast) {
			this.missingDataInfo.push('cast members');
		}
		if (!hasLocation) {
			this.missingDataInfo.push('a location');
		}
		/* #if (!hasStoryline) {
			self.missingDataInfo.push('a storyline');
		}*/
		if (!comicData.title) {
			this.missingDataInfo.push('a title');
		}
		if (!comicData.tagline &&
			this.comicService.comic > constants.taglineThreshold) {
			this.missingDataInfo.push('a tagline');
		}

		const currentVersion = GM.info.script.version;
		if (!settings.values.version) {
			// Version is undefined. We're a new user!
			this.$log.debug('qcExtra(): Version undefined!');
			this.showWelcomeMessage = true;
		} else if (settings.values.version !==
			currentVersion) {
			// Version is changed. Script has been updated!
			this.$log.debug(`qcExtra(): Version is ${settings.values.version}!`);
			this.showUpdateMessage = true;
		}
	}

	_comicDataError(error: any) {
		this._reset();
		if (error.status !== 503) {
			this.messages.push('Error communicating with server');
			this.hasError = true;
		} else {
			this.messages.push(constants.messages.maintenance);
		}
	}

	_reset() {
		this.isLoading = false;
		this.items = {};
		this.allItems = {};
		this.editorData = (({}: any): ComicEditorData);
		this.messages.length = 0;
		this.missingDataInfo.length = 0;
		this.hasError = false;
		this.hasWarning = false;
	}

	_loading() {
		this._reset();
		this.isLoading = true;
		this.messages.push('Loading...');
	}

	getTypeDescription(type: string) {
		switch (type) {
			case 'cast':
				return 'Cast Members';
			case 'storyline':
				return 'Storylines';
			case 'location':
				return 'Locations';

			case 'all-cast':
				return this.$sce.trustAsHtml('Cast Members<br>' +
					'<small>(Non-Present)</small>');
			case 'all-storyline':
				return this.$sce.trustAsHtml('Storylines<br>' +
					'<small>(Non-Present)</small>');
			case 'all-location':
				return this.$sce.trustAsHtml('Locations<br>' +
					'<small>(Non-Present)</small>');
		}
	}

	openSettings() {
		($('#settingsDialog'): any).modal('show');
	}

	editComicData() {
		($('#editComicDataDialog'): any).modal('show');
	}

	showDetailsFor(item: ItemData) {
		$('#itemDetailsDialog').data('itemId', item.id);
		($('#itemDetailsDialog'): any).modal('show');
	}

	showChangeLog() {
		this.showWelcomeMessage = false;
		this.showUpdateMessage = false;
		($('#changeLogDialog'): any).modal('show');
	}
}
ExtraController.$inject = ['$scope', '$log', '$sce', 'comicService', 'eventService', 'latestComic'];

export default function (app: AngularModule) {
	app.directive('qcExtra', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ExtraController,
			controllerAs: 'e',
			template: variables.html.extra
		};
	});
}
