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
import type { AngularModule, $Log, $Scope, AngularHttpService, $Location } from 'angular';
import type { $StateParams } from 'angular-ui';

import constants from '../../../constants';
import settings from '../../settings';

import type { EventService } from './eventService';
import type { ColorService } from './colorService';
import type { StyleService } from './styleService';
import type { MessageReportingService } from './messageReportingService';
import type { ComicData, ComicItem } from '../api/comicData.js';

export class ComicService {
	$log: $Log;
	$stateParams: $StateParams;
	$location: $Location;
	$scope: $Scope<Object>;
	$http: AngularHttpService;
	latestComic: number;
	eventService: EventService;
	colorService: ColorService;
	styleService: StyleService;
	messageReportingService: MessageReportingService;

	comic: number;
	nextComic: number;
	previousComic: number;
	comicExtensionIndex: number;
	comicExtension: string;
	comicData: ComicData;

	constructor($log: $Log, $stateParams: $StateParams, $location: $Location,
		$scope: $Scope<Object>, $http: AngularHttpService, latestComic: number, eventService: EventService,
		colorService: ColorService, styleService: StyleService,
		messageReportingService: MessageReportingService) {
		this.$log = $log;
		this.$stateParams = $stateParams;
		this.$location = $location;
		this.$scope = $scope;
		this.$http = $http;
		this.latestComic = latestComic;
		this.eventService = eventService;
		this.colorService = colorService;
		this.styleService = styleService;
		this.messageReportingService = messageReportingService;

		$scope.$on('$stateChangeSuccess', () => {
			this._updateComic();
			this.refreshComicData();
		});
	}

	_updateComic() {
		let comic;
		if (typeof this.$stateParams.comic === 'string') {
			comic = Number(this.$stateParams.comic);
		} else {
			comic = this.latestComic;
		}

		this.$log.debug('ComicService:_updateComic(): Comic is', comic);

		this.comic = comic;
		this.nextComic = this.comic + 1 > this.latestComic ?
			this.latestComic : this.comic + 1;
		this.previousComic = this.comic - 1 < 1 ? 1 : this.comic - 1;
		this.comicExtensionIndex = 0;
		this.comicExtension =
			constants.comicExtensions[this.comicExtensionIndex];

		if (settings.values.scrollToTop) {
			$(window).scrollTop(0);
		}
	}

	// TODO: Add proper response type
	_onErrorLog(response: any) {
		if (response.status !== 503) {
			this.messageReportingService.reportError(response.data);
		} else {
			this.eventService.maintenanceEvent.publish();
		}
		return response;
	}

	// TODO: Add proper response type
	_onSuccessRefreshElseErrorLog(response: any) {
		if (response.status === 200) {
			this.refreshComicData();
		} else {
			this._onErrorLog(response);
		}
		return response;
	}

	_fixItem(item: ComicItem) {
		if (item.first == this.comic) {
			item.first = null;
		}

		if (item.last == this.comic) {
			item.last = null;
		}

		this.styleService.addItemStyle(item.id,
			item.color);
	}

	refreshComicData() {
		if (typeof this.comic === 'undefined') {
			this.$log.debug('comicService::refreshComicData() called ' +
				'before the comicService was properly initialized. ' +
				'Ignored.');
			return;
		}

		this.eventService.comicDataLoadingEvent.publish(this.comic);

		let comicDataUrl = constants.comicDataUrl + this.comic;
		const urlParameters = {};
		if (settings.values.editMode) {
			urlParameters.token = settings.values.editModeToken;
		}
		if (settings.values.skipGuest) {
			urlParameters.exclude = 'guest';
		} else if (settings.values.skipNonCanon) {
			urlParameters.exclude = 'non-canon';
		}
		if (settings.values.showAllMembers) {
			urlParameters.include = 'all';
		}
		const urlQuery = $.param(urlParameters);
		if (urlQuery) {
			comicDataUrl += '?' + urlQuery;
		}

		this.$log.debug('comicService:refreshComicData(): URL is', comicDataUrl);
		this.$http.get(comicDataUrl)
			.then((response) => {
				if (response.status === 503) {
					this.eventService.maintenanceEvent.publish(response);
					return;
				}
				if (response.status !== 200) {
					this._onErrorLog(response);
					this.eventService.comicDataErrorEvent.publish(response);
					return;
				}

				const comicData = response.data;
				if (comicData.hasData) {
					if (comicData.next !== null) {
						this.nextComic = comicData.next;
					} else {
						this.nextComic = this.comic + 1 > this.latestComic ?
							this.latestComic : this.comic + 1;
					}
					if (comicData.previous !== null) {
						this.previousComic = comicData.previous;
					} else {
						this.previousComic = this.comic - 1 < 1 ? 1 :
							this.comic - 1;
					}

					angular.forEach(comicData.items, item => this._fixItem(item));
					if (settings.values.showAllMembers) {
						angular.forEach(comicData.allItems, item => this._fixItem(item));
					}
				} else {
					this.nextComic = this.comic + 1 > this.latestComic ?
						this.latestComic : this.comic + 1;
					this.previousComic = this.comic - 1 < 1 ? 1 :
						this.comic - 1;

					if (settings.values.showAllMembers) {
						angular.forEach(comicData.allItems, item => this._fixItem(item));
					}
				}

				comicData.comic = this.comic;
				this.comicData = comicData;
				this.eventService.comicDataLoadedEvent.publish(this.comicData);
			}).catch((errorResponse) => {
				this._onErrorLog(errorResponse);
				this.eventService.comicDataErrorEvent.publish(errorResponse);
			});
	}

