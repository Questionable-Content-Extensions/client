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

import $ from 'jquery';
import angular from 'angular';
import type { AngularModule, $Log, $Scope, AngularHttpService } from 'angular';

import constants from '../../../constants';
import settings from '../../settings';

import type { EventService } from './eventService';
import type { MessageReportingService } from './messageReportingService';
import type { ColorService } from './colorService';

import type { ItemBaseData, DecoratedItemData, ItemRelationData, ItemImageData } from '../api/itemData';

export class ItemService {
	$log: $Log;
	$scope: $Scope<Object>;
	$http: AngularHttpService;
	eventService: EventService;
	messageReportingService: MessageReportingService;
	colorService: ColorService;

	itemData: ItemBaseData[];

	isLoading: boolean;

	constructor($log: $Log, $scope: $Scope<Object>, $http: AngularHttpService, eventService: EventService,
		messageReportingService: MessageReportingService, colorService: ColorService) {
		this.$log = $log;
		this.$scope = $scope;
		this.$http = $http;
		this.eventService = eventService;
		this.messageReportingService = messageReportingService;
		this.colorService = colorService;

		eventService.itemsChangedEvent.subscribe($scope,
			(event, data) => {
				this.refreshItemData();
			});
		this.refreshItemData();
	}

	async _loadItemData() {
		if (this.isLoading) {
			return;
		}
		this.isLoading = true;

		this.eventService.itemDataLoadingEvent.publish();
		const response = await this.$http.get(constants.itemDataUrl);

		let itemData: ItemBaseData[] = [];
		if (response.status === 200) {
			itemData = response.data;
			this.eventService.itemDataLoadedEvent.publish(itemData);
		} else {
			if (response.status === 503) {
				this.eventService.maintenanceEvent.publish();
			} else {
				this.eventService.itemDataErrorEvent.publish(response);
				this.messageReportingService.reportError(response.data);
			}
		}
		this.itemData = itemData;
		this.isLoading = false;
	}

	refreshItemData() {
		this._loadItemData();
	}

	async getItemData(itemId: number): Promise<?DecoratedItemData> {
		const itemDataResponse = await this.$http.get(constants.itemDataUrl + itemId);
		if (itemDataResponse.status === 200) {
			const itemData = (itemDataResponse.data: DecoratedItemData);

			itemData.highlightColor = this.colorService
				.createTintOrShade(itemData.color);

			const friendDataRequest = this.$http.get(constants.itemFriendDataUrl + itemId);
			const locationDataRequest = this.$http.get(constants.itemLocationDataUrl + itemId);
			let imageDataRequest = null;
			if (itemData.hasImage) {
				imageDataRequest = this.$http.get(constants.itemDataUrl + itemId + '/images');
			}

			const handleRelationData = (response) => {
				if (response.status === 200) {
					const relationData = (response.data: ItemRelationData[]);
					$.each(relationData, (_: number, relation) => {
						relation.percentage = relation.count /
							itemData.appearances * 100;
					});
					return relationData;
				}
				return null;
			};

			const [friendDataResponse, locationDataResponse, imageDataResponse] = await Promise.all([friendDataRequest, locationDataRequest, imageDataRequest]);

			itemData.friends = handleRelationData(friendDataResponse) || [];
			itemData.locations = handleRelationData(locationDataResponse) || [];
			if (imageDataResponse) {
				if (imageDataResponse.status === 200) {
					let images = imageDataResponse.data;
					let imageUrls: string[] = [];
					$.each(images, (_: number, image: ItemImageData) => {
						imageUrls.push(constants.itemImageUrl + image.id);
					});
					itemData.imageUrls = imageUrls;
				}
			}

			return itemData;
		} else {
			if (itemDataResponse.status === 503) {
				this.eventService.maintenanceEvent.publish();
			} else {
				this.messageReportingService.reportError(itemDataResponse.data);
			}
			return null;
		}
	}

	async updateProperty(id: number, property: string, value: any) {
		const data = {
			token: settings.values.editModeToken,
			item: id,
			property: property,
			value: value
		};
		try {
			const response = await this.$http.post(constants.setItemDataPropertyUrl, data);
			if (response.status === 200) {
				return true;
			} else {
				if (response.status === 503) {
					this.eventService.maintenanceEvent.publish();
				} else {
					this.messageReportingService.reportError(response.data);
				}
				return false;
			}
		}
		catch (r) {
			this.messageReportingService.reportError(r.data);
			return false;
		}
	}

	async uploadImage(itemId: number, imageBlob: Blob, fileName: string) {
		const formData = new FormData();
		formData.append('ItemId', String(itemId));
		formData.append('Image', imageBlob, fileName);
		formData.append('Token', settings.values.editModeToken);

		const response = await this.$http.post(constants.itemDataUrl + 'image/upload', formData, { contentType: undefined, dataTransform: (d) => d });
		if (response.status === 200) {
			return true;
		} else {
			if (response.status === 503) {
				this.eventService.maintenanceEvent.publish();
			} else {
				this.messageReportingService.reportError(response.data);
			}
			return false;
		}
	}
}

export default function (app: AngularModule) {
	app.service('itemService', ['$log', '$rootScope', '$http', 'eventService', 'messageReportingService',
		'colorService',
		function ($log: $Log, $scope: $Scope<Object>, $http: AngularHttpService, eventService: EventService,
			messageReportingService: MessageReportingService, colorService: ColorService) {

			$log.debug('START itemService()');
			const itemService = new ItemService($log, $scope, $http, eventService,
				messageReportingService, colorService);
			$log.debug('END itemService()');
			return itemService;
		}]);
}
