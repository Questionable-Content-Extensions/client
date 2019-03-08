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

import angular from 'angular';

import type { AngularModule, $Log } from 'angular';

import constants from '../../../constants';
import settings, { Settings } from '../../settings';
import variables from '../../../../generated/variables.pass2';

import { convertDataUritoBlob } from '../util';

import type { $DecoratedScope } from '../decorateScope';
import type { ColorService } from '../services/colorService';
import type { ComicService } from '../services/comicService';
import type { ItemService } from '../services/itemService';
import type { MessageReportingService } from '../services/messageReportingService';
import type { StyleService } from '../services/styleService';
import type { DecoratedItemData, ItemRelationData, ItemImageData } from '../api/itemData';

export class ItemDetailsController {
	static $inject: string[];

	$log: $Log;
	$scope: $DecoratedScope<ItemDetailsController>;
	colorService: ColorService;
	comicService: ComicService;
	messageReportingService: MessageReportingService;
	styleService: StyleService;
	itemService: ItemService;

	isLoading: boolean;
	isUpdating: boolean;
	settings: Settings;
	itemData: DecoratedItemData;

	imagePaths: string[];
	currentImagePath: number;
	isImagePreview: boolean;
	imageFile: ?string;
	imageFileInfo: any;

	constructor(
		$log: $Log,
		itemService: ItemService,
		$scope: $DecoratedScope<ItemDetailsController>,
		colorService: ColorService,
		comicService: ComicService,
		messageReportingService: MessageReportingService,
		styleService: StyleService
	) {
		$log.debug('START ItemDetailsController');

		this.$log = $log;
		this.itemService = itemService;
		this.$scope = $scope;
		this.colorService = colorService;
		this.comicService = comicService;
		this.messageReportingService = messageReportingService;
		this.styleService = styleService;

		this.isLoading = true;
		this.isUpdating = false;
		this.settings = settings;

		this.imagePaths = [];
		this.currentImagePath = 0;
		this.isImagePreview = false;
		this.imageFile = null;
		this.imageFileInfo = null;

		$('#itemDetailsDialog').on('show.bs.modal', () => this._getItemDetails());

		$log.debug('END ItemDetailsController');
	}

	async _getItemDetails() {
		const self = this;
		const itemId = $('#itemDetailsDialog').data('itemId');
		this.$log.debug('ItemDetailsController::showModal() - item id:',
			itemId);

		this.itemData = (({}: any): DecoratedItemData);
		this.isLoading = true;

		this.imagePaths = [];
		this.currentImagePath = 0;
		this.isImagePreview = false;
		this.imageFile = null;
		this.imageFileInfo = null;

		const itemData = await this.itemService.getItemData(itemId);
		if (itemData) {
			this.$log.debug('qcItemDetails::showModal() - ' +
				'item data:', itemData);

			this.$scope.safeApply(() => {
				this.itemData = itemData;
				this.isLoading = false;
				this.isUpdating = false;

				this.imagePaths = itemData.imageUrls;
				this.currentImagePath = 0;

				// If the color changes, also update the
				// highlight color
				this.$scope.$watch(() => {
					return this.itemData.color;
				}, () => {
					this.itemData.highlightColor =
						this.colorService
							.createTintOrShade(
								itemData.color);
				});
			});
		} else {
			this.close();
		}
	}

	_onErrorLog(response: any) {
		this.messageReportingService.reportError(response.data);
		return response;
	}

	_onSuccessRefreshElseErrorLog(response: any) {
		if (response.status === 200) {
			this.comicService.refreshComicData();
		} else {
			this._onErrorLog(response);
		}
		return response;
	}

	showInfoFor(id: number) {
		$('#itemDetailsDialog').data('itemId', id);
		this._getItemDetails();
	}

	keypress(event: KeyboardEvent, property: string) {
		if (event.keyCode === 13) {
			// ENTER key
			this.update(property);
		}
	}

	async update(property: string) {
		this.$scope.safeApply(() => {
			this.isUpdating = true;
		});
		const success = await this.itemService.updateProperty(this.itemData.id, property, this.itemData[property]);
		this.$scope.safeApply(() => {
			this.isUpdating = false;
		});
		if (success) {
			if (property === 'color') {
				this.$log.debug('ItemDetailsController::update() - ' +
					'update item color');
				this.styleService.removeItemStyle(
					this.itemData.id);
			}
			this.comicService.refreshComicData();
			this._getItemDetails();
		}
	}

	goToComic(comic: number) {
		this.comicService.gotoComic(comic);
		this.close();
	}

	close() {
		($('#itemDetailsDialog'): any).modal('hide');
	}

	previewImage() {
		if (this.imageFile && this.imageFileInfo.type == 'image/png') {
			this.isImagePreview = true;
		}
	}

	async uploadImage() {
		if (this.imageFile && this.imageFileInfo.type == 'image/png') {
			const imageBlob = convertDataUritoBlob(this.imageFile);

			this.$scope.safeApply(() => {
				this.isUpdating = true;
			});
			const success = await this.itemService.uploadImage(this.itemData.id, imageBlob, this.imageFileInfo.name);
			if (success) {
				this._getItemDetails();
			}
		} else {
			this.messageReportingService.reportError('Only PNG images are supported');
		}
	}

	previousImage() {
		this.currentImagePath--;
		if (this.currentImagePath < 0) {
			this.currentImagePath = 0;
		}
	}

	nextImage() {
		this.currentImagePath++;
		if (this.currentImagePath >= this.imagePaths.length) {
			this.currentImagePath = this.imagePaths.length - 1;
		}
	}
}
ItemDetailsController.$inject = ['$log', 'itemService', '$scope', 'colorService',
	'comicService', 'messageReportingService', 'styleService'];

export default function (app: AngularModule) {
	app.directive('qcItemDetails', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			controller: ItemDetailsController,
			controllerAs: 'idvm',
			template: variables.html.itemDetails
		};
	});
}
