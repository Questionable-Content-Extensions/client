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

import './modules/jQuery.changeElementType';

import settings from './modules/settings';
import DomModifier from './modules/dom-modifier';
import { setup as setupAngular } from './modules/angular-app';

(async () => {
	await settings.loadSettings();

	const domModifier = new DomModifier();
	domModifier.modify();

	setupAngular();

	// Let's go!
	angular.bootstrap($('html').get(0), ['qc-spa']);
})();
