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

import type { AngularModule, $Log } from 'angular';

import angular from 'angular';

import constants from '../../../constants';
import variables from '../../../../generated/variables.pass2';

import { EventHandlingControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';
import type { EventService } from '../services/eventService';
import type { ComicData, ComicItem } from '../api/comicData';
import type { ItemType } from '../api/itemData';

export class EditComicDataController extends EventHandlingControllerBase<EditComicDataController> {
	static $inject: string[];

	$log: $Log;
	comicService: ComicService;

	isUpdating: boolean;

	editData: any; // TODO: Make properly strongly typed

	constructor(
		$scope: $DecoratedScope<EditComicDataController>,
		$log: $Log,
		eventService: EventService,
		comicService: ComicService
	) {
		$log.debug('START EditComicDataController');

		super($scope, eventService);

		this.$log = $log;
		this.comicService = comicService;

		this.isUpdating = true;

		$('#editComicDataDialog').on('show.bs.modal', () => {
			// If something needs to be done, do it here.
		});

		$log.debug('END EditComicDataController');
	}

	_comicDataLoading(comic: number) {
		this.isUpdating = true;
	}

	_comicDataLoaded(comicData: ComicData) {
		const editData: { comicData: ComicData, [ItemType]: { [number]: ComicItem } } = { comicData: comicData };

		if (comicData.hasData) {
			angular.forEach(comicData.items,
				(item) => {
					let editDataType: { [number]: ComicItem };
					if (!editData[item.type]) {
						editDataType = editData[item.type] = {};
					} else {
						editDataType = editData[item.type];
					}

					editDataType[item.id] = item;
				});
		}

		this.editData = editData;
		this.isUpdating = false;
	}

	_handleUpdateResponse(response: any, resetValueKey: ?string) {
		if (response.status !== 200) {
			this.$scope.safeApply(() => {
				if (resetValueKey) {
					this.editData.comicData[resetValueKey] = !this.editData.comicData[resetValueKey];
				}
				this.isUpdating = false;
			});
		}
	}

	async remove(item: ComicItem) {
		this.$scope.safeApply(() => {
			this.isUpdating = true;
		});
		const response = await this.comicService.removeItem(item);
		this._handleUpdateResponse(response);
	}

	changeGuestComic() {
		this.isUpdating = true;
		this.comicService.setGuestComic(
			this.editData.comicData.isGuestComic)
			.then(r => this._handleUpdateResponse(r, 'isGuestComic'));
	}

	changeNonCanon() {
		this.isUpdating = true;
		this.comicService.setNonCanon(
			this.editData.comicData.isNonCanon)
			.then(r => this._handleUpdateResponse(r, 'isNonCanon'));
	}

	changeNoCast() {
		this.isUpdating = true;
		this.comicService.setNoCast(
			this.editData.comicData.hasNoCast)
			.then(r => this._handleUpdateResponse(r, 'hasNoCast'));
	}

	changeNoLocation() {
		this.isUpdating = true;
		this.comicService.setNoLocation(
			this.editData.comicData.hasNoLocation)
			.then(r => this._handleUpdateResponse(r, 'hasNoLocation'));
	}

	changeNoStoryline() {
		this.isUpdating = true;
		this.comicService.setNoStoryline(
			this.editData.comicData.hasNoStoryline)
			.then(r => this._handleUpdateResponse(r, 'hasNoStoryline'));
	}

	changeNoTitle() {
		this.isUpdating = true;
		this.comicService.setNoTitle(
			this.editData.comicData.hasNoTitle)
			.then(r => this._handleUpdateResponse(r, 'hasNoTitle'));
	}

	changeNoTagline() {
		this.isUpdating = true;
		this.comicService.setNoTagline(
			this.editData.comicData.hasNoTagline)
			.then(r => this._handleUpdateResponse(r, 'hasNoTagline'));
	}

	close() {
		($('#editComicDataDialog'): any).modal('hide');
	}
}
EditComicDataController.$inject = ['$scope', '$log', 'eventService', 'comicService'];

export default function (app: AngularModule) {
	app.directive('qcEditComicData', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: EditComicDataController,
			controllerAs: 'ecdvm',
			template: variables.html.editComicData
		};
	});
}
