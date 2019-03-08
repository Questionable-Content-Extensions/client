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

/*! Code found at https://gist.github.com/borismus/1032746
 * License: Unknown */
const BASE64_MARKER = ';base64,';
export function convertDataUriToBinary(dataUri: string) {
	const base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	const base64 = dataUri.substring(base64Index);
	const raw = window.atob(base64);
	const rawLength = raw.length;
	const array = new Uint8Array(new ArrayBuffer(rawLength));

	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array;
}

export function convertDataUritoBlob(dataUri: string) {
	const splitDataUri = dataUri.split(',');
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	const byteString = atob(splitDataUri[1]);

	// separate out the mime component
	const mimeString = splitDataUri[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	const buffer = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	const byteArray = new Uint8Array(buffer);

	// set the bytes of the buffer to the correct values
	for (let i = 0; i < byteString.length; i++) {
		byteArray[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([buffer], { type: mimeString });
	return blob;
}