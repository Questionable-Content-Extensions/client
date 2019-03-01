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

import type { AngularModule, $Log } from 'angular';

import constants from '../../../constants';

import type { Event, EventFactory } from './eventFactory';
import type { ComicData } from '../api/comicData';

export class EventService {
	$log: $Log;

	comicDataLoadingEvent: Event<number>;
	comicDataLoadedEvent: Event<ComicData>;
	comicDataErrorEvent: Event<any>;
	itemsChangedEvent: Event<any>;

	constructor($log: $Log, eventFactory: EventFactory) {
		this.$log = $log;

		this.comicDataLoadingEvent = eventFactory<number>(constants.comicdataLoadingEvent);
		this.comicDataLoadedEvent = eventFactory<ComicData>(constants.comicdataLoadedEvent);
		this.comicDataErrorEvent = eventFactory<any>(constants.comicdataErrorEvent); // TODO: Figure out this type
		this.itemsChangedEvent = eventFactory<any>(constants.itemsChangedEvent);
	}
}

export default function (app: AngularModule) {
	app.service('eventService', ['$log', 'eventFactory',
		function<T>($log: $Log, eventFactory: EventFactory) {
			$log.debug('START eventService()');
			const eventService = new EventService($log, eventFactory);
			$log.debug('END eventService()');
			return eventService;
		}]);
}
