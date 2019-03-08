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

import type { AngularModule, $Log, $Scope } from 'angular';

import settings from '../../settings';

import type { $DecoratedScope } from '../decorateScope';
import type { ComicService } from '../services/comicService';

export default function (app: AngularModule) {
	app.controller('bodyController', ['$log', '$scope', 'comicService',
		function ($log: $Log, $scope: $DecoratedScope<any>, comicService: ComicService) {
			$log.debug('START bodyController()');

			const isStupidFox =
				navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

			function previous() {
				$scope.$apply(function () {
					comicService.previous();
				});
			}

			function next() {
				$scope.$apply(function () {
					comicService.next();
				});
			}

			const shortcut =
				window.eval('window.shortcut');

			// Firefox balks at me trying to use the "shortcut" object from
			// my user script. Works just fine in Chrome. I can't be bothered
			// to cater to one browser's stupidity.
			if (isStupidFox) {
				const shortcutRemove =
					window.eval('window.shortcut.remove').bind(shortcut);
				shortcutRemove('Left');
				shortcutRemove('Right');

				// This is a sort of replacement for "shortcut". Only supports
				// simple Left/Right navigation. Is missing the editor mode
				// shortcuts because Firefox is behaving like shit.
				window.addEventListener('keydown', function (event) {
					// Only if no special keys are held down
					if (event.altKey || event.ctrlKey || event.metaKey ||
						event.shiftKey) {
						return;
					}

					if (event.keyCode === 37) {
						// LEFT
						previous();
					} else if (event.keyCode === 39) {
						// RIGHT
						next();
					}
				}, false);
			} else {
				// See how nice it can be done when your browser doesn't
				// actively try to sabotage you?
				shortcut.remove('Left');
				shortcut.remove('Right');

				shortcut.add('Left', previous,
					{ disable_in_input: true });
				shortcut.add('Ctrl+Left', previous);

				shortcut.add('Right', next,
					{ disable_in_input: true });
				shortcut.add('Ctrl+Right', next);

				shortcut.add('Q', function () {
					if (settings.values.editMode) {
						$('input[id^="addItem"]').focus();
					}
				}, { disable_in_input: true });
			}
			$log.debug('END bodyController()');
		}]);
}
