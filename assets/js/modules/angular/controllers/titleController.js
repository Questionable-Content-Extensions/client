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

import constants from '../../../constants';

import { EventHandlingControllerBase } from './ControllerBases';

import type { $DecoratedScope } from '../decorateScope';
import type { EventService } from '../services/eventService';
import type { ComicData } from '../api/comicData';

export class TitleController extends EventHandlingControllerBase<TitleController> {
	static $inject: string[];

	$log: $Log;

	title: string;

	constructor(
		$scope: $DecoratedScope<TitleController>,
		$log: $Log,
		eventService: EventService
	) {
		$log.debug('START TitleController');

		super($scope, eventService);

		this.$log = $log;

		this.title = 'Loading Questionable Content Extension...';

		$log.debug('END TitleController');
	}

	_comicDataLoading(comic: number) {
		this.title = `Loading #${comic} — Questionable Content`;
	}

	_comicDataLoaded(comicData: ComicData) {
		if (comicData.hasData && comicData.title) {
			this.title = `#${comicData.comic}: ${comicData.title} — Questionable Content`;
		} else {
			this.title = `#${comicData.comic} — Questionable Content`;
		}
	}

}
TitleController.$inject = ['$scope', '$log', 'eventService'];

export default function (app: AngularModule) {
	app.controller('titleController', TitleController);
}
