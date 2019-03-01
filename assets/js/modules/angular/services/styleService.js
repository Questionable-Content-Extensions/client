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

import $ from 'jquery';
import type { AngularModule, $Log } from 'angular';

import type { ColorService } from './colorService';

function addStyle(style: string) {
	const styleElement =
		$('<style type="text/css">' + style + '</style>');
	$('head').append(styleElement);
	return styleElement;
}

export class StyleService {
	$log: $Log;
	colorService: ColorService;

	customStyles: {};
	customStyleElements: {};

	constructor($log: $Log, colorService: ColorService) {
		this.$log = $log;
		this.colorService = colorService;

		this.customStyles = {};
		this.customStyleElements = {};
	}

	_hasCustomStyle(key: string) {
		return key in this.customStyles;
	}

	_addCustomStyle(key: string, style: string) {
		if (this._hasCustomStyle(key)) {
			return;
		}

		const styleElement = addStyle(style);
		this.customStyles[key] = style;
		this.customStyleElements[key] = styleElement;
	}

	_removeCustomStyle(key: string) {
		delete this.customStyles[key];
		this.customStyleElements[key].remove();
		delete this.customStyleElements[key];
	}

	addItemStyle(id: number, color: string) {
		const itemId = 'item_' + id;
		if (!this._hasCustomStyle(itemId)) {
			const qcNavItem = '#qcnav_item_' + id + ' > table';
			const qcNavItemWithColor = qcNavItem + '.with_color';

			const backgroundColor = color;
			const foregroundColor = this.colorService.createTintOrShade(color);
			const hoverFocusColor = this.colorService.createTintOrShade(color, 2);

			const itemStyle =
				qcNavItemWithColor + '{' +
				'background-color:' + backgroundColor + ';' +
				'}' +
				qcNavItemWithColor + ',' +
				qcNavItemWithColor + ' a.qcnav_name_link,' +
				qcNavItemWithColor + ' a:link,' +
				qcNavItemWithColor + ' a:visited{' +
				'color:' + foregroundColor + ';' +
				'}' +
				qcNavItem + ' a.qcnav_name_link{' +
				'cursor: pointer;' +
				'text-decoration: none;' +
				'}' +
				qcNavItemWithColor + ' a:hover,' +
				qcNavItemWithColor + ' a:focus{' +
				'color: ' + hoverFocusColor + ';' +
				'}';

			this._addCustomStyle(itemId, itemStyle);
		}
	}

	removeItemStyle(id: number) {
		const itemId = 'item_' + id;
		if (this._hasCustomStyle(itemId)) {
			this._removeCustomStyle(itemId);
		}
	}

	hasItemStyle(id: number) {
		const itemId = 'item_' + id;
		return this._hasCustomStyle(itemId);
	}
}

export default function (app: AngularModule) {
	app.service('styleService', ['$log', 'colorService',
		function ($log: $Log, colorService: ColorService) {
			$log.debug('START styleService()');
			const styleService = new StyleService($log, colorService);
			$log.debug('END styleService()');
			return styleService;
		}]);
}
