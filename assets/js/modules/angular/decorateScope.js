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

import GM from 'greasemonkey';

import type { $Scope } from 'angular';

export type $DecoratedScope<T> = $Scope<T> & {
	safeApply(fn: Function): void;
};

export default function ($provide: any) {
	$provide.decorator('$rootScope', ['$delegate', function ($delegate) {
		const $rootScopePrototype = Object.getPrototypeOf($delegate);
		$rootScopePrototype.safeApply = function (fn) {
			const phase = this.$root.$$phase;
			if (phase === '$apply' || phase === '$digest') {
				if (fn && typeof fn === 'function') {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		return $delegate;
	}]);
}