	addItemToComic(item: ComicItem) {
		const data: {
			token: string,
			comicId: number,
			itemId: number,
			newItemName?: string,
			newItemType?: string
		} = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			itemId: item.id
		};
		if (item.id === -1) {
			data.newItemName = item.name;
			data.newItemType = item.type;
		}

		return this.$http.post(constants.addItemToComicUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	removeItem(item: ComicItem) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			itemId: item.id
		};
		return this.$http.post(constants.removeItemFromComicUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setTitle(title: string) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			title: title
		};
		return this.$http.post(constants.setComicTitleUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setTagline(tagline: string) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			tagline: tagline
		};
		return this.$http.post(constants.setComicTaglineUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setPublishDate(publishDate: Date, isAccurate: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			publishDate: publishDate,
			isAccuratePublishDate: isAccurate
		};
		return this.$http.post(constants.setPublishDateUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setGuestComic(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setGuestComicUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setNonCanon(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setNonCanonUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setNoCast(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setNoCastUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setNoLocation(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setNoLocationUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setNoStoryline(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setNoStorylineUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setNoTitle(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setNoTitleUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	setNoTagline(value: boolean) {
		const data = {
			token: settings.values.editModeToken,
			comicId: this.comic,
			flagValue: value
		};
		return this.$http.post(constants.setNoTaglineUrl, data)
			.then(r => this._onSuccessRefreshElseErrorLog(r)).catch(r => this._onErrorLog(r));
	}

	gotoComic(comicNo: number) {
		this.$location.url('/view.php?comic=' + comicNo);
	}

	canFallback() {
		return this.comicExtensionIndex <
			constants.comicExtensions.length - 1;
	}

	tryFallback() {
		this.comicExtensionIndex++;
		this.comicExtension = constants
			.comicExtensions[this.comicExtensionIndex];
	}

	first() {
		this.gotoComic(1);
	};

	previous() {
		this.gotoComic(this.previousComic);
	};

	next() {
		this.gotoComic(this.nextComic);
	};

	last() {
		this.gotoComic(this.latestComic);
	};

	nextRandomComic() {
		let randomComic = this.comic;
		while (randomComic == this.comic) {
			randomComic = Math.floor(Math.random() *
				(parseInt(this.latestComic) + 1));
		}
		return randomComic;
	}

	async nextFilteredRandomComic() {
		if (!settings.values.skipGuest && !settings.values.skipNonCanon) {
			return this.nextRandomComic();
		}

		const urlParameters = {};
		if (settings.values.skipGuest) {
			urlParameters.exclusion = 'guest';
		} else if (settings.values.skipNonCanon) {
			urlParameters.exclusion = 'non-canon';
		}
		const urlQuery = $.param(urlParameters);
		const excludedComicsUrl = constants.excludedComicsUrl + '?' + urlQuery;

		const exclusionResponse = await this.$http.get(excludedComicsUrl);
		const excludedComics = exclusionResponse.data.map(c => c.comic);
		if (exclusionResponse.status !== 200) {
			return this.nextRandomComic();
		}

		this.$log.debug('comicService::nextFilteredRandomComic() excluded comics', excludedComics);

		let nextRandomComic = this.comic;
		while (nextRandomComic == this.comic || excludedComics.includes(nextRandomComic)) {
			nextRandomComic = this.nextRandomComic();
		}
		return nextRandomComic;
	}
}

export default function (app: AngularModule) {
	app.service('comicService', ['$log', '$stateParams', '$location',
		'$rootScope', '$http', 'latestComic', 'eventService', 'colorService',
		'styleService', 'messageReportingService',
		function ($log: $Log, $stateParams: $StateParams, $location: $Location,
			$scope: $Scope<Object>, $http: AngularHttpService, latestComic: number, eventService: EventService,
			colorService: ColorService, styleService: StyleService,
			messageReportingService: MessageReportingService) {

			$log.debug('START comicService()');
			const comicService = new ComicService($log, $stateParams, $location, $scope,
				$http, latestComic, eventService, colorService, styleService,
				messageReportingService);
			$log.debug('END comicService()');
			return comicService;
		}]);
}
