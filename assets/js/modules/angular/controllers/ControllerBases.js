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

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class ComicDataControllerBase<TScope: Object> {
	$scope: $DecoratedScope<TScope>;
	eventService: EventService;

	constructor(
		$scope: $DecoratedScope<TScope>,
		eventService: EventService
	) {
		this.$scope = $scope;
		this.eventService = eventService;

		eventService.comicDataLoadingEvent.subscribe($scope,
			(event, comic) => {
				$scope.safeApply(() => {
					this._comicDataLoading(comic);
				});
			});

		eventService.comicDataLoadedEvent.subscribe($scope,
			(event, comicData) => {
				$scope.safeApply(() => {
					this._comicDataLoaded(comicData);
				});
			});

		eventService.comicDataErrorEvent.subscribe($scope,
			(event, error) => {
				$scope.safeApply(() => {
					this._comicDataError(error);
				});
			});

		eventService.itemsChangedEvent.subscribe($scope,
			(event, data) => {
				$scope.safeApply(() => {
					this._itemsChanged();
				});
			});
	}

	_comicDataLoading(comic: number) {
	}

	_comicDataLoaded(comicData: ComicData) {
	}

	_comicDataError(error: any) {
	}

	_itemsChanged() {
	}
}

export class SetValueControllerBase<TScope: Object> extends ComicDataControllerBase<TScope> {
	comicService: ComicService;

	unique: string;

	constructor(
		$scope: $DecoratedScope<TScope>,
		comicService: ComicService,
		eventService: EventService
	) {
		super($scope, eventService);

		this.comicService = comicService;

		this.unique = Math.random().toString(36).slice(-5);
	}

	_updateValue() {
	}

	keyPress(event: KeyboardEvent) {
		if (event.keyCode === 13) {
			// ENTER key
			this._updateValue();
		}
	}
}
