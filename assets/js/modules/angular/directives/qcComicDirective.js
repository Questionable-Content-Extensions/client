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
import variables from '../../../../generated/variables.pass2';

import constants from '../../../constants';
import settings from '../../settings';

import { EventHandlingControllerBase } from '../controllers/ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { EventService } from '../services/eventService';
import type { ComicService } from '../services/comicService';
import type { MessageReportingService } from '../services/messageReportingService';

import type { ComicData } from '../api/comicData';

// TODO: once the directive has been set up and the image loaded, remove the original.
export class ComicController extends EventHandlingControllerBase<ComicController> {
	static $inject: string[];

	$scope: $DecoratedScope<ComicController>;
	$log: $Log;

	comicService: ComicService;
	messageReportingService: MessageReportingService;

	isInitializing: boolean;
	isLoading: boolean;
	comicImage: string;

	comicDataCache: { [number]: string };

	originalComicAnchor: ?JQuery;
	imageLoadingTimeout: ?any;

	constructor(
		$scope: $DecoratedScope<ComicController>,
		$log: $Log,
		eventService: EventService,
		comicService: ComicService,
		messageReportingService: MessageReportingService
	) {
		$log.debug('START ComicController');

		super($scope, eventService);
		this.$log = $log;

		this.comicService = comicService;
		this.messageReportingService = messageReportingService;

		this.isInitializing = true;
		this.isLoading = true;
		this.comicDataCache = {};

		const comicImg = $('img[src*="/comics/"]');
		this.originalComicAnchor = comicImg.parent('a');

		$log.debug('END ComicController');
	}

	_comicImageLoaded(src: ?string) {

		if (this.imageLoadingTimeout) {
			window.clearTimeout(this.imageLoadingTimeout);
			this.imageLoadingTimeout = null;
		}

		this.$scope.safeApply(() => {
			if (src) {
				this.comicImage = src;
			}
			this.isLoading = false;

			if (this.isInitializing) {
				if (this.originalComicAnchor) {
					this.originalComicAnchor.remove();
					this.originalComicAnchor = null;
				}
				this.isInitializing = false;
			}
		});
	}

	_comicImageError(comic: number) {
		this.messageReportingService.reportError('Could not load image for comic ' + comic);
		this._comicImageLoaded(null);
	}

	_extensionImageLoading(comic: number, imageExtension: string) {
		const downloadingImage = new Image();
		downloadingImage.onload = () => {
			this.comicDataCache[comic] = imageExtension;
			this._comicImageLoaded(downloadingImage.src);
		};
		downloadingImage.onerror = () => {
			this._comicImageError(comic);
		};
		const imageUrl = `${window.location.origin}/comics/${comic}.${imageExtension}`;
		downloadingImage.src = imageUrl;
	}

	_fallbackImageLoading(comic: number) {
		let comicExtensionIndex = 0;

		const downloadingImage = new Image();
		downloadingImage.onload = () => {
			this.$log.debug('ComicController::_fallbackImageLoading() -- Image loaded');
			this.comicDataCache[comic] = constants.comicExtensions[comicExtensionIndex];
			this._comicImageLoaded(downloadingImage.src);
		};
		downloadingImage.onerror = () => {
			this.$log.debug('ComicController::_fallbackImageLoading() -- Image failed to load');
			if (comicExtensionIndex < constants.comicExtensions.length - 1) {
				comicExtensionIndex++;
				this.$log.debug('ComicController::_fallbackImageLoading() -- Trying ' + constants.comicExtensions[comicExtensionIndex]);
				const imageUrl = `${window.location.origin}/comics/${comic}.${constants.comicExtensions[comicExtensionIndex]}`;
				downloadingImage.src = imageUrl;
			} else {
				this._comicImageError(comic);
			}
		};

		this.$log.debug('ComicController::_fallbackImageLoading() -- Trying ' + constants.comicExtensions[comicExtensionIndex]);
		const imageUrl = `${window.location.origin}/comics/${comic}.${constants.comicExtensions[comicExtensionIndex]}`;
		downloadingImage.src = imageUrl;
	}

	_comicDataLoading(comic: number) {
		let comicLoadingIndicatorDelay = settings.values.comicLoadingIndicatorDelay;
		if (comicLoadingIndicatorDelay < 0) {
			comicLoadingIndicatorDelay = 0;
		}
		if (this.imageLoadingTimeout) {
			window.clearTimeout(this.imageLoadingTimeout);
			this.imageLoadingTimeout = null;
		}
		this.imageLoadingTimeout = window.setTimeout(() => {
			this.$log.debug('ComicController::_comicDataLoading - imageLoadingTimeout triggered');
			this.imageLoadingTimeout = null;
			this.$scope.safeApply(() => {
				this.isLoading = true;
			});
		}, comicLoadingIndicatorDelay);

		if (comic in this.comicDataCache) {
			this._extensionImageLoading(comic, this.comicDataCache[comic]);
		}
	}

	_comicDataLoaded(comicData: ComicData) {
		if (comicData.comic in this.comicDataCache) {
			return;
		}

		if (!comicData.hasData) {
			this._fallbackImageLoading(this.comicService.comic);
			return;
		}

		if (comicData.imageType == 'unknown') {
			this._fallbackImageLoading(comicData.comic);
			return;
		}

		let imageExtension = comicData.imageType;
		if (imageExtension == 'jpeg') imageExtension = 'jpg';
		this._extensionImageLoading(comicData.comic, imageExtension);
	}

	_comicDataError(error: any) {
		this._fallbackImageLoading(this.comicService.comic);
	}

}
ComicController.$inject = [
	'$scope',
	'$log',
	'eventService',
	'comicService',
	'messageReportingService'
];

export default function (app: AngularModule) {
	app.directive('qcComic', function () {
		return {
			restrict: 'E',
			scope: {},
			controller: ComicController,
			controllerAs: 'c',
			template: variables.html.comic
		};
	});
}
