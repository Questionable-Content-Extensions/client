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

import type { AngularModule, $Log, $Scope } from 'angular';

import type { RootScope } from '../scopes/rootScope';

export class Event<T> {
	static $log: $Log;
	static $rootScope: $Scope<RootScope>;

	eventName: string;

	constructor(eventName: string) {
		this.eventName = eventName;
	}

	//$FlowFixMe when Flow properly supports generics
	subscribe(scope: $Scope<*>, callback: (event: string, eventData?: T) => void) {
		const handle = Event.$rootScope.$on(this.eventName, callback);
		scope.$on('$destroy', handle);
	}

	publish(data?: T) {
		const eventData: [string, ?T] = [this.eventName, null];

		if (data != null) {
			eventData[1] = data;
		}

		Event.$log.debug('Event data: ', eventData);
		Event.$rootScope.$emit.apply(Event.$rootScope, eventData);
	}
}

export type EventFactory = <T>(eventName: string) => Event<T>;

export default function (app: AngularModule) {
	app.factory('eventFactory', ['$rootScope', '$log',
		function ($rootScope: $Scope<RootScope>, $log: $Log) {
			$log.debug('START eventFactory()');
			Event.$rootScope = $rootScope;
			Event.$log = $log;

			$log.debug('END eventFactory()');
			return <T>(eventName: string) => new Event<T>(eventName);
		}]);
}
