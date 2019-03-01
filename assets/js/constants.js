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

// Set this to true when working against your local test server.
// NEVER CHECK THIS FILE IN WITH developmentMode = true!
const developmentMode = false;

function getSiteUrl() {
	if (developmentMode) {
		return 'http://localhost:3000/';
	} else {
		return 'https://questionablextensions.net/';
	}
}

function getWebserviceBaseUrl() {
	if (developmentMode) {
		return 'http://localhost:3000/api/';
	} else {
		return 'https://questionablecontent.herokuapp.com/api/';
	}
}

const comicDataUrl = getWebserviceBaseUrl() + 'comicdata/';
const itemDataUrl = getWebserviceBaseUrl() + 'itemdata/';

const constants = {
	settingsKey: 'settings',

	developmentMode,
	siteUrl: getSiteUrl(),
	comicDataUrl,
	itemDataUrl,

	// Comics after 3132 should have a tagline
	taglineThreshold: 3132,

	addItemToComicUrl: comicDataUrl + 'additem',
	removeItemFromComicUrl: comicDataUrl + 'removeitem',
	setComicTitleUrl: comicDataUrl + 'settitle',
	setComicTaglineUrl: comicDataUrl + 'settagline',
	setPublishDateUrl: comicDataUrl + 'setpublishdate',
	setGuestComicUrl: comicDataUrl + 'setguest',
	setNonCanonUrl: comicDataUrl + 'setnoncanon',

	itemFriendDataUrl: itemDataUrl + 'friends/',
	itemLocationDataUrl: itemDataUrl + 'locations/',
	setItemDataPropertyUrl: itemDataUrl + 'setproperty',

	characterImageBaseUrl: getSiteUrl() + 'images/characters/',
	characterImageExtension: 'png',

	comicExtensions: ['png', 'gif', 'jpg'],

	comicdataLoadingEvent: 'comicdata-loading',
	comicdataLoadedEvent: 'comicdata-loaded',
	comicdataErrorEvent: 'comicdata-error',
	itemsChangedEvent: 'items-changed',

	messages: {
		maintenance: 'The Questionable Extensions' +
			' server is currently undergoing maintenance.' +
			' Normal operation should resume within a' +
			' few minutes.'
	}
};

export default constants;
