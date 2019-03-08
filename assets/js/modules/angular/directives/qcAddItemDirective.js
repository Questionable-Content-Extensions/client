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

import type { AngularModule, $Log, $Timeout, $Filter } from 'angular';

import constants from '../../../constants';
import variables from '../../../../generated/variables.pass2';

import { SetValueControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';
import type { ItemService } from '../services/itemService';
import type { EventService } from '../services/eventService';
import type { MessageReportingService } from '../services/messageReportingService';
import type { ItemBaseData, ItemData } from '../api/itemData';
import type { ComicData, ComicItem } from '../api/comicData';

const newItemId = -1;
const maintenanceId = -2;
const errorId = -3;

const addCastTemplate = 'Add new cast member';
const addCastItem: ItemBaseData = {
	id: newItemId,
	type: 'cast',
	shortName: `${addCastTemplate} ''`,
	name: ''
};
const addStorylineTemplate = 'Add new storyline';
const addStorylineItem: ItemBaseData = {
	id: newItemId,
	type: 'storyline',
	shortName: `${addStorylineTemplate} ''`,
	name: ''
};
const addLocationTemplate = 'Add new location';
const addLocationItem: ItemBaseData = {
	id: newItemId,
	type: 'location',
	shortName: `${addLocationTemplate} ''`,
	name: ''
};
const maintenanceItem: ItemBaseData = {
	id: maintenanceId,
	type: 'cast',
	shortName: 'Maintenance ongoing. Choose this to attempt refresh.',
	name: ''
};
const errorItem: ItemBaseData = {
	id: errorId,
	type: 'cast',
	shortName: 'Error loading item list. Choose this to attempt refresh.',
	name: ''
};

function escapeRegExp(s) {
	return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

let triggeredFocus = false;
let dropdownOpen = false;
let firstRun = true;

export class AddItemController extends SetValueControllerBase<AddItemController> {
	static $inject: string[];

	$log: $Log;
	$timeout: $Timeout;
	$filter: $Filter;

	itemService: ItemService;
	messageReportingService: MessageReportingService;

	searchFieldId: string;
	dropdownId: string;
	dropdownButtonId: string;

	itemFilterText: string;
	items: ItemBaseData[];

	isUpdating: boolean;

	constructor(
		$scope: $DecoratedScope<AddItemController>,
		$log: $Log,
		comicService: ComicService,
		eventService: EventService,
		itemService: ItemService,
		$timeout: $Timeout,
		$filter: $Filter,
		messageReportingService: MessageReportingService
	) {
		$log.debug('START AddItemController');

		super($scope, comicService, eventService);

		this.$log = $log;
		this.$timeout = $timeout;
		this.$filter = $filter;

		this.itemService = itemService;
		this.messageReportingService = messageReportingService;

		this.searchFieldId = `#addItem_${this.unique}_search`;
		this.dropdownId = `#addItem_${this.unique}_dropdown`;
		this.dropdownButtonId = `#addItem_${this.unique}_dropdownButton`;

		this.items = [];
		this.itemFilterText = '';

		(this: any).itemFilter = this.itemFilter.bind(this);

		$log.debug('END AddItemController');
	}

	_itemDataLoaded(itemData: ItemBaseData[]) {
		itemData = itemData.slice(0);

		itemData.push(addCastItem);
		itemData.push(addStorylineItem);
		itemData.push(addLocationItem);

		this.$scope.safeApply(() => {
			this.items = itemData;
		});
	}

	_itemDataError(error: any) {
		this.items.length = 0;
		this.items.push(errorItem);
	}

	_maintenance() {
		this.items.length = 0;
		this.items.push(maintenanceItem);
	}

	_updateValue() {
		// Add the top item in the list
		const filteredList = this.$filter('filter')(this.items,
			this.itemFilter);
		const chosenItem = filteredList[0];
		this.addItem(chosenItem);
	}

	_comicDataLoaded(comicData: ComicData) {
		this.itemFilterText = '';
		this.$scope.isUpdating = false;
	}

	searchChanged() {
		let filterText = this.itemFilterText;

		if (filterText.charAt(0) === '!') {
			filterText = filterText.substr(1);
		} else if (filterText.charAt(0) === '@') {
			filterText = filterText.substr(1);
		} else if (filterText.charAt(0) === '#') {
			filterText = filterText.substr(1);
		}

		addCastItem.shortName = `${addCastTemplate} '${filterText}'`;
		addCastItem.name = filterText;
		addStorylineItem.shortName = `${addStorylineTemplate} '${filterText}'`;
		addStorylineItem.name = filterText;
		addLocationItem.shortName = `${addLocationTemplate} '${filterText}'`;
		addLocationItem.name = filterText;
	}

	itemFilter(value: ItemBaseData) {
		let filterText = this.itemFilterText;

		let result = true;
		if (filterText.charAt(0) === '!') {
			result = value.type === 'cast';
			filterText = filterText.substr(1);
		} else if (filterText.charAt(0) === '@') {
			result = value.type === 'location';
			filterText = filterText.substr(1);
		} else if (filterText.charAt(0) === '#') {
			result = value.type === 'storyline';
			filterText = filterText.substr(1);
		}

		const searchRegex = new RegExp(escapeRegExp(filterText), 'i');
		result = result &&
			value.shortName.match(searchRegex) !== null;

		return result;
	}

	focusSearch() {
		this.$log.debug('AddItemController::focusSearch(): #1 Search focused');
		if (firstRun) {
			$(this.dropdownId).on('shown.bs.dropdown', () => {
				dropdownOpen = true;
				this.$log.debug('AddItemController::focusSearch(): #4 Dropdown opened');

				// Opening the dropdown makes the search field
				// lose focus. So set it again.
				$(this.searchFieldId).focus();
				triggeredFocus = false;

				$(this.dropdownId + ' .dropdown-menu').width($(
					this.dropdownId).width());
			});
			$(this.dropdownId).on('hidden.bs.dropdown', () => {
				this.$log.debug('AddItemController::focusSearch(): #5 Dropdown closed');
				dropdownOpen = false;
			});

			firstRun = false;
		}

		if (!dropdownOpen && !triggeredFocus) {
			this.$log.debug(
				'AddItemController::focusSearch(): #2 Focus was user-initiated');
			triggeredFocus = true;
			this.$timeout(() => {
				if (!dropdownOpen) {
					this.$log.debug(
						'AddItemController::focusSearch(): #3 Toggle dropdown');
					($(this.dropdownButtonId): any).dropdown('toggle');
				}
			}, 150);
		}
	}

	async addItem(item: ComicItem) {
		if (item.id == maintenanceId || item.id == errorId) {
			this.itemService.refreshItemData();
			return;
		}

		this.$scope.isUpdating = true;
		const response = await this.comicService.addItemToComic(item);
		if (response.status === 200) {
			// TODO: Maybe move this new item event logic to comicService.addItemToComic?
			if (item.id == newItemId) {
				this.eventService.itemsChangedEvent.publish();
			}
			this.$scope.safeApply(() => {
				this.itemFilterText = '';
			});
		} else {
			this.$scope.safeApply(() => {
				this.$scope.isUpdating = false;
			});
		}
	}
}
AddItemController.$inject = [
	'$scope', '$log', 'comicService', 'eventService',
	'itemService', '$timeout', '$filter', 'messageReportingService'
];

export default function (app: AngularModule) {
	app.directive('qcAddItem', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: { isUpdating: '=' },
			controller: AddItemController,
			controllerAs: 'a',
			template: variables.html.addItem
		};
	});
}
