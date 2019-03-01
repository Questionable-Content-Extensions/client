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

export function nl2br(str: string, isXhtml: boolean) {
	const breakTag = isXhtml ||
		typeof isXhtml === 'undefined' ?
		'<br />' : '<br>';

	return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
		'$1' + breakTag + '$2');
}

const comicLinkRegexp =
/<a[^>]*href=(?:"|')(?:http:\/\/(?:www\.)?questionablecontent.net\/)?view\.php\?comic=(\d+)(?:"|')[^>]*>/;
export function angularizeLinks(str: string) {
	return String(str).replace(comicLinkRegexp,
		'<a ng-href="view.php?comic=$1">');
}
